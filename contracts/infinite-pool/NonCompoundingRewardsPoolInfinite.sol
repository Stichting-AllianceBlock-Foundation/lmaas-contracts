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
contract NonCompoundingRewardsPoolInfinite is RewardsPoolBaseInfinite, OnlyExitFeatureInfinite {
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

    /** @dev Start the pool now. Funds for rewards will be checked and staking will be opened.
     * @param _epochDuration the duration of the infinite pool ex: (7 days = 604800 seconds)
     */
    function start(uint256 _epochDuration) external override onlyOwner {
        epochDuration = _epochDuration;

        epochCount = epochCount + 1;
        uint256 _startTimestamp = block.timestamp;
        uint256 _endTimestamp = _startTimestamp + _epochDuration;

        _start(_startTimestamp, _endTimestamp);
    }

    /**
     * @dev Updates the accumulated reward multipliers for everyone and each token
     */
    function updateRewardMultipliers() public override {
        uint256 currentTimestamp = block.timestamp;

        if (currentTimestamp > endTimestamp) {
            _updateRewardMultipliers(endTimestamp);
            if (_canBeExtended()) {
                epochCount = epochCount + 1;
                _applyExtension(endTimestamp, endTimestamp + epochDuration);
                _updateRewardMultipliers(currentTimestamp);
            }
        } else {
            _updateRewardMultipliers(currentTimestamp);
        }
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
        require(
            userStakedEpoch[msg.sender] < epochCount || block.timestamp > endTimestamp,
            'exit::you can only exit at the end of the epoch'
        );
        RewardsPoolBaseInfinite.exit();

        // we reset the epoch count for the user
        userStakedEpoch[msg.sender] = 0;
    }
}
