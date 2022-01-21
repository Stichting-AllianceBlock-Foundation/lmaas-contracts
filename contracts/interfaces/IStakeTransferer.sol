// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IStakeTransferer {
    function setReceiverWhitelisted(address receiver, bool whitelisted) external;
}
