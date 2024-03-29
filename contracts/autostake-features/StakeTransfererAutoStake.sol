// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './AutoStake.sol';
import './../StakeTransferer.sol';
import './../StakeReceiver.sol';

/** @dev Transfer staked tokens to another whitelisted staking pool
 */
abstract contract StakeTransfererAutoStake is AutoStake, StakeTransferer {
    using SafeERC20 for IERC20;

    /** @dev Change whitelist status of a receiver pool to receive transfers.
     * @param _receiver The pool address to whitelist
     * @param _whitelisted If it should be whitelisted or not
     */
    function setReceiverWhitelisted(address _receiver, bool _whitelisted) public override(StakeTransferer) onlyOwner {
        StakeTransferer.setReceiverWhitelisted(_receiver, _whitelisted);
    }

    /** @dev exits the current campaign and trasnfers the stake to another whitelisted campaign
		@param _transferTo address of the receiver to transfer the stake to
	 */
    function exitAndTransfer(address _transferTo)
        public
        virtual
        override
        onlyWhitelistedReceiver(_transferTo)
        onlyUnlocked
    {
        exitRewardPool();
        updateValuePerShare();

        uint256 userStake = balanceOf(msg.sender);
        if (userStake == 0) {
            return;
        }

        totalShares = totalShares - share[msg.sender];
        share[msg.sender] = 0;

        stakingToken.approve(_transferTo, userStake);

        StakeReceiver(_transferTo).delegateStake(msg.sender, userStake);

        updateValuePerShare();
    }
}
