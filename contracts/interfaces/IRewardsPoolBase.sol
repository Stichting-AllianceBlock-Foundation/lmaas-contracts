// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IRewardsPoolBase {
    //View
    function getUserRewardDebt(address _userAddress, uint256 _index) external view;

    function getUserOwedTokens(address _userAddress, uint256 _index) external view;

    function getUserAccumulatedReward(
        address _userAddress,
        uint256 tokenIndex,
        uint256 time
    ) external view returns (uint256);

    function getUserTokensOwedLength(address _userAddress) external view returns (uint256);

    function getUserRewardDebtLength(address _userAddress) external view returns (uint256);

    function calculateRewardsAmount(
        uint256 _startBlock,
        uint256 _endBlock,
        uint256 _rewardPerSecond
    ) external pure returns (uint256);

    function balanceOf(address _userAddress) external view returns (uint256);

    function stakingToken() external view returns (address);

    function updateRewardMultipliers() external;

    function updateUserAccruedReward(address _userAddress) external;

    function name() external view returns (string memory);

    //Public/external
    function start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) external;

    function stake(uint256 _tokenAmount) external;

    function withdraw(uint256 _tokenAmount) external;

    function claim() external;

    function exit() external;

    function extend(uint256 _endBlock, uint256[] memory _rewardsPerBlock) external;

    function withdrawLPRewards(address recipient, address lpTokenContract) external;
}
