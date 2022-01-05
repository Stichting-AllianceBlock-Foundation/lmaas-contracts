// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../pool-features/OneStakerFeature.sol';

contract CompoundingRewardsPool is RewardsPoolBase, OneStakerFeature {
    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        address _staker,
        uint256 _startTimestamp,
        uint256 _endTimestamp
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, type(uint256).max, type(uint256).max) OneStakerFeature(_staker) {}

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public override(RewardsPoolBase, OneStakerFeature) {
        OneStakerFeature.stake(_tokenAmount);
    }
}
