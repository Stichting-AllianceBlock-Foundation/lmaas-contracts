// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../autostake-features/StakeTransfererAutoStake.sol';

contract AutoStakeTransfererMock is StakeTransfererAutoStake {
    constructor(
        address token,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap
    ) AutoStake(token, _throttleRoundBlocks, _throttleRoundCap) {}
}
