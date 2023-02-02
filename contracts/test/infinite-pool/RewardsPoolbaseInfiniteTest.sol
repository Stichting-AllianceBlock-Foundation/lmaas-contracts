// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '../../infinite-pool/RewardsPoolBaseInfinite.sol';

/** @dev Contract for accesing internal / private functions in testing
 */
contract RewardsPoolbaseInfiniteTest is RewardsPoolBaseInfinite {
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) RewardsPoolBaseInfinite(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {}

    function canBeExtended() public view returns (bool) {
        return _canBeExtended();
    }

    function getCalculateRewardsAmount(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256 _rewardPerSecond
    ) public pure returns (uint256) {
        return RewardsPoolBase.calculateRewardsAmount(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }
}
