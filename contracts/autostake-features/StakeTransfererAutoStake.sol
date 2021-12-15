// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './AutoStake.sol';
import './../StakeTransferer.sol';
import './../StakeReceiver.sol';

abstract contract StakeTransfererAutoStake is AutoStake, StakeTransferer {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    function setReceiverWhitelisted(address receiver, bool whitelisted) public override(StakeTransferer) onlyOwner {
        StakeTransferer.setReceiverWhitelisted(receiver, whitelisted);
    }

    /** @dev exits the current campaign and trasnfers the stake to another whitelisted campaign
		@param transferTo address of the receiver to transfer the stake to
	 */
    function exitAndTransfer(address transferTo)
        public
        virtual
        override
        onlyWhitelistedReceiver(transferTo)
        onlyUnlocked
        nonReentrant
    {
        exitRewardPool();
        updateValuePerShare();

        uint256 userStake = balanceOf(msg.sender);
        if (userStake == 0) {
            return;
        }

        totalShares = totalShares.sub(share[msg.sender]);
        share[msg.sender] = 0;

        stakingToken.safeApprove(transferTo, userStake);

        StakeReceiver(transferTo).delegateStake(msg.sender, userStake);

        updateValuePerShare();
    }
}
