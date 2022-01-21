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
        uint256 _stakeLimit
    ) AutoStake(token, _throttleRoundSeconds, _throttleRoundCap) {
        require(_stakeLimit != 0, 'LimitedAutoStake:constructor::stake limit should not be 0');
        stakeLimit = _stakeLimit;
    }

    modifier onlyUnderStakeLimit(address staker, uint256 newStake) {
        uint256 currentStake = balanceOf(staker);
        require(currentStake + newStake <= stakeLimit, 'onlyUnderStakeLimit::Stake limit reached');
        _;
    }

    function stake(uint256 amount) public virtual override(AutoStake) onlyUnderStakeLimit(msg.sender, amount) {
        AutoStake.stake(amount);
    }
}
