// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../autostake-features/StakeTransfererAutoStake.sol';

contract AutoStakeTransfererMock is StakeTransfererAutoStake {
    constructor(
        address token,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit
    ) AutoStake(token, _throttleRoundSeconds, _throttleRoundCap, _contractStakeLimit) {}
}
