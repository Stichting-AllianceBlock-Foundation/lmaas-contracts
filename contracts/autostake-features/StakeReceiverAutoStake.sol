// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './AutoStake.sol';
import './../StakeReceiver.sol';

abstract contract StakeReceiverAutoStake is AutoStake, StakeReceiver {
    using SafeMath for uint256;

    function delegateStake(address staker, uint256 stake) public virtual override {
        require(stake > 0, 'delegateStake::No stake sent');
        require(staker != address(0x0), 'delegateStake::Invalid staker');
        _stake(stake, staker, false);
    }
}
