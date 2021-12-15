// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../pool-features/StakeTransfererFeature.sol';
import './OnlyExitRewardsPoolMock.sol';

contract StakeTransfererRewardsPoolMock is OnlyExitRewardsPoolMock, StakeTransfererFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startBlock,
        uint256 _endBlock,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit
    )
        OnlyExitRewardsPoolMock(_stakingToken, _startBlock, _endBlock, _rewardsTokens, _stakeLimit, _contractStakeLimit)
    {}

    function withdraw(uint256 _tokenAmount) public override(OnlyExitRewardsPoolMock, OnlyExitFeature) {
        OnlyExitRewardsPoolMock.withdraw(_tokenAmount);
    }

    function claim() public override(OnlyExitRewardsPoolMock, OnlyExitFeature) {
        OnlyExitRewardsPoolMock.claim();
    }
}
