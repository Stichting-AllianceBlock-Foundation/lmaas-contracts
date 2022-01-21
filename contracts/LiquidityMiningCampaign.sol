// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';
import './RewardsPoolBase.sol';
import './pool-features/StakeTransfererFeature.sol';

/** @dev Staking pool without any time locks or throttling 
    Inherits all staking logic from RewardsPoolBase.
    Allows to transfer staked tokens to another whitelisted pool
*/
contract LiquidityMiningCampaign is RewardsPoolBase, StakeTransfererFeature {
    using SafeERC20Detailed for IERC20Detailed;

    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {}
}
