// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../pool-features/OnlyExitFeature.sol';
import './../pool-features/ThrottledExitFeature.sol';
import './../pool-features/StakeTransfererFeature.sol';
import './../pool-features/StakeReceiverFeature.sol';

contract NonCompoundingRewardsPool is
    RewardsPoolBase,
    OnlyExitFeature,
    ThrottledExitFeature,
    StakeTransfererFeature,
    StakeReceiverFeature
{
    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit) {
        setThrottleParams(_throttleRoundBlocks, _throttleRoundCap);
    }

    /** @dev Start the pool and set locking and throttling parameters.
     * @param _startTimestamp The start time of the pool
     * @param _endTimestamp The end time of the pool
     * @param _rewardPerSecond Amount of rewards given per second
     */
    function start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) public override onlyOwner {
        startThrottle(_endTimestamp);
        lock(_endTimestamp);
        _start(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    /// @dev Not allowed
    function withdraw(uint256 _tokenAmount) public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    /// @dev Not allowed
    function claim() public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }

    /// @dev Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.
    function exit() public override(ThrottledExitFeature, RewardsPoolBase) {
        ThrottledExitFeature.exit();
    }

    /// @dev Completes the throttled exit from the pool.
    function completeExit() public virtual override(ThrottledExitFeature) {
        ThrottledExitFeature.completeExit();
    }

    function exitAndTransfer(address transferTo) public virtual override(StakeTransfererFeature) onlyUnlocked {
        StakeTransfererFeature.exitAndTransfer(transferTo);
    }

    /// @dev Not allowed
    function extend(uint256, uint256[] calldata) external virtual override(RewardsPoolBase) {
        revert('NonCompoundingRewardsPool::cannot extend this pool.');
    }
}
