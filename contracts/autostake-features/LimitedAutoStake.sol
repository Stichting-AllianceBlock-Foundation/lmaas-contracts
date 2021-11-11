// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './AutoStake.sol';

contract LimitedAutoStake is AutoStake {
    using SafeMath for uint256;

    uint256 public immutable stakeLimit;

    constructor(
        address token,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 stakeEnd,
        uint256 _stakeLimit,
        uint256 _virtualBlockTime
    ) AutoStake(token, _throttleRoundBlocks, _throttleRoundCap, stakeEnd, _virtualBlockTime) {
        require(_stakeLimit != 0, 'LimitedAutoStake:constructor::stake limit should not be 0');
        stakeLimit = _stakeLimit;
    }

    modifier onlyUnderStakeLimit(address staker, uint256 newStake) {
        uint256 currentStake = balanceOf(staker);
        require(currentStake.add(newStake) <= stakeLimit, 'onlyUnderStakeLimit::Stake limit reached');
        _;
    }

    function stake(uint256 amount) public virtual override(AutoStake) onlyUnderStakeLimit(msg.sender, amount) {
        AutoStake.stake(amount);
    }
}
