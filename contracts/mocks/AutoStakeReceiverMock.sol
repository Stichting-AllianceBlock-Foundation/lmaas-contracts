// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../autostake-features/StakeReceiverAutoStake.sol';

contract AutoStakeReceiverMock is StakeReceiverAutoStake {
    constructor(
        address token,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap
    ) AutoStake(token, _throttleRoundBlocks, _throttleRoundCap) {}
}
