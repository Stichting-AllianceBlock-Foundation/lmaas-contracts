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
        uint256[] memory _rewardPerBlock,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime
    )
        RewardsPoolBase(
            _stakingToken,
            _startBlock,
            _endBlock,
            _rewardsTokens,
            _rewardPerBlock,
            _stakeLimit,
            _contractStakeLimit,
            _virtualBlockTime
        )
    {}

    function withdraw(uint256 _tokenAmount) public virtual override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    function claim() public virtual override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }
}
