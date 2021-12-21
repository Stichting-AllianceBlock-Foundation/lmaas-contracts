// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../SafeERC20Detailed.sol';
import './../interfaces/IERC20Detailed.sol';
import './../RewardsPoolBase.sol';
import './../TreasuryOperated.sol';

abstract contract TreasuryOperatedFeature is RewardsPoolBase, TreasuryOperated {
    using SafeERC20Detailed for IERC20Detailed;
    address public immutable externalRewardToken;

    constructor(address _externalRewardToken, address _treasury) TreasuryOperated(_treasury) {
        externalRewardToken = _externalRewardToken;
    }

    function withdrawStake(uint256 amount) public virtual override(TreasuryOperated) onlyTreasury {
        stakingToken.safeTransfer(treasury, amount);
        TreasuryOperated.withdrawStake(amount);
    }

    function notifyExternalReward(uint256 reward) public virtual onlyTreasury {
        TreasuryOperated.notifyExternalReward(externalRewardToken, reward);
    }

    function claimExternalRewards(uint256 exitReward, uint256 totalExitReward) internal virtual {
        uint256 totalExternalReward = externalRewards[externalRewardToken];
        uint256 externalReward = (exitReward * totalExternalReward) / totalExitReward;
        externalRewards[externalRewardToken] = externalRewards[externalRewardToken] - externalReward;
        IERC20Detailed(externalRewardToken).safeTransfer(msg.sender, externalReward);
        TreasuryOperated.claimExternalRewards();
    }
}
