// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

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
contract RewardsPoolBaseInfinite is Ownable {
    using SafeERC20 for IERC20;

    uint256 internal constant PRECISION = 1 ether;
    uint256 internal constant MAX_FEE = 10000; // 100%
    uint256 internal constant CUT_FEE = 100; // 1%

    uint256 public totalStaked;

    uint256[] private totalClaimed;
    uint256[] private totalSpentRewards;

    uint256[] public rewardPerSecond;
    address[] public rewardsTokens;

    IERC20 public immutable stakingToken;

    uint256 public epochDuration;
    uint256 public startTimestamp;
    uint256 public endTimestamp;
    uint256 private lastRewardTimestamp;

    uint256[] public accumulatedRewardMultiplier;

    uint256 public immutable stakeLimit;
    uint256 public immutable contractStakeLimit;

    string public name;

    struct UserInfo {
        uint256 firstStakedTimestamp;
        uint256 amountStaked; // How many tokens the user has staked.
        uint256[] rewardDebt; //
        uint256[] tokensOwed; // How many tokens the contract owes to the user.
    }

    mapping(address => UserInfo) public userInfo;

    struct Campaign {
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint256[] rewardPerSecond;
    }

    Campaign[] public previousCampaigns;

    event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond);
    event Staked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount, address token);
    event Withdrawn(address indexed user, uint256 amount);
    event Exited(address indexed user, uint256 amount);
    event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond);

    /** @param _stakingToken The token to stake
     * @param _rewardsTokens The reward tokens
     * @param _stakeLimit Maximum amount of tokens that can be staked per user
     * @param _contractStakeLimit Maximum amount of tokens that can be staked in total
     * @param _name Name of the pool
     */
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) {
        require(address(_stakingToken) != address(0), 'RewardsPoolBase: invalid staking token');

        require(_stakeLimit != 0 && _contractStakeLimit != 0, 'RewardsPoolBase: invalid stake limit');

        require(_rewardsTokens.length > 0, 'RewardsPoolBase: empty rewardsTokens');

        for (uint256 i = 0; i < _rewardsTokens.length; i++) {
            for (uint256 j = i + 1; j < _rewardsTokens.length; j++) {
                require(
                    address(_rewardsTokens[i]) != address(_rewardsTokens[j]),
                    'RewardsPoolBase: duplicate rewards token'
                );
            }
        }

        stakingToken = _stakingToken;
        rewardsTokens = _rewardsTokens;
        stakeLimit = _stakeLimit;
        contractStakeLimit = _contractStakeLimit;

        uint256[] memory empty = new uint256[](rewardsTokens.length);
        accumulatedRewardMultiplier = empty;
        totalClaimed = empty;
        totalSpentRewards = empty;

        name = _name;
    }

    /** @dev Start the pool now. Funds for rewards will be checked and staking will be opened.
     * @param _epochDuration the duration of the infinite pool ex: (7 days = 604800 seconds)
     */
    function start(uint256 _epochDuration) external virtual onlyOwner {
        epochDuration = _epochDuration;

        uint256 _startTimestamp = block.timestamp;
        uint256 _endTimestamp = _startTimestamp + _epochDuration;

        _start(_startTimestamp, _endTimestamp);
    }

    /** @dev Start the pool at a specific time. Funds for rewards will be checked and staking will be opened.
     * @param _epochDuration the duration of the infinite pool ex: (7 days = 604800 seconds)
     * @param _startTimeStamp The start time of the pool
     */
    function start(uint256 _epochDuration, uint256 _startTimeStamp) external virtual onlyOwner {
        epochDuration = _epochDuration;

        uint256 _endTimeStamp = _startTimeStamp + _epochDuration;
        _start(_startTimeStamp, _endTimeStamp);
    }

    function _start(uint256 _startTimestamp, uint256 _endTimestamp) internal {
        require(startTimestamp == 0, 'RewardsPoolBaseInfinite: already started');
        require(
            _startTimestamp >= block.timestamp && _endTimestamp > _startTimestamp,
            'RewardsPoolBaseInfinite: invalid start or end'
        );

        uint256 rewardsTokensLength = rewardsTokens.length;
        uint256[] memory _rewardPerSecond = new uint256[](rewardsTokensLength);

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 balance = IERC20(rewardsTokens[i]).balanceOf(address(this));
            require(balance > 0, 'RewardsPoolBaseInfinite: no rewards for this token');

            // we need to cut off 1% or 5% whatever the business decides
            // IERC20(rewardsTokens[i]).transferFrom(address(this), feeRecipient, (balance * CUT_FEE) / MAX_FEE);

            _rewardPerSecond[i] = (balance * PRECISION) / (_endTimestamp - _startTimestamp); // calculate the rewards per second
            uint256 rewardsAmount = calculateRewardsAmount(_startTimestamp, _endTimestamp, _rewardPerSecond[i]);

            require(balance >= rewardsAmount, 'RewardsPoolBaseInfinite: not enough rewards');
        }

        rewardPerSecond = _rewardPerSecond;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;

        emit Started(startTimestamp, endTimestamp, rewardPerSecond);
    }

    /** @dev Cancels the scheduled start. Can only be done before the start.
     */
    function cancel() external virtual onlyOwner {
        _cancel();
    }

    function _cancel() internal {
        require(block.timestamp < startTimestamp, 'RewardsPoolBaseInfinite: No start scheduled or already started');

        rewardPerSecond = new uint256[](0);
        startTimestamp = 0;
        endTimestamp = 0;
        lastRewardTimestamp = 0;
    }

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual {
        _stake(_tokenAmount, msg.sender, true);
    }

    function _stake(
        uint256 _tokenAmount,
        address _staker,
        bool _chargeStaker
    ) internal {
        uint256 currentTimestamp = block.timestamp;

        require(
            startTimestamp > 0 && currentTimestamp > startTimestamp,
            'RewardsPoolBaseInfinite: staking is not started'
        );

        UserInfo storage user = userInfo[_staker];
        require(
            (user.amountStaked + _tokenAmount <= stakeLimit) && (totalStaked + _tokenAmount <= contractStakeLimit),
            'RewardsPoolBaseInfinite: stake limit reached'
        );

        require(_tokenAmount > 0, 'RewardsPoolBaseInfinite: cannot stake 0');

        // if no amount has been staked this is considered the initial stake
        if (user.amountStaked == 0) {
            user.firstStakedTimestamp = currentTimestamp;
        }

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        _updateUserAccruedReward(_staker); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked + _tokenAmount;
        totalStaked = totalStaked + _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            user.rewardDebt[i] = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
        }

        emit Staked(_staker, _tokenAmount);

        stakingToken.safeTransferFrom(address(_chargeStaker ? _staker : msg.sender), address(this), _tokenAmount);
    }

    /** @dev Claim all your rewards, this will not remove your stake
     */
    function claim() public virtual {
        _claim(msg.sender);
    }

    function _claim(address _claimer) internal {
        UserInfo storage user = userInfo[_claimer];
        updateRewardMultipliers();
        _updateUserAccruedReward(_claimer);

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 reward = user.tokensOwed[i];
            user.tokensOwed[i] = 0;
            totalClaimed[i] = totalClaimed[i] + reward;

            emit Claimed(_claimer, reward, rewardsTokens[i]);

            IERC20(rewardsTokens[i]).safeTransfer(_claimer, reward);
        }
    }

    /** @dev Withdrawing a portion or all of staked tokens. This will not claim your rewards
     * @param _tokenAmount The amount to be withdrawn
     */
    function withdraw(uint256 _tokenAmount) public virtual {
        _withdraw(_tokenAmount, msg.sender);
    }

    function _withdraw(uint256 _tokenAmount, address _withdrawer) internal {
        require(_tokenAmount > 0, 'RewardsPoolBase: cannot withdraw 0');

        UserInfo storage user = userInfo[_withdrawer];

        require(_tokenAmount <= user.amountStaked, 'RewardsPoolBaseInfinite: not enough funds to withdraw');

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        _updateUserAccruedReward(_withdrawer); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked - _tokenAmount;
        totalStaked = totalStaked - _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
            user.rewardDebt[i] = totalDebt;
        }

        emit Withdrawn(_withdrawer, _tokenAmount);

        stakingToken.safeTransfer(address(_withdrawer), _tokenAmount);
    }

    /** @dev Claim all rewards and withdraw all staked tokens. Exits from the rewards pool
     */
    function exit() public virtual {
        _exit(msg.sender);
    }

    function _exit(address exiter) internal {
        UserInfo storage user = userInfo[exiter];

        emit Exited(exiter, user.amountStaked);

        _claim(exiter);
        _withdraw(user.amountStaked, exiter);
    }

    /** @dev Returns the amount of tokens the user has staked
     * @param _userAddress The user to get the balance of
     */
    function balanceOf(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.amountStaked;
    }

    /**
     * @dev Returns a boolean if the campaign can be extended, depending on the rewards that
     * the campaign has
     */
    function _canBeExtended() internal view returns (bool) {
        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            uint256 balance = IERC20(rewardsTokens[i]).balanceOf(address(this));
            uint8 counter;

            // if we have any rewardsTokens with balance 0, don't apply the extension
            if (balance > 0) {
                counter++;
            }

            if (counter == rewardsTokens.length) {
                return true;
            }
        }

        return false;
    }

    /**
		@dev Updates the accumulated reward multipliers for everyone and each token
	 */
    function updateRewardMultipliers() public {
        uint256 currentTimestamp = block.timestamp;

        if (currentTimestamp > endTimestamp) {
            _updateRewardMultipliers(endTimestamp);
            if (_canBeExtended()) {
                _applyExtension(endTimestamp, endTimestamp + epochDuration);
                _updateRewardMultipliers(currentTimestamp);
            }
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
    function _updateUserAccruedReward(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        uint256 rewardsTokensLength = rewardsTokens.length;

        if (user.rewardDebt.length == 0) {
            // Initialize user struct

            uint256[] memory empty = new uint256[](rewardsTokensLength);
            user.rewardDebt = empty;
            user.tokensOwed = empty;
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

    /**
		@dev Checks if the staking has started
	 */
    function hasStakingStarted() external view returns (bool) {
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
    ) external view returns (uint256) {
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

    /** @dev Returns the length of the owed tokens in the user info
     */
    function getUserTokensOwedLength(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed.length;
    }

    /** @dev Returns the length of the reward debt in the user info
     */
    function getUserRewardDebtLength(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt.length;
    }

    /** @dev Returns the amount of reward tokens
     */
    function getRewardTokensCount() external view returns (uint256) {
        return rewardsTokens.length;
    }

    /** @dev Returns the amount of previous campaigns
     */
    function getPreviousCampaignsCount() external view returns (uint256) {
        return previousCampaigns.length;
    }

    function _applyExtension(uint256 _startTimestamp, uint256 _endTimestamp) internal {
        uint256 rewardPerSecondLength = rewardPerSecond.length;
        uint256 rewardsTokensLength = rewardsTokens.length;
        uint256[] memory _rewardPerSecond = new uint256[](rewardsTokensLength);

        for (uint256 i = 0; i < rewardPerSecondLength; i++) {
            uint256 spentRewards = calculateRewardsAmount(startTimestamp, endTimestamp, rewardPerSecond[i]);
            totalSpentRewards[i] = totalSpentRewards[i] + spentRewards;
        }

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 balance = IERC20(rewardsTokens[i]).balanceOf(address(this));

            // we need to cut off 1% or 5% whatever the business decides
            // IERC20(rewardsTokens[i]).transferFrom(address(this), feeRecipient, (balance * CUT_FEE) / MAX_FEE);

            _rewardPerSecond[i] = (balance * PRECISION) / (_endTimestamp - _startTimestamp); // calculate the rewards per second
            uint256 rewardsAmount = calculateRewardsAmount(_startTimestamp, _endTimestamp, _rewardPerSecond[i]);

            require(balance >= rewardsAmount, 'RewardsPoolBaseInfinite: not enough rewards');
        }

        previousCampaigns.push(Campaign(startTimestamp, endTimestamp, rewardPerSecond));

        rewardPerSecond = _rewardPerSecond;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;

        emit Extended(_startTimestamp, _endTimestamp, rewardPerSecond);
    }

    /**
     *@dev Calculates the available amount of reward tokens that are not locked
     *@param _rewardTokenIndex the index of the reward token to check
     */
    function getAvailableBalance(uint256 _rewardTokenIndex) public view returns (uint256) {
        address rewardToken = rewardsTokens[_rewardTokenIndex];
        uint256 balance = IERC20(rewardToken).balanceOf(address(this));

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

    /** @dev Withdraw excess rewards not needed for current campaign and extension
     * @param _recipient The address to whom the rewards will be transferred
     */
    function withdrawExcessRewards(address _recipient) external onlyOwner {
        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 balance = getAvailableBalance(i);

            if (balance > 0) {
                IERC20(rewardsTokens[i]).safeTransfer(_recipient, balance);
            }
        }
    }

    /** @dev Withdraw tokens other than the staking and reward token, for example rewards from liquidity mining
     * @param _recipient The address to whom the rewards will be transferred
     * @param _token The address of the rewards contract
     */
    function withdrawTokens(address _recipient, address _token) external onlyOwner {
        uint256 currentReward = IERC20(_token).balanceOf(address(this));
        require(currentReward > 0, 'RewardsPoolBase: no rewards');

        require(_token != address(stakingToken), 'RewardsPoolBase: cannot withdraw staking token');

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            require(_token != rewardsTokens[i], 'RewardsPoolBase: cannot withdraw reward token');
        }

        IERC20(_token).safeTransfer(_recipient, currentReward);
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

    receive() external payable {}
}
