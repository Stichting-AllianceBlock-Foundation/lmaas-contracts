// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';

contract RewardsPoolBase is ReentrancyGuard, Ownable {
    using SafeERC20Detailed for IERC20Detailed;

    uint256 constant PRECISION = 1000000000000000000;

    uint256 public totalStaked;
    uint256[] private totalClaimed;
    uint256[] private totalSpentRewards;

    uint256[] public rewardPerSecond;
    address[] public rewardsTokens;

    IERC20Detailed public stakingToken;

    uint256 public startTimestamp;
    uint256 public endTimestamp;
    uint256 private lastRewardTimestamp;

    uint256[] public accumulatedRewardMultiplier;

    uint256 public stakeLimit;
    uint256 public contractStakeLimit;

    struct UserInfo {
        uint256 firstStakedTimestamp;
        uint256 amountStaked; // How many tokens the user has staked.
        uint256[] rewardDebt; //
        uint256[] tokensOwed; // How many tokens the contract owes to the user.
    }

    mapping(address => UserInfo) public userInfo;

    event Started();
    event Staked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount, address token);
    event Withdrawn(address indexed user, uint256 amount);
    event Exited(address indexed user, uint256 amount);
    event Extended(uint256 newEndTimestamp, uint256[] newRewardsPerSecond);
    event WithdrawLPRewards(uint256 indexed rewardsAmount, address indexed recipient);

    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit
    ) {
        require(address(_stakingToken) != address(0), 'RewardsPoolBase: invalid staking token');

        require(_stakeLimit != 0 && _contractStakeLimit != 0, 'RewardsPoolBase: invalid stake limit');

        require(_rewardsTokens.length > 0, 'RewardsPoolBase: empty rewardsTokens');

        stakingToken = _stakingToken;
        rewardsTokens = _rewardsTokens;
        stakeLimit = _stakeLimit;
        contractStakeLimit = _contractStakeLimit;

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            accumulatedRewardMultiplier.push(0);
            totalClaimed.push(0);
            totalSpentRewards.push(0);
        }
    }

    modifier onlyInsideBounds() {
        uint256 currentTimestamp = block.timestamp;
        require(
            (startTimestamp > 0 && currentTimestamp > startTimestamp) && (currentTimestamp <= endTimestamp),
            'RewardsPoolBase: staking is not started or is finished'
        );
        _;
    }

    modifier onlyUnderStakeLimit(address staker, uint256 newStake) {
        UserInfo storage user = userInfo[staker];
        require(
            (user.amountStaked + newStake <= stakeLimit) && (totalStaked + newStake <= contractStakeLimit),
            'onlyUnderStakeLimit::Stake limit reached'
        );
        _;
    }

    function start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) public virtual onlyOwner {
        _start(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    function _start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) internal {
        require(startTimestamp == 0, 'RewardsPoolBase: already started');
        require(
            _startTimestamp >= block.timestamp && _endTimestamp > _startTimestamp,
            'RewardsPoolBase: invalid start or end'
        );

        require(_rewardPerSecond.length == rewardsTokens.length, 'RewardsPoolBase: invalid rewardPerSecond');
        rewardPerSecond = _rewardPerSecond;

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            uint256 rewardsAmount = calculateRewardsAmount(_startTimestamp, _endTimestamp, rewardPerSecond[i]);

            uint256 balance = IERC20Detailed(rewardsTokens[i]).balanceOf(address(this));

            require(balance >= rewardsAmount, 'RewardsPoolBase: not enough rewards');
        }

        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;

        emit Started();
    }

    /** @dev Providing LP tokens to stake, update rewards.
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual nonReentrant {
        _stake(_tokenAmount, msg.sender, true);
    }

    /** @dev Providing LP tokens to stake, update rewards.
     * @param _tokenAmount The amount to be staked
     * @param staker The staker to be associated with the stake
     * @param chargeStaker Whether to draw from the staker or from the msg.sender
     */
    function _stake(
        uint256 _tokenAmount,
        address staker,
        bool chargeStaker
    ) internal onlyInsideBounds onlyUnderStakeLimit(staker, _tokenAmount) {
        require(_tokenAmount > 0, 'RewardsPoolBase: cannot stake 0');

        UserInfo storage user = userInfo[staker];

        // if no amount has been staked this is considered the initial stake
        if (user.amountStaked == 0) {
            user.firstStakedTimestamp = block.timestamp;
        }

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(staker); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked + _tokenAmount;
        totalStaked = totalStaked + _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            user.rewardDebt[i] = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
        }

        stakingToken.safeTransferFrom(address(chargeStaker ? staker : msg.sender), address(this), _tokenAmount);

        emit Staked(staker, _tokenAmount);
    }

    /** @dev Claiming accrued rewards
     */
    function claim() public virtual nonReentrant {
        _claim(msg.sender);
    }

    function _claim(address claimer) internal {
        UserInfo storage user = userInfo[claimer];
        updateRewardMultipliers();
        updateUserAccruedReward(claimer);

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 reward = user.tokensOwed[i];
            user.tokensOwed[i] = 0;

            IERC20Detailed(rewardsTokens[i]).safeTransfer(claimer, reward);
            totalClaimed[i] = totalClaimed[i] + reward;

            emit Claimed(claimer, reward, rewardsTokens[i]);
        }
    }

    /** @dev Withdrawing portion of staked tokens.
     * @param _tokenAmount The amount to be withdrawn
     */
    function withdraw(uint256 _tokenAmount) public virtual nonReentrant {
        _withdraw(_tokenAmount, msg.sender);
    }

    function _withdraw(uint256 _tokenAmount, address withdrawer) internal {
        require(_tokenAmount > 0, 'RewardsPoolBase: cannot withdraw 0');

        UserInfo storage user = userInfo[withdrawer];

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(withdrawer); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked - _tokenAmount;
        totalStaked = totalStaked - _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
            user.rewardDebt[i] = totalDebt;
        }

        stakingToken.safeTransfer(address(withdrawer), _tokenAmount);

        emit Withdrawn(withdrawer, _tokenAmount);
    }

    /** @dev Claiming all rewards and withdrawing all staked tokens. Exits from the rewards pool
     */
    function exit() public virtual nonReentrant {
        _exit(msg.sender);
    }

    function _exit(address exiter) internal {
        UserInfo storage user = userInfo[exiter];
        _claim(exiter);
        _withdraw(user.amountStaked, exiter);

        emit Exited(exiter, user.amountStaked);
    }

    /** @dev Returns the amount of tokens the user has staked
     */
    function balanceOf(address _userAddress) public view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.amountStaked;
    }

    /**
		@dev updates the accumulated reward multipliers for everyone and each token
	 */
    function updateRewardMultipliers() public {
        uint256 currentTimestamp = block.timestamp;

        if (currentTimestamp <= lastRewardTimestamp) {
            return;
        }

        uint256 applicableTimestamp = (currentTimestamp < endTimestamp) ? currentTimestamp : endTimestamp;

        uint256 secondsSinceLastReward = applicableTimestamp - lastRewardTimestamp;

        if (secondsSinceLastReward == 0) {
            // Nothing to update
            return;
        }

        if (totalStaked == 0) {
            lastRewardTimestamp = applicableTimestamp;
            return;
        }

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 newReward = secondsSinceLastReward * rewardPerSecond[i]; // Get newly accumulated reward
            uint256 rewardMultiplierIncrease = (newReward * PRECISION) / totalStaked; // Calculate the multiplier increase
            accumulatedRewardMultiplier[i] = accumulatedRewardMultiplier[i] + rewardMultiplierIncrease; // Add the multiplier increase to the accumulated multiplier
        }

        lastRewardTimestamp = applicableTimestamp;
    }

    /**
		@dev updates the accumulated reward for the user with the _userAddress address
		@param _userAddress the address of the updated user
	 */
    function updateUserAccruedReward(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        uint256 rewardsTokensLength = rewardsTokens.length;

        if (user.rewardDebt.length == 0) {
            // Initialize user struct

            for (uint256 i = 0; i < rewardsTokensLength; i++) {
                user.rewardDebt.push(0);
                user.tokensOwed.push(0);
            }
        }

        if (user.amountStaked == 0) {
            return;
        }

        for (uint256 tokenIndex = 0; tokenIndex < rewardsTokensLength; tokenIndex++) {
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[tokenIndex]) / PRECISION;
            uint256 pendingDebt = totalDebt - user.rewardDebt[tokenIndex];

            if (pendingDebt > 0) {
                user.tokensOwed[tokenIndex] = user.tokensOwed[tokenIndex] + pendingDebt;
                user.rewardDebt[tokenIndex] = totalDebt;
            }
        }
    }

    function hasStakingStarted() public view returns (bool) {
        return (startTimestamp > 0 && block.timestamp >= startTimestamp);
    }

    function getUserRewardDebt(address _userAddress, uint256 _index) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt[_index];
    }

    function getUserOwedTokens(address _userAddress, uint256 _index) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed[_index];
    }

    /**
		@dev Simulate all conditions in order to calculate the calculated reward at the moment
		@param _userAddress the address of the user
		@param tokenIndex the index of the reward token you are interested
	 */
    function getUserAccumulatedReward(
        address _userAddress,
        uint256 tokenIndex,
        uint256 _currentTimestamp
    ) public view returns (uint256) {
        uint256 applicableTimestamp = (_currentTimestamp < endTimestamp) ? _currentTimestamp : endTimestamp;

        uint256 secondsSinceLastReward = applicableTimestamp - lastRewardTimestamp;

        uint256 newReward = secondsSinceLastReward * rewardPerSecond[tokenIndex]; // Get newly accumulated reward
        uint256 rewardMultiplierIncrease = (newReward * PRECISION) / totalStaked; // Calculate the multiplier increase
        uint256 currentMultiplier = accumulatedRewardMultiplier[tokenIndex] + rewardMultiplierIncrease; // Simulate the multiplier increase to the accumulated multiplier

        UserInfo storage user = userInfo[_userAddress];

        uint256 totalDebt = (user.amountStaked * currentMultiplier) / PRECISION; // Simulate the current debt
        uint256 pendingDebt = totalDebt - user.rewardDebt[tokenIndex]; // Simulate the pending debt
        return user.tokensOwed[tokenIndex] + pendingDebt;
    }

    function getUserTokensOwedLength(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed.length;
    }

    function getUserRewardDebtLength(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt.length;
    }

    /**
		@dev Extends the rewards period and updates the rates
		@param _endTimestamp  new end block for the rewards
		@param _rewardPerSecond array with new rewards per block for each token 
	 */
    function extend(uint256 _endTimestamp, uint256[] calldata _rewardPerSecond) external virtual onlyOwner {
        uint256 currentTimestamp = block.timestamp;

        require(
            _endTimestamp > currentTimestamp && _endTimestamp > endTimestamp,
            'RewardsPoolBase: invalid endTimestamp'
        );
        require(_rewardPerSecond.length == rewardsTokens.length, 'RewardsPoolBase: invalid rewardPerSecond');

        updateRewardMultipliers();

        uint256 campaignTime = currentTimestamp > endTimestamp ? endTimestamp : currentTimestamp;

        for (uint256 i = 0; i < _rewardPerSecond.length; i++) {
            uint256 currentRemainingRewards = calculateRewardsAmount(campaignTime, endTimestamp, rewardPerSecond[i]);
            uint256 newRemainingRewards = calculateRewardsAmount(currentTimestamp, _endTimestamp, _rewardPerSecond[i]);

            if (currentRemainingRewards > newRemainingRewards) {
                // Some reward leftover needs to be returned

                IERC20Detailed(rewardsTokens[i]).safeTransfer(
                    msg.sender,
                    (currentRemainingRewards - newRemainingRewards)
                );
            } else {
                // We need to check if we have enough balance available in the contract to pay for the extension
                uint256 availableBalance = getAvailableBalance(i, block.timestamp);

                require(availableBalance >= newRemainingRewards, 'RewardsPoolBase: not enough rewards to extend');

                uint256 spentRewards = calculateRewardsAmount(startTimestamp, campaignTime, rewardPerSecond[i]);
                totalSpentRewards[i] = totalSpentRewards[i] + spentRewards;
            }

            rewardPerSecond[i] = _rewardPerSecond[i];
        }

        startTimestamp = currentTimestamp;
        endTimestamp = _endTimestamp;

        emit Extended(_endTimestamp, _rewardPerSecond);
    }

    function getAvailableBalance(uint256 _rewardTokenIndex, uint256 time) public view returns (uint256) {
        address rewardToken = rewardsTokens[_rewardTokenIndex];
        uint256 balance = IERC20Detailed(rewardToken).balanceOf(address(this));

        if (startTimestamp == 0) {
            return balance;
        }

        uint256 campaignTime = time > endTimestamp ? endTimestamp : time;

        uint256 spentRewards = calculateRewardsAmount(startTimestamp, campaignTime, rewardPerSecond[_rewardTokenIndex]);
        uint256 availableBalance = balance -
            (totalSpentRewards[_rewardTokenIndex] + spentRewards - totalClaimed[_rewardTokenIndex]);

        if (rewardToken == address(stakingToken)) {
            availableBalance = availableBalance - totalStaked;
        }

        return availableBalance;
    }

    /** @dev Withdrawing rewards acumulated from different pools for providing liquidity
     * @param recipient The address to whom the rewards will be trasferred
     * @param lpTokenContract The address of the rewards contract
     */
    function withdrawLPRewards(address recipient, address lpTokenContract) external nonReentrant onlyOwner {
        uint256 currentReward = IERC20Detailed(lpTokenContract).balanceOf(address(this));
        require(currentReward > 0, 'RewardsPoolBase: no rewards');

        require(lpTokenContract != address(stakingToken), 'RewardsPoolBase: cannot withdraw staking token');

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            require(lpTokenContract != rewardsTokens[i], 'RewardsPoolBase: cannot withdraw reward token');
        }

        IERC20Detailed(lpTokenContract).safeTransfer(recipient, currentReward);
        emit WithdrawLPRewards(currentReward, recipient);
    }

    /** @dev Helper function to calculate how much tokens should be transffered to a rewards pool.
     */
    function calculateRewardsAmount(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256 _rewardPerSecond
    ) internal pure returns (uint256) {
        uint256 rewardsPeriodSeconds = _endTimestamp - _startTimestamp;
        return _rewardPerSecond * rewardsPeriodSeconds;
    }
}
