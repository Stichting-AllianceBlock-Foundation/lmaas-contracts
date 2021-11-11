// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24;

interface IStakeTransferer {
    function setReceiverWhitelisted(address receiver, bool whitelisted) external;
}