// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

abstract contract StakeLock {
    uint256 public lockEndTimestamp;

    function lock(uint256 _lockEndTimestamp) internal {
        require(_lockEndTimestamp > block.timestamp, 'lock::Lock end needs to be in the future');
        lockEndTimestamp = _lockEndTimestamp;
    }

    modifier onlyUnlocked() {
        require(
            block.timestamp > lockEndTimestamp,
            'onlyUnlocked::cannot perform this action until the end of the lock'
        );
        _;
    }
}
