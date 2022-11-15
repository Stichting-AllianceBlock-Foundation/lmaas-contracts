// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../RewardsPoolBase.sol';
import '../pool-features/StakeTransfererFeature.sol';

contract ILiquidityPoolReputation {
    function checkTierAndBurnReputation(
        address account,
        uint256 requestedTier,
        uint256 tokenAmount
    ) external {}
}

/** @dev Extension of liquidity mining campaign without any time locks or throttling 
    Inherits all staking logic from RewardsPoolBase.
    With some extra functionality for tier lists.
*/
contract LiquidityMiningCampaignTier is RewardsPoolBase, StakeTransfererFeature {
    using SafeERC20 for IERC20;

    enum TierList {
        BRONZE,
        SILVER,
        GOLD,
        PLATINUM,
        DEFAULT
    }

    TierList public tierCampaign;
    address public reputationContract;

    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name,
        address _reputationContract,
        TierList _tierCampaign
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {
        reputationContract = _reputationContract;
        tierCampaign = _tierCampaign;
    }

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public override {
        RewardsPoolBase._stake(_tokenAmount, msg.sender, true);

        if (tierCampaign != TierList.DEFAULT) {
            ILiquidityPoolReputation(reputationContract).checkTierAndBurnReputation(
                msg.sender,
                uint256(tierCampaign),
                _tokenAmount
            );
        }
    }
}
