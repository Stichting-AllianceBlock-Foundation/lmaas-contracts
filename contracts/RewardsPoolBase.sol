// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import 'hardhat/console.sol';
import './interfaces/IWETH.sol';

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
contract RewardsPoolBase is Ownable {
    using SafeERC20 for IERC20;

    uint256 internal constant PRECISION = 1 ether;

    uint256 public totalStaked;

    uint256[] private totalClaimed;
    uint256[] private totalSpentRewards;

    uint256[] public rewardPerSecond;
    address[] public rewardsTokens;
    uint256[] public leftoverRewards;
    uint8 public stakingTokenDecimals;
    uint8[] public rewardTokenDecimals;

    IERC20 public immutable stakingToken;

    uint256 public startTimestamp;
    uint256 public endTimestamp;
    uint256 public lastRewardTimestamp;

    uint256 public extensionDuration;
    uint256[] public extensionRewardPerSecond;

    uint256[] public accumulatedRewardMultiplier;

    uint256 public immutable stakeLimit;
    uint256 public immutable contractStakeLimit;

    address public wrappedNativeToken;
    string public name;

    struct UserInfo {
        uint256 firstStakedTimestamp;
        uint256 amountStaked; // How many tokens the user has staked.
        uint256[] rewardDebt; // Helper for calculating tokensdebt
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
        string memory _name,
        address _wrappedNativeToken
    ) {
        require(address(_stakingToken) != address(0), 'RewardsPoolBase: invalid staking token');

        require(_stakeLimit != 0 && _contractStakeLimit != 0, 'RewardsPoolBase: invalid stake limit');

        require(_rewardsTokens.length > 0, 'RewardsPoolBase: empty rewardsTokens');
        stakingTokenDecimals = IERC20Metadata(address(_stakingToken)).decimals();
        rewardTokenDecimals = new uint8[](_rewardsTokens.length);

        for (uint256 i = 0; i < _rewardsTokens.length; i++) {
            rewardTokenDecimals[i] = IERC20Metadata(_rewardsTokens[i]).decimals();

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
        leftoverRewards = empty;
        totalSpentRewards = empty;

        name = _name;
        wrappedNativeToken = _wrappedNativeToken;
    }

    /** @dev Start the pool. Funds for rewards will be checked and staking will be opened.
     * @param _startTimestamp The start time of the pool
     * @param _endTimestamp The end time of the pool
     * @param _rewardPerSecond Amount of rewards given per second
     */
    function start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] memory _rewardPerSecond
    ) external virtual onlyOwner {
        _start(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    function _start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) internal virtual {
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

            uint256 balance = IERC20(rewardsTokens[i]).balanceOf(address(this));

            require(balance >= rewardsAmount, 'RewardsPoolBase: not enough rewards');
        }

        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;

        emit Started(startTimestamp, endTimestamp, rewardPerSecond);
    }

    /** @dev Cancels the scheduled start.
     */
    function cancel() external virtual onlyOwner {
        _cancel();
    }

    function _returnRewards() internal {
        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 balance = IERC20(rewardsTokens[i]).balanceOf(address(this));

            if (balance > 0) {
                IERC20(rewardsTokens[i]).safeTransfer(msg.sender, balance);
            }
        }
    }

    function _cancel() internal {
        require(totalStaked == 0, 'RewardsPoolBase: somebody has staked into the campaign');

        startTimestamp = 0;
        endTimestamp = 0;
        lastRewardTimestamp = 0;
        extensionDuration = 0;

        uint256[] memory empty = new uint256[](rewardsTokens.length);
        accumulatedRewardMultiplier = empty;
        totalClaimed = empty;
        totalSpentRewards = empty;
        rewardPerSecond = empty;
        extensionRewardPerSecond = empty;
        leftoverRewards = empty;

        _returnRewards();
    }

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual {
        _stake(_tokenAmount, msg.sender, true, true);
    }

    /** @dev Stake an amount of tokens in a native way
     */
    function stakeNative() public payable virtual {
        require(
            address(stakingToken) == wrappedNativeToken,
            'RewardsPoolBase: staking native not available for this campaign'
        );

        IWETH(address(stakingToken)).deposit{value: msg.value}();
        _stake(msg.value, msg.sender, true, false);
    }

    function _stake(uint256 _tokenAmount, address _staker, bool _chargeStaker, bool _shouldTransfer) internal {
        uint256 currentTimestamp = block.timestamp;
        require(
            (startTimestamp > 0 && currentTimestamp > startTimestamp) &&
                (currentTimestamp <= endTimestamp + extensionDuration),
            'RewardsPoolBase: staking is not started or is finished or no extension taking in place'
        );

        UserInfo storage user = userInfo[_staker];
        require(
            (user.amountStaked + _tokenAmount <= stakeLimit) && (totalStaked + _tokenAmount <= contractStakeLimit),
            'RewardsPoolBase: stake limit reached'
        );

        require(_tokenAmount > 0, 'RewardsPoolBase: cannot stake 0');

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
            user.rewardDebt[i] =
                (user.amountStaked * accumulatedRewardMultiplier[i] * (10 ** rewardTokenDecimals[i])) /
                (PRECISION * (10 ** stakingTokenDecimals)); // Update user reward debt for each token
        }

        emit Staked(_staker, _tokenAmount);
        if (_shouldTransfer)
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

            if (rewardsTokens[i] == wrappedNativeToken) {
                IWETH(rewardsTokens[i]).withdraw(reward);

                /* This will transfer the native token to the user. */
                payable(msg.sender).transfer(reward);
            } else {
                IERC20(rewardsTokens[i]).safeTransfer(_claimer, reward);
            }
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

        require(_tokenAmount <= user.amountStaked, 'RewardsPoolBase: not enough funds to withdraw');

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        _updateUserAccruedReward(_withdrawer); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked - _tokenAmount;
        totalStaked = totalStaked - _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[i] * (10 ** rewardTokenDecimals[i])) /
                (PRECISION * (10 ** stakingTokenDecimals)); // Update user reward debt for each token
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
		@dev Updates the accumulated reward multipliers for everyone and each token
	 */
    function updateRewardMultipliers() public virtual {
        uint256 currentTimestamp = block.timestamp;

        if (currentTimestamp > endTimestamp && extensionDuration > 0) {
            _updateRewardMultipliers(endTimestamp);
            _applyExtension(endTimestamp, endTimestamp + extensionDuration, extensionRewardPerSecond);
            _updateRewardMultipliers(currentTimestamp);
        } else {
            _updateRewardMultipliers(currentTimestamp);
        }
    }

    function calculateLeftoverRewards(uint256 _currentTimestamp, uint256 _index) public view returns (uint256) {
        uint256 applicableTimestamp = (_currentTimestamp < endTimestamp) ? _currentTimestamp : endTimestamp;
        uint256 startLeftoverTimestamp = lastRewardTimestamp > 0 ? lastRewardTimestamp : startTimestamp;

        if (_currentTimestamp < startTimestamp || (applicableTimestamp == 0 && startLeftoverTimestamp == 0)) {
            return 0;
        }

        return calculateRewardsAmount(startLeftoverTimestamp, applicableTimestamp, rewardPerSecond[_index]);
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
        uint256 rewardsTokensLength = rewardsTokens.length;

        if (secondsSinceLastReward == 0) {
            return;
        }

        if (totalStaked == 0) {
            for (uint256 i = 0; i < rewardsTokensLength; i++) {
                uint256 leftRewards = calculateLeftoverRewards(_currentTimestamp, i);

                leftoverRewards[i] = leftoverRewards[i] + leftRewards;
            }

            lastRewardTimestamp = applicableTimestamp;
            return;
        }

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 newReward = secondsSinceLastReward * rewardPerSecond[i]; // Get newly accumulated reward
            uint256 rewardMultiplierIncrease = (newReward * (10 ** stakingTokenDecimals)) /
                (totalStaked * (10 ** rewardTokenDecimals[i])); // Calculate the multiplier increase
            accumulatedRewardMultiplier[i] = accumulatedRewardMultiplier[i] + rewardMultiplierIncrease; // Add the multiplier increase to the accumulated multiplier
        }

        lastRewardTimestamp = applicableTimestamp;
    }

    function _updateUserAccruedReward(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        uint256 rewardsTokensLength = rewardsTokens.length;

        // Initialize user struct if needed
        if (user.rewardDebt.length == 0) {
            // Initialize user struct
            uint256[] memory empty = new uint256[](rewardsTokensLength);
            user.rewardDebt = empty;
            user.tokensOwed = empty;
        }

        // Return if user has no staked tokens
        if (user.amountStaked == 0) {
            return;
        }

        for (uint256 tokenIndex = 0; tokenIndex < rewardsTokensLength; tokenIndex++) {
            uint256 totalDebt = (user.amountStaked *
                accumulatedRewardMultiplier[tokenIndex] *
                (10 ** rewardTokenDecimals[tokenIndex])) / (PRECISION * (10 ** stakingTokenDecimals));

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
    ) external view virtual returns (uint256) {
        uint256 applicableTimestamp = (_time < endTimestamp) ? _time : endTimestamp;
        uint256 secondsSinceLastReward = applicableTimestamp - lastRewardTimestamp;

        uint256 rewardMultiplierIncrease = (secondsSinceLastReward *
            rewardPerSecond[_tokenIndex] *
            (10 ** stakingTokenDecimals)) / (totalStaked * (10 ** rewardTokenDecimals[_tokenIndex])); // Calculate the multiplier increase
        uint256 currentMultiplier = accumulatedRewardMultiplier[_tokenIndex] + rewardMultiplierIncrease; // Simulate the multiplier increase to the accumulated multiplier

        UserInfo storage user = userInfo[_userAddress];

        uint256 totalDebt = (user.amountStaked * currentMultiplier * (10 ** rewardTokenDecimals[_tokenIndex])) /
            (PRECISION * (10 ** stakingTokenDecimals)); // Simulate the current debt
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

    /**
     * @dev Extends the rewards period and updates the rates.
     * When the current campaign is still going on, the extension will be scheduled and started when the campaign ends.
     * The extension can be canceled until it starts. After it starts, the rewards are locked in and cannot be withdrawn.
     * @param _durationTime duration of the campaign (how many seconds the campaign will have)
     * @param _rewardPerSecond array with new rewards per second for each token
     */
    function extend(uint256 _durationTime, uint256[] calldata _rewardPerSecond) external virtual onlyOwner {
        _extend(_durationTime, _rewardPerSecond);
    }

    function _extend(uint256 _durationTime, uint256[] calldata _rewardPerSecond) internal virtual {
        require(extensionDuration == 0, 'RewardsPoolBase: there is already an extension');
        require(_durationTime > 0, 'RewardsPoolBase: duration must be greater than 0');

        uint256 rewardPerSecondLength = _rewardPerSecond.length;
        require(rewardPerSecondLength == rewardsTokens.length, 'RewardsPoolBase: invalid rewardPerSecond');

        uint256 currentTimestamp = block.timestamp;
        bool ended = currentTimestamp > endTimestamp;

        uint256 newStartTimestamp = ended ? currentTimestamp : endTimestamp;
        uint256 newEndTimestamp = newStartTimestamp + _durationTime;

        for (uint256 i = 0; i < rewardPerSecondLength; i++) {
            uint256 newRewards = calculateRewardsAmount(newStartTimestamp, newEndTimestamp, _rewardPerSecond[i]);

            // We need to check if we have enough balance available in the contract to pay for the extension
            uint256 availableBalance = getAvailableBalance(i);
            uint256 leftRewards = calculateLeftoverRewards(currentTimestamp, i);

            require(
                availableBalance >= newRewards && availableBalance > leftRewards,
                'RewardsPoolBase: not enough rewards to extend'
            );
        }

        if (ended) {
            _updateRewardMultipliers(endTimestamp);
            _applyExtension(newStartTimestamp, newEndTimestamp, _rewardPerSecond);
            _updateRewardMultipliers(currentTimestamp);
        } else {
            extensionDuration = _durationTime;
            extensionRewardPerSecond = _rewardPerSecond;
        }
    }

    function _applyExtension(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] memory _rewardPerSecond
    ) internal {
        uint256 rewardPerSecondLength = rewardPerSecond.length;
        for (uint256 i = 0; i < rewardPerSecondLength; i++) {
            uint256 spentRewards = calculateRewardsAmount(startTimestamp, endTimestamp, rewardPerSecond[i]);
            totalSpentRewards[i] = totalSpentRewards[i] + spentRewards;
        }

        previousCampaigns.push(Campaign(startTimestamp, endTimestamp, rewardPerSecond));

        rewardPerSecond = _rewardPerSecond;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;

        extensionDuration = 0;
        delete extensionRewardPerSecond;

        emit Extended(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    /**
     * @dev Cancels the schedules extension
     */
    function cancelExtension() external virtual onlyOwner {
        _cancelExtension();
    }

    function _cancelExtension() internal {
        require(extensionDuration > 0, 'RewardsPoolBase: there is no extension scheduled');
        require(block.timestamp < endTimestamp, 'RewardsPoolBase: cannot cancel extension after it has started');

        extensionDuration = 0;
        delete extensionRewardPerSecond;
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

        if (extensionDuration > 0) {
            uint256 spentExtensionRewards = calculateRewardsAmount(
                endTimestamp,
                endTimestamp + extensionDuration,
                extensionRewardPerSecond[_rewardTokenIndex]
            );

            spentRewards = spentRewards + spentExtensionRewards;
        }

        uint256 availableBalance = balance -
            (totalSpentRewards[_rewardTokenIndex] +
                spentRewards -
                totalClaimed[_rewardTokenIndex] -
                leftoverRewards[_rewardTokenIndex]);

        if (rewardToken == address(stakingToken)) {
            availableBalance = availableBalance - totalStaked;
        }

        return availableBalance;
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
        return (_rewardPerSecond * rewardsPeriodSeconds) / PRECISION;
    }

    receive() external payable {}
}
