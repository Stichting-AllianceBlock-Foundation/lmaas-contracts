// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './RewardsPoolBaseInfinite.sol';
import './../pool-features/infinite-pool/OnlyExitFeatureInfinite.sol';
import './../pool-features/infinite-pool/StakeTransfererFeatureInfinite.sol';
import './../pool-features/infinite-pool/StakeReceiverFeatureInfinite.sol';

/** @dev Staking pool with a time lock and throttled exit. 
    Inherits all staking logic from RewardsPoolBase.
    Only allows exit at the end of the time lock and via the throttling mechanism.
*/
contract NonCompoundingRewardsPoolInfinite is
    RewardsPoolBaseInfinite,
    OnlyExitFeatureInfinite,
    StakeTransfererFeatureInfinite,
    StakeReceiverFeatureInfinite
{
    uint256 public epochCount;
    mapping(address => uint256) userStakedEpoch;

    /** @param _stakingToken The token to stake
     * @param _rewardsTokens The reward tokens
     * @param _stakeLimit Maximum amount of tokens that can be staked per user
     * @param _contractStakeLimit Maximum amount of tokens that can be staked in total
     * @param _name Name of the pool
     */
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name
    ) RewardsPoolBaseInfinite(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name) {}

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public override {
        uint256 userEpochIn = userStakedEpoch[msg.sender];

        // we save on which epoch the user started to stake
        if (userEpochIn == 0) userStakedEpoch[msg.sender] = epochCount;

        _stake(_tokenAmount, msg.sender, true);
    }

    function _applyExtension(uint256 _startTimestamp, uint256 _endTimestamp) internal override {
        uint256 rewardPerSecondLength = rewardPerSecond.length;
        uint256 rewardsTokensLength = rewardsTokens.length;
        uint256[] memory _rewardPerSecond = new uint256[](rewardsTokensLength);

        for (uint256 i = 0; i < rewardPerSecondLength; i++) {
            uint256 spentRewards = calculateRewardsAmount(startTimestamp, endTimestamp, rewardPerSecond[i]);
            totalSpentRewards[i] = totalSpentRewards[i] + spentRewards;
        }

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 balance = getAvailableBalance(i);

            // we need to cut off 1% or 5% whatever the business decides
            // IERC20(rewardsTokens[i]).transferFrom(address(this), feeRecipient, (balance * CUT_FEE) / MAX_FEE);

            _rewardPerSecond[i] = balance / (_endTimestamp - _startTimestamp); // calculate the rewards per second
            uint256 rewardsAmount = calculateRewardsAmount(_startTimestamp, _endTimestamp, _rewardPerSecond[i]);

            require(balance >= rewardsAmount, 'RewardsPoolBaseInfinite: not enough rewards');
        }

        previousCampaigns.push(Campaign(startTimestamp, endTimestamp, rewardPerSecond));

        rewardPerSecond = _rewardPerSecond;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        lastRewardTimestamp = _startTimestamp;
        epochCount++;

        emit Extended(_startTimestamp, _endTimestamp, rewardPerSecond);
    }

    /// @dev Not allowed
    function withdraw(uint256 _tokenAmount) public override(OnlyExitFeatureInfinite, RewardsPoolBaseInfinite) {
        OnlyExitFeatureInfinite.withdraw(_tokenAmount);
    }

    /// @dev Not allowed
    function claim() public override(OnlyExitFeatureInfinite, RewardsPoolBaseInfinite) {
        OnlyExitFeatureInfinite.claim();
    }

    /// @dev which you can withdraw your stake and rewards.
    function exit() public override(RewardsPoolBaseInfinite) {
        require(userStakedEpoch[msg.sender] < epochCount, 'exit::you can only exit at the end of the epoch');
        RewardsPoolBaseInfinite.exit();

        // we reset the epoch count for the user
        userStakedEpoch[msg.sender] = 0;
    }

    /** @dev Exits the pool and tranfer to another pool
     * @param transferTo The new pool to tranfer to
     */
    function exitAndTransfer(address transferTo) public virtual override(StakeTransfererFeatureInfinite) {
        require(userStakedEpoch[msg.sender] < epochCount, 'exitAndTransfer::you can only exit at the end of the epoch');
        StakeTransfererFeatureInfinite.exitAndTransfer(transferTo);

        // we reset the epoch count for the user
        userStakedEpoch[msg.sender] = 0;
    }
}
