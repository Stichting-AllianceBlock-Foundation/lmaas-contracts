// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './../pool-features/StakeReceiverFeature.sol';
import './OnlyExitRewardsPoolMock.sol';

contract StakeReceiverRewardsPoolMock is OnlyExitRewardsPoolMock, StakeReceiverFeature {
    constructor(
        IERC20 _stakingToken,
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name,
        address _wrappedNativeToken
    )
        OnlyExitRewardsPoolMock(
            _stakingToken,
            _startTimestamp,
            _endTimestamp,
            _rewardsTokens,
            _stakeLimit,
            _contractStakeLimit,
            _name,
            _wrappedNativeToken
        )
    {}

    function withdraw(uint256 _tokenAmount) public override(OnlyExitRewardsPoolMock, RewardsPoolBase) {
        OnlyExitRewardsPoolMock.withdraw(_tokenAmount);
    }

    function claim() public override(OnlyExitRewardsPoolMock, RewardsPoolBase) {
        OnlyExitRewardsPoolMock.claim();
    }
}
