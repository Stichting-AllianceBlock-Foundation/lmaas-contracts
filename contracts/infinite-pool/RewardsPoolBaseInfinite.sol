// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './../RewardsPoolBase.sol';

/** @dev RewardsPoolBase Inifnite
Inherits all staking logic from RewardsPoolBase.
The extra functionality, should be the recalculation of the rewards and epoch times.
*/
contract RewardsPoolBaseInfinite is RewardsPoolBase {
    using SafeERC20 for IERC20;

    uint256 internal constant MAX_FEE = 10000; // 100%
    uint256 internal constant CUT_FEE = 300; // 3%
    address constant feeRecipient = 0x000000000000000000000000000000000000dEaD; // wallet of the feeRecipient

    uint256 public epochDuration;

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
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {}

    /** @dev Start the pool now. Funds for rewards will be checked and staking will be opened.
     * @param _epochDuration the duration of the infinite pool ex: (7 days = 604800 seconds)
     */
    function start(uint256 _epochDuration) external virtual onlyOwner {
        epochDuration = _epochDuration;
        uint256 _startTimestamp = block.timestamp;
        uint256 _endTimestamp = _startTimestamp + _epochDuration;
        _start(_startTimestamp, _endTimestamp, _recalculation(_startTimestamp, _endTimestamp));
    }

    /** @dev Start the pool at a specific time. Funds for rewards will be checked and staking will be opened.
     * @param _epochDuration the duration of the infinite pool ex: (7 days = 604800 seconds)
     * @param _startTimestamp The start time of the pool
     */
    function start(uint256 _epochDuration, uint256 _startTimestamp) external virtual onlyOwner {
        epochDuration = _epochDuration;
        uint256 _endTimestamp = _startTimestamp + _epochDuration;
        _start(_startTimestamp, _endTimestamp, _recalculation(_startTimestamp, _endTimestamp));
    }

    function _stake(uint256 _tokenAmount, address _staker, bool _chargeStaker) internal override {
        uint256 currentTimestamp = block.timestamp;
        uint256 startTimestamp = startTimestamp();

        require(startTimestamp > 0 && currentTimestamp > startTimestamp, 'RewardsPoolBase: staking is not started');

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

        stakingToken.safeTransferFrom(address(_chargeStaker ? _staker : msg.sender), address(this), _tokenAmount);
    }

    /** @dev Recalculation function, to calculate the next rewardPerSecond for the nextEpoch
     * @param _startTimestamp The start time of the pool
     * @param _endTimestamp The end time of the pool
     */
    function _recalculation(uint256 _startTimestamp, uint256 _endTimestamp) internal returns (uint256[] memory) {
        uint256 rewardsTokensLength = rewardsTokens.length;
        uint256[] memory _rewardPerSecond = new uint256[](rewardsTokensLength);

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            // we need to cut off 3% of the rewards for the feeRecipient
            uint256 totalBalance = getAvailableBalance(i);
            uint256 fee = (totalBalance * CUT_FEE) / MAX_FEE;
            uint256 balance = getAvailableBalance(i) - fee;

            require(balance > 0, 'RewardsPoolBase: no rewards for this token');

            // and we transfer the fee to the feeRecipient
            IERC20(rewardsTokens[i]).transfer(feeRecipient, fee);

            _rewardPerSecond[i] = (balance * PRECISION) / (_endTimestamp - _startTimestamp); // calculate the rewards per second
        }

        return _rewardPerSecond;
    }

    /**
     * @dev Returns a boolean if the campaign can be extended, depending on the rewards that
     * the campaign has
     */
    function _canBeExtended() internal view returns (bool) {
        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            uint256 balance = getAvailableBalance(i);
            // if we have any rewardsTokens with a balance, the pool should be scheduled
            if (
                (rewardTokenDecimals[i] > 10 && balance >= (10 ** (rewardTokenDecimals[i] - 10))) ||
                (rewardTokenDecimals[i] <= 10 && balance >= 2)
            ) {
                return true;
            }
        }

        return false;
    }

    /**
		@dev Updates the accumulated reward multipliers for everyone and each token
	 */
    function updateRewardMultipliers() public virtual override {
        uint256 currentTimestamp = block.timestamp;
        uint256 endTimestamp = endTimestamp();

        if (currentTimestamp > endTimestamp) {
            _updateRewardMultipliers(endTimestamp);
            if (_canBeExtended()) {
                _applyExtension(
                    currentTimestamp,
                    currentTimestamp + epochDuration,
                    _recalculation(currentTimestamp, currentTimestamp + epochDuration)
                );
                _updateRewardMultipliers(currentTimestamp);
            }
        } else {
            _updateRewardMultipliers(currentTimestamp);
        }
    }

    /**
     * @dev updates the accumulated reward multipliers for everyone and each token
     */
    function _updateRewardMultipliers(uint256 _currentTimestamp) internal override {
        if (_currentTimestamp <= lastRewardTimestamp) {
            return;
        }

        uint256 applicableTimestamp = (_currentTimestamp < endTimestamp()) ? _currentTimestamp : endTimestamp();
        uint256 secondsSinceLastReward = applicableTimestamp - lastRewardTimestamp;
        uint256 rewardsTokensLength = rewardsTokens.length;

        if (secondsSinceLastReward == 0) {
            return;
        }

        if (totalStaked == 0) {
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

    // not implemented functions on infinite pools
    function extend(uint256, uint256[] calldata) external pure override {
        revert('RewardsPoolBase: not implemented on infinite pools');
    }

    function cancel() external pure override {
        revert('RewardsPoolBase: not implemented on infinite pools');
    }
}
