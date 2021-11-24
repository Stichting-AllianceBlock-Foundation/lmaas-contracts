// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../pool-features/StakeReceiverFeature.sol';
import './OnlyExitRewardsPoolMock.sol';

contract StakeReceiverRewardsPoolMock is OnlyExitRewardsPoolMock, StakeReceiverFeature {
    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startBlock,
        uint256 _endBlock,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime
    )
        OnlyExitRewardsPoolMock(
            _stakingToken,
            _startBlock,
            _endBlock,
            _rewardsTokens,
            _stakeLimit,
            _contractStakeLimit,
            _virtualBlockTime
        )
    {}

    function withdraw(uint256 _tokenAmount) public override(OnlyExitRewardsPoolMock, RewardsPoolBase) {
        OnlyExitRewardsPoolMock.withdraw(_tokenAmount);
    }

    function claim() public override(OnlyExitRewardsPoolMock, RewardsPoolBase) {
        OnlyExitRewardsPoolMock.claim();
    }
}
