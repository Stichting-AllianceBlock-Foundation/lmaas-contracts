// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../RewardsPoolBase.sol';
import './../StakeReceiver.sol';

/** @dev Receive a stake from another pool
 */
abstract contract StakeReceiverFeature is RewardsPoolBase, StakeReceiver {
    /** @dev Receives a stake from another pool
     * @param _staker The address who will own the stake
     * @param _amount The amount to stake
     */
    function delegateStake(address _staker, uint256 _amount) public virtual override {
        require(_amount > 0, 'StakeReceiverFeature: No stake sent');
        require(_staker != address(0x0), 'StakeReceiverFeature: Invalid staker');
        _stake(_amount, _staker, false, true);
    }
}
