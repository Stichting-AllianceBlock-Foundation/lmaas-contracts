// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

/** @dev Interface to receive stake transfers from other staking pools
 */
abstract contract StakeReceiver {
    function delegateStake(address staker, uint256 stake) public virtual;
}
