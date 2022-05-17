// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../autostake-features/StakeTransfererAutoStake.sol';
import './../autostake-features/StakeReceiverAutoStake.sol';
import './../autostake-features/LimitedAutoStake.sol';

/** @dev Staking pool with automatic compounding, a time lock and throttled exit. 
    Uses shares to track share in the pool to auto compound the reward.
    Only allows exit at the end of the time lock and via the throttling mechanism.
*/
contract CompoundingRewardsPoolStaker is LimitedAutoStake, StakeTransfererAutoStake, StakeReceiverAutoStake {
    constructor(
        address token,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit
    ) LimitedAutoStake(token, _throttleRoundSeconds, _throttleRoundCap, _stakeLimit, _contractStakeLimit) {}

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual override(AutoStake, LimitedAutoStake) {
        LimitedAutoStake.stake(_tokenAmount);
    }

    function delegateStake(address staker, uint256 amount)
        public
        virtual
        override(StakeReceiverAutoStake)
        onlyUnderStakeLimit(staker, amount)
    {
        StakeReceiverAutoStake.delegateStake(staker, amount);
    }
}
