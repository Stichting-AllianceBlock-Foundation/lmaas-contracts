// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../pool-features/OnlyExitFeature.sol';

contract OnlyExitRewardsPoolMock is RewardsPoolBase, OnlyExitFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startBlock,
        uint256 _endBlock,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit) {}

    function withdraw(uint256 _tokenAmount) public virtual override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    function claim() public virtual override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }
}
