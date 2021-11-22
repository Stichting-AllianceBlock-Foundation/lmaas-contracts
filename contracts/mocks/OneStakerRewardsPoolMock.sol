// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../pool-features/OneStakerFeature.sol';

contract OneStakerRewardsPoolMock is RewardsPoolBase, OneStakerFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startBlock,
        uint256 _endBlock,
        address[] memory _rewardsTokens,
        uint256[] memory _rewardPerBlock,
        uint256 _stakeLimit,
        address _staker,
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
        OneStakerFeature(_staker)
    {}

    function stake(uint256 _tokenAmount) public override(RewardsPoolBase, OneStakerFeature) {
        OneStakerFeature.stake(_tokenAmount);
    }
}
