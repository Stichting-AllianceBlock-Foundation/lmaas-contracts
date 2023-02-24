// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../V2/NonCompoundingRewardsPool.sol';

/** @dev Staking pool with a time lock and throttled exit. 
    Inherits all staking logic from RewardsPoolBase.
    Only allows exit at the end of the time lock and via the throttling mechanism.
*/
contract StakingCampaignRecipient is NonCompoundingRewardsPool {
    using SafeERC20 for IERC20;

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
     * @dev Add the stakers in a batch to the recipient contract.
     */
    function addStakersBatch(address[] calldata _stakers, uint256[] calldata _stakingAmounts) external onlyOwner {
        uint256 stakersLength = _stakers.length;
        uint256 stakingAmountsLength = _stakingAmounts.length;
        require(
            stakersLength == stakingAmountsLength,
            'StakingCampaignRecipient: stakers and staking amounts length mismatch'
        );

        for (uint256 i = 0; i < stakersLength; i++) {
            _stake(_stakingAmounts[i], _stakers[i], false);
        }
    }

    /// @dev Override the stake function to not charge the staker.
    function _stake(
        uint256 _tokenAmount,
        address _staker,
        bool
    ) internal override {
        uint256 currentTimestamp = block.timestamp;
        require(
            (startTimestamp > 0 && currentTimestamp > startTimestamp) &&
                (currentTimestamp <= endTimestamp + extensionDuration),
            'RewardsPoolBase: staking is not started or is finished or no extension taking in place'
        );

        UserInfo storage user = userInfo[_staker];
        require(
            (user.amountStaked + _tokenAmount <= stakeLimit) && (totalStaked + _tokenAmount <= contractStakeLimit),
            'RewardsPoolBase: stake limit reached'
        );

        require(_tokenAmount > 0, 'RewardsPoolBase: cannot stake 0');

        // if no amount has been staked this is considered the initial stake
        if (user.amountStaked == 0) {
            user.firstStakedTimestamp = currentTimestamp;
        }

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        _updateUserAccruedReward(_staker); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked + _tokenAmount;
        totalStaked = totalStaked + _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            user.rewardDebt[i] = (user.amountStaked * accumulatedRewardMultiplier[i]) / PRECISION; // Update user reward debt for each token
        }

        emit Staked(_staker, _tokenAmount);
    }

    /// @dev Override the exit function to not transfer the staking token (which is simulated).
    function finalizeExit(address _stakingToken, address[] memory _rewardsTokens) internal override returns (uint256) {
        ExitInfo storage info = exitInfo[msg.sender];
        require(block.timestamp > info.exitTimestamp, 'finalizeExit::Trying to exit too early');

        uint256 infoExitStake = info.exitStake;
        require(infoExitStake > 0, 'finalizeExit::No stake to exit');
        info.exitStake = 0;

        for (uint256 i = 0; i < _rewardsTokens.length; i++) {
            uint256 infoRewards = info.rewards[i];
            info.rewards[i] = 0;

            IERC20(_rewardsTokens[i]).safeTransfer(msg.sender, infoRewards);
        }

        emit ExitCompleted(msg.sender, infoExitStake);

        return infoExitStake;
    }

    /**
     * @dev Disabled the stake for this specific contract, so we can add the recipient as needed.
     */
    function stake(uint256) public pure override {
        revert('StakingCampaignRecipient: not allowed in campaign recipient.');
    }
}
