// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../pool-features/OnlyExitFeature.sol';
import './../pool-features/StakeLockingFeature.sol';

contract StakeLockingRewardsPoolMock is RewardsPoolBase, OnlyExitFeature, StakeLockingFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256, // _startTimestamp,
        uint256 _endTimestamp,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {
        lock(_endTimestamp);
    }

    function withdraw(uint256 _tokenAmount) public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    function claim() public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }

    function exit() public override(StakeLockingFeature, RewardsPoolBase) {
        StakeLockingFeature.exit();
    }
}
