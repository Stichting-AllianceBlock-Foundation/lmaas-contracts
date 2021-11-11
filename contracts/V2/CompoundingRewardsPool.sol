// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../pool-features/OneStakerFeature.sol';

contract CompoundingRewardsPool is RewardsPoolBase, OneStakerFeature {
    uint256 public MAX_INT = type(uint256).max;

    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        address _staker,
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] memory _rewardPerBlock,
        uint256 _virtualBlockTime
    )
        RewardsPoolBase(
            _stakingToken,
            _startTimestamp,
            _endTimestamp,
            _rewardsTokens,
            _rewardPerBlock,
            MAX_INT,
            MAX_INT,
            _virtualBlockTime
        )
        OneStakerFeature(_staker)
    {}

    function stake(uint256 _tokenAmount) public override(RewardsPoolBase, OneStakerFeature) {
        OneStakerFeature.stake(_tokenAmount);
    }
}
