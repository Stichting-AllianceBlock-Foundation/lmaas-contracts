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
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        address[] memory _rewardsTokens,
        uint256[] memory _rewardPerBlock,
        uint256 _stakeLimit,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime
    )
        RewardsPoolBase(
            _stakingToken,
            _rewardsTokens,
            _rewardPerBlock,
            _stakeLimit,
            _contractStakeLimit,
            _virtualBlockTime
        )
        StakeLock(_endTimestamp)
    {
        setThrottleParams(_throttleRoundBlocks, _throttleRoundCap, _endTimestamp, _virtualBlockTime);
    }

    function withdraw(uint256 _tokenAmount) public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    function claim() public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }

    function exit() public override(ThrottledExitFeature, RewardsPoolBase) {
        ThrottledExitFeature.exit();
    }

    function completeExit() public virtual override(ThrottledExitFeature) {
        ThrottledExitFeature.completeExit();
    }

    function exitAndTransfer(address transferTo) public virtual override(StakeTransfererFeature) onlyUnlocked {
        StakeTransfererFeature.exitAndTransfer(transferTo);
    }
}
