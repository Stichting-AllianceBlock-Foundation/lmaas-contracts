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

    function getTotalClaimed(uint256 index) public view returns (uint256) {
        return totalClaimed[index];
    }

    function getTotalSpentRewards(uint256 index) public view returns (uint256) {
        return totalSpentRewards[index];
    }

    function getLastRewardTimestamp() public view returns (uint256) {
        return lastRewardTimestamp;
    }

    function canBeExtended() public view returns (bool) {
        return _canBeExtended();
    }

    function getCalculateRewardsAmount(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256 _rewardPerSecond
    ) public pure returns (uint256) {
        return RewardsPoolBaseInfinite.calculateRewardsAmount(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }
}
