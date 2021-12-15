// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../pool-features/ThrottledExitFeature.sol';

contract ThrottledExitRewardsPoolMock is RewardsPoolBase, OnlyExitFeature, ThrottledExitFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startBlock,
        uint256 _endBlock,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 throttleRoundBlocks,
        uint256 throttleRoundCap,
        uint256 _contractStakeLimit
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit) StakeLock(_endBlock) {
        setThrottleParams(throttleRoundBlocks, throttleRoundCap, _endBlock);
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
}
