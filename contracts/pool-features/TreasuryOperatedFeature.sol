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

    function notifyExternalReward(uint256 reward) external virtual onlyTreasury {
        TreasuryOperated.notifyExternalReward(externalRewardToken, reward);
    }
}
