// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './OnlyExitFeature.sol';
import './../StakeTransferer.sol';
import './../StakeReceiver.sol';

abstract contract StakeTransfererFeature is OnlyExitFeature, StakeTransferer {
    using SafeERC20Detailed for IERC20Detailed;

    /** @dev Change whitelist status of a receiver pool to receive transfers.
     * @param _receiver The pool address to whitelist
     * @param _whitelisted If it should be whitelisted or not
     */
    function setReceiverWhitelisted(address _receiver, bool _whitelisted) public override(StakeTransferer) onlyOwner {
        StakeTransferer.setReceiverWhitelisted(_receiver, _whitelisted);
    }

    /** @dev exits the current campaign and trasnfers the stake to another whitelisted campaign
		@param transferTo address of the receiver to transfer the stake to
	 */
    function exitAndTransfer(address transferTo)
        public
        virtual
        override
        onlyWhitelistedReceiver(transferTo)
        nonReentrant
    {
        UserInfo storage user = userInfo[msg.sender];

        if (user.amountStaked == 0) {
            return;
        }
        updateRewardMultipliers(); // Update the accumulated multipliers for everyone

        uint256 userStakedAmount = user.amountStaked;

        _updateUserAccruedReward(msg.sender); // Update the accrued reward for this specific user

        _claim(msg.sender);

        //If this is before the claim, the will never be able to claim his rewards.
        user.amountStaked = 0;
        stakingToken.safeApprove(transferTo, userStakedAmount);

        StakeReceiver(transferTo).delegateStake(msg.sender, userStakedAmount);

        totalStaked = totalStaked - userStakedAmount;

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            user.tokensOwed[i] = 0;
            user.rewardDebt[i] = 0;
        }
    }
}
