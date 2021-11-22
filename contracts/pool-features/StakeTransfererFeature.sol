// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './OnlyExitFeature.sol';
import './../StakeTransferer.sol';
import './../StakeReceiver.sol';

abstract contract StakeTransfererFeature is OnlyExitFeature, StakeTransferer {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    function setReceiverWhitelisted(address receiver, bool whitelisted) public override(StakeTransferer) onlyFactory {
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
        nonReentrant
    {
        UserInfo storage user = userInfo[msg.sender];

        if (user.amountStaked == 0) {
            return;
        }
        updateRewardMultipliers(); // Update the accumulated multipliers for everyone

        uint256 userStakedAmount = user.amountStaked;

        updateUserAccruedReward(msg.sender); // Update the accrued reward for this specific user

        _claim(msg.sender);

        //If this is before the claim, the will never be able to claim his rewards.
        user.amountStaked = 0;
        stakingToken.safeApprove(transferTo, userStakedAmount);

        StakeReceiver(transferTo).delegateStake(msg.sender, userStakedAmount);

        totalStaked = totalStaked.sub(userStakedAmount);

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            user.tokensOwed[i] = 0;
            user.rewardDebt[i] = 0;
        }
    }
}
