// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../pool-features/ThrottledExitFeature.sol';

contract ThrottledExitRewardsPoolMock is RewardsPoolBase, OnlyExitFeature, ThrottledExitFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256, // _startTimestamp,
        uint256 _endTimestamp,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit,
        string memory _name,
        address _wrappedNativeToken
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name, _wrappedNativeToken) {
        setThrottleParams(_throttleRoundSeconds, _throttleRoundCap);
        startThrottle(_endTimestamp);
        lock(_endTimestamp);
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
