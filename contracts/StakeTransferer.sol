// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

abstract contract StakeTransferer {
    mapping(address => bool) public receiversWhitelist;

    /** @dev Change whitelist status of a receiver pool to receive transfers.
     * @param _receiver The pool address to whitelist
     * @param _whitelisted If it should be whitelisted or not
     */
    function setReceiverWhitelisted(address _receiver, bool _whitelisted) public virtual {
        receiversWhitelist[_receiver] = _whitelisted;
    }

    modifier onlyWhitelistedReceiver(address _receiver) {
        require(receiversWhitelist[_receiver], 'exitAndTransfer::receiver is not whitelisted');
        _;
    }

    function exitAndTransfer(address transferTo) public virtual;
}
