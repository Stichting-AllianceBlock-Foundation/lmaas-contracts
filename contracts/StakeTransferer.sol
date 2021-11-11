// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

abstract contract StakeTransferer {
    mapping(address => bool) public receiversWhitelist;

    function setReceiverWhitelisted(address receiver, bool whitelisted) public virtual {
        receiversWhitelist[receiver] = whitelisted;
    }

    modifier onlyWhitelistedReceiver(address receiver) {
        require(receiversWhitelist[receiver], 'exitAndTransfer::receiver is not whitelisted');
        _;
    }

    function exitAndTransfer(address transferTo) public virtual;
}
