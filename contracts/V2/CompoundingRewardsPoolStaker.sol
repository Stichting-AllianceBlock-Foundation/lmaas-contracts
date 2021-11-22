// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../autostake-features/StakeTransfererAutoStake.sol';
import './../autostake-features/StakeReceiverAutoStake.sol';
import './../autostake-features/LimitedAutoStake.sol';

contract CompoundingRewardsPoolStaker is LimitedAutoStake, StakeTransfererAutoStake, StakeReceiverAutoStake {
    constructor(
        address token,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 stakeEnd,
        uint256 _stakeLimit,
        uint256 _virtualBlockTime
    ) LimitedAutoStake(token, _throttleRoundBlocks, _throttleRoundCap, stakeEnd, _stakeLimit, _virtualBlockTime) {}

    function stake(uint256 amount) public virtual override(AutoStake, LimitedAutoStake) {
        LimitedAutoStake.stake(amount);
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
