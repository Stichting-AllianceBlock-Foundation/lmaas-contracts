// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../RewardsPoolBase.sol';
import './../pool-features/OnlyExitFeature.sol';

contract OnlyExitRewardsPoolMock is RewardsPoolBase, OnlyExitFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name,
        address _wrappedNativeToken
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name, _wrappedNativeToken) {}

    function withdraw(uint256 _tokenAmount) public virtual override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    function claim() public virtual override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }
}
