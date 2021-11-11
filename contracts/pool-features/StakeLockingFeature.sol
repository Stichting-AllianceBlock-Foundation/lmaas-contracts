// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';
import './../StakeLock.sol';
import './OnlyExitFeature.sol';

abstract contract StakeLockingFeature is OnlyExitFeature, StakeLock {
    function exit() public virtual override(RewardsPoolBase) onlyUnlocked {
        RewardsPoolBase.exit();
    }
}
