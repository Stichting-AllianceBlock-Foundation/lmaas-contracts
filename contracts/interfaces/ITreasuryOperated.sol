// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ITreasuryOperated {
    function withdrawStake(uint256 amount) external;

    function notifyExternalReward(uint256 reward) external;
}
