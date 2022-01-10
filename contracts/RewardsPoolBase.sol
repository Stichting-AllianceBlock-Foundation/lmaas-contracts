// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';

/** @dev Base pool contract used in all other pools. 
Users can stake tokens and get rewards based on the percentage of total staked tokens.
After deployment, owner can send funds and then start the pool. 
When it's started a check is done to verify enough rewards are available. 
Users can claim their rewards at any point, as well as withdraw their stake.
The owner can extend the pool by setting a new end time and sending more rewards if needed.

Rewards are kept track of using the accumulatedRewardMultiplier.
This variable represents the accumulated reward per token staked from the start until now.
Based on the difference between the accumulatedRewardMultiplier at the time of your stake and withdrawal, 
we calculate the amount of tokens you can claim.

For example, you enter when the accumulatedRewardMultiplier is 5 and exit at 20. You staked 100 tokens.
Your reward is (20 - 5) * 100 = 1500 tokens.
*/
contract RewardsPoolBase is ReentrancyGuard, Ownable {
    using SafeERC20Detailed for IERC20Detailed;

    uint256 internal constant PRECISION = 1000000000000000000;

    uint256 public totalStaked;
    uint256[] private totalClaimed;
    uint256[] private totalSpentRewards;

    uint256[] public rewardPerSecond;
    address[] public rewardsTokens;

    IERC20Detailed public stakingToken;

    uint256 public startTimestamp;
    uint256 public endTimestamp;
    uint256 private lastRewardTimestamp;

    uint256 public extensionDuration;
    uint256[] public extensionRewardPerSecond;

    uint256[] public accumulatedRewardMultiplier;

    uint256 public stakeLimit;
    uint256 public contractStakeLimit;

    string public name;

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

    /** @param _stakingToken The token to stake
     * @param _rewardsTokens The reward tokens
     * @param _stakeLimit Maximum amount of tokens that can be staked per user
     * @param _contractStakeLimit Maximum amount of tokens that can be staked in total
     * @param _name Name of the pool
     */
    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
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

        name = _name;
    }

    modifier onlyInsideBounds() {
        uint256 currentTimestamp = block.timestamp;
        require(
            (startTimestamp > 0 && currentTimestamp > startTimestamp) &&
                (currentTimestamp <= endTimestamp + extensionDuration),
            'RewardsPoolBase: staking is not started or is finished or no extension taking in place'
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

    /** @dev Start the pool. Funds for rewards will be checked and staking will be opened.
     * @param _startTimestamp The start time of the pool
     * @param _endTimestamp The end time of the pool
     * @param _rewardPerSecond Amount of rewards given per second
     */
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

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 rewardsAmount = calculateRewardsAmount(_startTimestamp, _endTimestamp, rewardPerSecond[i]);

            uint256 balance = IERC20Detailed(rewardsTokens[i]).balanceOf(address(this));

            require(balance >= rewardsAmount, 'RewardsPoolBase: not enough rewards');
        }

        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;

        emit Started();
    }

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual nonReentrant {
        _stake(_tokenAmount, msg.sender, true);
    }

    function _stake(
        uint256 _tokenAmount,
        address _staker,
        bool _chargeStaker
    ) internal onlyInsideBounds onlyUnderStakeLimit(_staker, _tokenAmount) {
        require(_tokenAmount > 0, 'RewardsPoolBase: cannot stake 0');

        UserInfo storage user = userInfo[_staker];

        // if no amount has been staked this is considered the initial stake
        if (user.amountStaked == 0) {
            user.firstStakedTimestamp = block.timestamp;
        }

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(_staker); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked + _tokenAmount;
        totalStaked = totalStaked + _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            user.rewardDebt[i] = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
        }

        stakingToken.safeTransferFrom(address(_chargeStaker ? _staker : msg.sender), address(this), _tokenAmount);

        emit Staked(_staker, _tokenAmount);
    }

    /** @dev Claim all your rewards, this will not remove your stake
     */
    function claim() public virtual nonReentrant {
        _claim(msg.sender);
    }

    function _claim(address _claimer) internal {
        UserInfo storage user = userInfo[_claimer];
        updateRewardMultipliers();
        updateUserAccruedReward(_claimer);

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            uint256 reward = user.tokensOwed[i];
            user.tokensOwed[i] = 0;

            IERC20Detailed(rewardsTokens[i]).safeTransfer(_claimer, reward);
            totalClaimed[i] = totalClaimed[i] + reward;

            emit Claimed(_claimer, reward, rewardsTokens[i]);
        }
    }

    /** @dev Withdrawing a portion or all of staked tokens. This will not claim your rewards
     * @param _tokenAmount The amount to be withdrawn
     */
    function withdraw(uint256 _tokenAmount) public virtual nonReentrant {
        _withdraw(_tokenAmount, msg.sender);
    }

    function _withdraw(uint256 _tokenAmount, address _withdrawer) internal {
        require(_tokenAmount > 0, 'RewardsPoolBase: cannot withdraw 0');

        UserInfo storage user = userInfo[_withdrawer];

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(_withdrawer); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked - _tokenAmount;
        totalStaked = totalStaked - _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
            user.rewardDebt[i] = totalDebt;
        }

        stakingToken.safeTransfer(address(_withdrawer), _tokenAmount);

        emit Withdrawn(_withdrawer, _tokenAmount);
    }

    /** @dev Claim all rewards and withdraw all staked tokens. Exits from the rewards pool
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
     * @param _userAddress The user to get the balance of
     */
    function balanceOf(address _userAddress) public view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.amountStaked;
    }

    /**
		@dev Updates the accumulated reward multipliers for everyone and each token
	 */
    function updateRewardMultipliers() public {
        uint256 currentTimestamp = block.timestamp;

        if (currentTimestamp > endTimestamp && extensionDuration > 0) {
            _updateRewardMultipliers(endTimestamp);
            _extend(endTimestamp, endTimestamp + extensionDuration, extensionRewardPerSecond);
            _updateRewardMultipliers(currentTimestamp);
        } else {
            _updateRewardMultipliers(currentTimestamp);
        }
    }

    /**
     * @dev updates the accumulated reward multipliers for everyone and each token
     */
    function _updateRewardMultipliers(uint256 _currentTimestamp) internal {
        if (_currentTimestamp <= lastRewardTimestamp) {
            return;
        }

        uint256 applicableTimestamp = (_currentTimestamp < endTimestamp) ? _currentTimestamp : endTimestamp;

        uint256 secondsSinceLastReward = applicableTimestamp - lastRewardTimestamp;

        if (secondsSinceLastReward == 0) {
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

    /** @dev Updates the accumulated reward for the user
     * @param _userAddress the address of the updated user
     */
    function updateUserAccruedReward(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        if (user.rewardDebt.length == 0) {
            // Initialize user struct

            for (uint256 i = 0; i < rewardsTokens.length; i++) {
                user.rewardDebt.push(0);
                user.tokensOwed.push(0);
            }
        }

        if (user.amountStaked == 0) {
            return;
        }

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 tokenIndex = 0; tokenIndex < rewardsTokensLength; tokenIndex++) {
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[tokenIndex]) / PRECISION;
            uint256 pendingDebt = totalDebt - user.rewardDebt[tokenIndex];

            if (pendingDebt > 0) {
                user.tokensOwed[tokenIndex] = user.tokensOwed[tokenIndex] + pendingDebt;
                user.rewardDebt[tokenIndex] = totalDebt;
            }
        }
    }

    /**
		@dev Checks if the staking has started
	 */
    function hasStakingStarted() public view returns (bool) {
        return (startTimestamp > 0 && block.timestamp >= startTimestamp);
    }

    /** @dev Returns the amount of reward debt of a specific token and user
     * @param _userAddress the address of the updated user
     * @param _index index of the reward token to check
     */
    function getUserRewardDebt(address _userAddress, uint256 _index) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt[_index];
    }

    /** @dev Returns the amount of reward owed of a specific token and user
     * @param _userAddress the address of the updated user
     * @param _index index of the reward token to check
     */
    function getUserOwedTokens(address _userAddress, uint256 _index) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed[_index];
    }

    /** @dev Calculates the reward at a specific time
     * @param _userAddress the address of the user
     * @param _tokenIndex the index of the reward token you are interested
     * @param _time the time to check the reward at
     */
    function getUserAccumulatedReward(
        address _userAddress,
        uint256 _tokenIndex,
        uint256 _time
    ) public view returns (uint256) {
        uint256 applicableTimestamp = (_time < endTimestamp) ? _time : endTimestamp;
        uint256 secondsSinceLastReward = applicableTimestamp - lastRewardTimestamp;

        uint256 newReward = secondsSinceLastReward * rewardPerSecond[_tokenIndex]; // Get newly accumulated reward
        uint256 rewardMultiplierIncrease = (newReward * PRECISION) / totalStaked; // Calculate the multiplier increase
        uint256 currentMultiplier = accumulatedRewardMultiplier[_tokenIndex] + rewardMultiplierIncrease; // Simulate the multiplier increase to the accumulated multiplier

        UserInfo storage user = userInfo[_userAddress];

        uint256 totalDebt = (user.amountStaked * currentMultiplier) / PRECISION; // Simulate the current debt
        uint256 pendingDebt = totalDebt - user.rewardDebt[_tokenIndex]; // Simulate the pending debt
        return user.tokensOwed[_tokenIndex] + pendingDebt;
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
     * @dev Extends the rewards period and updates the rates
     * @param _durationTime duration of the campaign (how many seconds the campaign will have)
     * @param _rewardPerSecond array with new rewards per block for each token
     */
    function extend(uint256 _durationTime, uint256[] memory _rewardPerSecond) external virtual onlyOwner {
        if (extensionDuration == 0 && extensionRewardPerSecond.length == 0) {
            uint256 currentTimestamp = block.timestamp;
            uint256 _endTimestamp = currentTimestamp + _durationTime;

            require(
                _endTimestamp > currentTimestamp && _endTimestamp > endTimestamp,
                'RewardsPoolBase: invalid endTimestamp'
            );
            require(_rewardPerSecond.length == rewardsTokens.length, 'RewardsPoolBase: invalid rewardPerSecond');
            for (uint256 i = 0; i < _rewardPerSecond.length; i++) {
                uint256 newRewards = calculateRewardsAmount(currentTimestamp, _endTimestamp, _rewardPerSecond[i]);

                // We need to check if we have enough balance available in the contract to pay for the extension
                uint256 availableBalance = getAvailableBalance(i);

                require(availableBalance >= newRewards, 'RewardsPoolBase: not enough rewards to extend');

                uint256 spentRewards = calculateRewardsAmount(startTimestamp, endTimestamp, rewardPerSecond[i]);
                totalSpentRewards[i] = totalSpentRewards[i] + spentRewards;
            }

            extensionDuration = _durationTime;
            extensionRewardPerSecond = _rewardPerSecond;

            updateRewardMultipliers();
        } else {
            updateRewardMultipliers();
        }
    }

    /**
     * @dev Extends the rewards period and updates the rates, (this is just the internal function, that does the actual extends)
     * @param _startTimestamp current timestamp for the rewards
     * @param _endTimestamp new end timestamp for the rewards
     * @param _rewardPerSecond array with new rewards per second for each token
     */
    function _extend(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] memory _rewardPerSecond
    ) internal {
        rewardPerSecond = _rewardPerSecond;

        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        extensionDuration = 0;
        delete extensionRewardPerSecond;

        emit Extended(_endTimestamp, _rewardPerSecond);
    }

    /**
     *@dev Calculates the available amount of reward tokens that are not locked
     *@param _rewardTokenIndex the index of the reward token to check
     */
    function getAvailableBalance(uint256 _rewardTokenIndex) public view returns (uint256) {
        address rewardToken = rewardsTokens[_rewardTokenIndex];
        uint256 balance = IERC20Detailed(rewardToken).balanceOf(address(this));

        if (startTimestamp == 0) {
            return balance;
        }

        uint256 spentRewards = calculateRewardsAmount(startTimestamp, endTimestamp, rewardPerSecond[_rewardTokenIndex]);
        uint256 availableBalance = balance -
            (totalSpentRewards[_rewardTokenIndex] + spentRewards - totalClaimed[_rewardTokenIndex]);

        if (rewardToken == address(stakingToken)) {
            availableBalance = availableBalance - totalStaked;
        }

        return availableBalance;
    }

    /** @dev Withdraw rewards acumulated from different pools for providing liquidity
     * @param _recipient The address to whom the rewards will be trasferred
     * @param _lpTokenContract The address of the rewards contract
     */
    function withdrawLPRewards(address _recipient, address _lpTokenContract) external nonReentrant onlyOwner {
        uint256 currentReward = IERC20Detailed(_lpTokenContract).balanceOf(address(this));
        require(currentReward > 0, 'RewardsPoolBase: no rewards');

        require(_lpTokenContract != address(stakingToken), 'RewardsPoolBase: cannot withdraw staking token');

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            require(_lpTokenContract != rewardsTokens[i], 'RewardsPoolBase: cannot withdraw reward token');
        }

        IERC20Detailed(_lpTokenContract).safeTransfer(_recipient, currentReward);
        emit WithdrawLPRewards(currentReward, _recipient);
    }

    /** @dev Calculates the amount of rewards given in a specific period
     * @param _startTimestamp The start time of the period
     * @param _endTimestamp The end time of the period
     * @param _rewardPerSecond The reward per second
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
