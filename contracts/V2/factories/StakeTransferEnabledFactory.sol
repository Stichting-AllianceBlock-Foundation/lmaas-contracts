// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './../../AbstractPoolsFactory.sol';
import './../../interfaces/IStakeTransferer.sol';

abstract contract StakeTransferEnabledFactory is AbstractPoolsFactory {
    event ReceiverEnabled(address transferer, address receiver);

    function enableReceivers(address transferer, address[] memory receivers) public onlyOwner {
        require(transferer != address(0x0), 'enableReceivers::Transferer cannot be 0');
        IStakeTransferer transfererContract = IStakeTransferer(transferer);
        for (uint256 i = 0; i < receivers.length; i++) {
            require(receivers[i] != address(0x0), 'enableReceivers::Receiver cannot be 0');
            transfererContract.setReceiverWhitelisted(receivers[i], true);
            emit ReceiverEnabled(transferer, receivers[i]);
        }
    }
}
