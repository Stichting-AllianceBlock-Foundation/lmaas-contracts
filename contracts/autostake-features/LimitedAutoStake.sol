// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './AutoStake.sol';

/** @dev Adds a limit to the total stake in an auto compounding pool
 */
contract LimitedAutoStake is AutoStake {
    uint256 public immutable stakeLimit;

    constructor(
        address token,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit
    ) AutoStake(token, _throttleRoundSeconds, _throttleRoundCap, _contractStakeLimit) {
        require(_stakeLimit != 0, 'LimitedAutoStake: stake limit should not be 0');
        stakeLimit = _stakeLimit;
    }

    modifier onlyUnderStakeLimit(address staker, uint256 newStake) {
        uint256 currentStake = AutoStake.userStakedAmount[staker];
        require(currentStake + newStake <= stakeLimit, 'LimitedAutoStake: user stake limit reached');
        _;
    }

    function stake(uint256 amount) public virtual override(AutoStake) onlyUnderStakeLimit(msg.sender, amount) {
        AutoStake.stake(amount);
    }
}
