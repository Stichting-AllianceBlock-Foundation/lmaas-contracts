// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IStakingRewards {
    // Views
    function lastTimeRewardApplicable(address rewardToken) external view returns (uint256);

    function rewardPerToken(address rewardToken) external view returns (uint256);

    function earned(address account, address rewardToken) external view returns (uint256);

    function getRewardForDuration(address rewardToken) external view returns (uint256);

    function totalStakesAmount() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    // Mutative

    function stake(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function getReward() external;

    function exit() external;
}
