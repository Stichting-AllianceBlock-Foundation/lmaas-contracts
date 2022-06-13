// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './RewardsPoolBase.sol';
import './pool-features/StakeTransfererFeature.sol';

/** @dev Staking pool without any time locks or throttling 
    Inherits all staking logic from RewardsPoolBase.
    Allows to transfer staked tokens to another whitelisted pool
*/
contract LiquidityMiningCampaign is RewardsPoolBase, StakeTransfererFeature {
    using SafeERC20 for IERC20;

    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {}
}
