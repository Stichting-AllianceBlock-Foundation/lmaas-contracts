// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

abstract contract StakeReceiver {
    function delegateStake(address staker, uint256 stake) public virtual;
}
