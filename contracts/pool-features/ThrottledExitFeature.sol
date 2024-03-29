// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './StakeLockingFeature.sol';
import './../ThrottledExit.sol';

/** @dev Throttles the exit in rounds of a given duration and limit
 */
abstract contract ThrottledExitFeature is StakeLockingFeature, ThrottledExit {
    function exit() public virtual override onlyUnlocked {
        UserInfo storage user = userInfo[msg.sender];

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone

        if (user.amountStaked == 0) {
            return;
        }

        _updateUserAccruedReward(msg.sender); // Update the accrued reward for this specific user

        uint256 amountStaked = user.amountStaked;
        uint256[] memory tokensOwed = user.tokensOwed;

        user.amountStaked = 0;

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            user.tokensOwed[i] = 0;
            user.rewardDebt[i] = 0;
        }

        initiateExit(amountStaked, tokensOwed);
    }

    function completeExit() public virtual onlyUnlocked {
        uint256 removed = finalizeExit(address(stakingToken), rewardsTokens, wrappedNativeToken);
        totalStaked = totalStaked - removed;
    }
}
