// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './../../infinite-pool/RewardsPoolBaseInfinite.sol';
import './../../StakeTransferer.sol';
import './../../StakeReceiver.sol';

/** @dev Transfer staked tokens to another whitelisted staking pool
 */
abstract contract StakeTransfererFeatureInfinite is RewardsPoolBaseInfinite, StakeTransferer {
    using SafeERC20 for IERC20;

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
    function exitAndTransfer(address transferTo) public virtual override onlyWhitelistedReceiver(transferTo) {
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
        totalStaked = totalStaked - userStakedAmount;

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            user.rewardDebt[i] = 0;
        }

        stakingToken.approve(transferTo, userStakedAmount);
        StakeReceiver(transferTo).delegateStake(msg.sender, userStakedAmount);
    }
}
