// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '../V2/NonCompoundingRewardsPool.sol';

/** @dev Staking pool with a time lock and throttled exit. 
    Inherits all staking logic from RewardsPoolBase.
    Only allows exit at the end of the time lock and via the throttling mechanism.
*/
contract StakingCampaignRecipient is NonCompoundingRewardsPool {
    /** @param _stakingToken The token to stake
     * @param _rewardsTokens The reward tokens
     * @param _stakeLimit Maximum amount of tokens that can be staked per user
     * @param _throttleRoundSeconds Seconds per throttle round
     * @param _throttleRoundCap Maximum tokens withdrawn per throttle round
     * @param _contractStakeLimit Maximum amount of tokens that can be staked in total
     * @param _name Name of the pool
     */
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit,
        string memory _name
    )
        NonCompoundingRewardsPool(
            _stakingToken,
            _rewardsTokens,
            _stakeLimit,
            _throttleRoundSeconds,
            _throttleRoundCap,
            _contractStakeLimit,
            _name
        )
    {}

    /**
     * @dev Disabled the stake for this specific contract, so we can add the recipient as needed.
     */
    function stake(uint256) public pure override {
        revert('StakingCampaignRecipient: not allowed in campaign recipient.');
    }
}
