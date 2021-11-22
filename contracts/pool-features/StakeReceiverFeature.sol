// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './../RewardsPoolBase.sol';
import './../StakeReceiver.sol';

abstract contract StakeReceiverFeature is RewardsPoolBase, StakeReceiver {
    using SafeERC20Detailed for IERC20Detailed;

    function delegateStake(address staker, uint256 stake) public virtual override {
        require(stake > 0, 'delegateStake::No stake sent');
        require(staker != address(0x0), 'delegateStake::Invalid staker');
        _stake(stake, staker, false);
    }
}
