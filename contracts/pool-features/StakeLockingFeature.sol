// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../RewardsPoolBase.sol';
import './../StakeLock.sol';
import './OnlyExitFeature.sol';

/** @dev Locks the pool for a certain period of time, only after the lock period
    has passed can the pool be exited.
*/
abstract contract StakeLockingFeature is OnlyExitFeature, StakeLock {
    function exit() public virtual override(RewardsPoolBase) onlyUnlocked {
        RewardsPoolBase.exit();
    }
}
