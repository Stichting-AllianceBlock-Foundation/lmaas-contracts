// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';
import './RewardsPoolBase.sol';
import './StakeTransferer.sol';
import './StakeReceiver.sol';

/** @dev Staking pool without any time locks or throttling 
    Inherits all staking logic from RewardsPoolBase.
    Allows to transfer staked tokens to another whitelisted pool
*/
contract LiquidityMiningCampaign is StakeTransferer, RewardsPoolBase {
    using SafeERC20Detailed for IERC20Detailed;

    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {}

    /** @dev Change whitelist status of a receiver pool to receive transfers.
     * @param _receiver The pool address to whitelist
     * @param _whitelisted If it should be whitelisted or not
     */
    function setReceiverWhitelisted(address _receiver, bool _whitelisted) public override(StakeTransferer) onlyOwner {
        StakeTransferer.setReceiverWhitelisted(_receiver, _whitelisted);
    }

    /**
     @dev Exits the current campaing, claims the bonus and stake all rewards in another pool
	   @param _stakePool the address of the pool where the tokens will be staked
	  */
    function exitAndStake(address _stakePool) external nonReentrant {
        _exitAndStake(msg.sender, _stakePool);
    }

    function _exitAndStake(address _userAddress, address _stakePool) internal onlyWhitelistedReceiver(_stakePool) {
        UserInfo storage user = userInfo[_userAddress];

        if (user.amountStaked == 0) {
            return;
        }

        updateRewardMultipliers();
        updateUserAccruedReward(_userAddress);

        uint256[] memory finalRewards = user.tokensOwed;

        _withdraw(user.amountStaked, _userAddress);
        _claim(_userAddress);

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            user.tokensOwed[i] = 0;
            IERC20Detailed(rewardsTokens[i]).safeApprove(_stakePool, finalRewards[i]);
            StakeReceiver(_stakePool).delegateStake(_userAddress, finalRewards[i]);
        }
    }

    /// @dev Not allowed
    function exitAndTransfer(address) public pure override {
        revert('LiquidityMiningCampaign: exitAndTransfer is forbidden');
    }
}
