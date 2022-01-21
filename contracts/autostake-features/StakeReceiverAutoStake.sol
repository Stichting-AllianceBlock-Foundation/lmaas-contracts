// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './AutoStake.sol';
import './../StakeReceiver.sol';

abstract contract StakeReceiverAutoStake is AutoStake, StakeReceiver {
    /** @dev Receives a stake from another pool
     * @param _staker The address who will own the stake
     * @param _amount The amount to stake
     */
    function delegateStake(address _staker, uint256 _amount) public virtual override {
        require(_amount > 0, 'StakeReceiverAutoStake: No stake sent');
        require(_staker != address(0x0), 'StakeReceiverAutoStake: Invalid staker');
        _stake(_amount, _staker, false);
    }
}
