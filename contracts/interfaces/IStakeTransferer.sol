// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IStakeTransferer {
    function setReceiverWhitelisted(address receiver, bool whitelisted) external;
}
