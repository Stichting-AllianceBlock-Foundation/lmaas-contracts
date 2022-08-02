// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPoolPayment {
    function startWithPaymentContract(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) external;

    function cancelWithPaymentContract() external;

    function extendWithPaymentContract(uint256 _durationTime, uint256[] calldata _rewardPerSecond) external;

    function cancelExtensionWithPaymentContract() external;

    function startTimestamp() external view returns (uint256);

    function endTimestamp() external view returns (uint256);

    function owner() external view returns (address);
}
