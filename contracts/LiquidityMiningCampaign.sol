// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';
import './RewardsPoolBase.sol';
import './StakeTransferer.sol';
import './StakeReceiver.sol';
import './pool-features/OnlyExitFeature.sol';

contract LiquidityMiningCampaign is StakeTransferer, OnlyExitFeature {
    using SafeERC20Detailed for IERC20Detailed;
    address public immutable rewardToken;
    string public campaignName;

    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        address _albtAddress,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime,
        string memory _campaingName
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _virtualBlockTime) {
        require(_albtAddress == _rewardsTokens[0], 'constructor:: The first reward address is different from the ALBT');
        rewardToken = _rewardsTokens[0];
        campaignName = _campaingName;
    }

    function setReceiverWhitelisted(address receiver, bool whitelisted) public override(StakeTransferer) onlyOwner {
        StakeTransferer.setReceiverWhitelisted(receiver, whitelisted);
    }

    function exitAndStake(address _stakePool) external nonReentrant {
        _exitAndStake(msg.sender, _stakePool);
    }

    /**
     @dev Exits the current campaing, claims the bonus and stake all rewards to ALBT staking contract
	   @param _userAddress the address of the staker
	   @param _stakePool the address of the pool where the tokens will be staked
	  */
    function _exitAndStake(address _userAddress, address _stakePool) internal onlyWhitelistedReceiver(_stakePool) {
        UserInfo storage user = userInfo[_userAddress];

        if (user.amountStaked == 0) {
            return;
        }

        updateRewardMultipliers();
        updateUserAccruedReward(_userAddress);

        uint256 finalRewards = user.tokensOwed[0];

        _withdraw(user.amountStaked, _userAddress);
        user.tokensOwed[0] = 0;
        _claim(_userAddress);

        IERC20Detailed(rewardToken).safeApprove(_stakePool, finalRewards);
        StakeReceiver(_stakePool).delegateStake(_userAddress, finalRewards);
    }

    function exitAndTransfer(address) public pure override {
        revert('LiquidityMiningCampaign::exit and transfer is forbidden');
    }
}
