// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './../RewardsPoolBase.sol';
import './../pool-features/OnlyExitFeature.sol';
import './../pool-features/ThrottledExitFeature.sol';
import './../pool-features/StakeTransfererFeature.sol';
import './../pool-features/StakeReceiverFeature.sol';

/** @dev Staking pool with a time lock and throttled exit. 
    Inherits all staking logic from RewardsPoolBase.
    Only allows exit at the end of the time lock and via the throttling mechanism.
*/
contract NonCompoundingRewardsPool is
    RewardsPoolBase,
    OnlyExitFeature,
    ThrottledExitFeature,
    StakeTransfererFeature,
    StakeReceiverFeature
{
    /** @param _stakingToken The token to stake
     * @param _rewardsTokens The reward tokens
     * @param _stakeLimit Maximum amount of tokens that can be staked per user
     * @param _throttleRoundSeconds Seconds per throttle round
     * @param _throttleRoundCap Maximum tokens withdrawn per throttle round
     * @param _contractStakeLimit Maximum amount of tokens that can be staked in total
     * @param _name Name of the pool
     * @param _wrappedNativeToken The wrapped version of the native token, so the token can handle native as a reward
     */
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit,
        string memory _name,
        address _wrappedNativeToken
    ) RewardsPoolBase(_stakingToken, _rewardsTokens, _stakeLimit, _contractStakeLimit, _name, _wrappedNativeToken) {
        setThrottleParams(_throttleRoundSeconds, _throttleRoundCap);
    }

    /** @dev Start the pool and set locking and throttling parameters.
     * @param _startTimestamp The start time of the pool
     * @param _endTimestamp The end time of the pool
     * @param _rewardPerSecond Amount of rewards given per second
     */
    function start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) external virtual override onlyOwner {
        _internalStart(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    function _internalStart(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) internal {
        startThrottle(_endTimestamp);
        lock(_endTimestamp);
        _start(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    /// @dev Not allowed
    function withdraw(uint256 _tokenAmount) public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.withdraw(_tokenAmount);
    }

    /// @dev Not allowed
    function claim() public override(OnlyExitFeature, RewardsPoolBase) {
        OnlyExitFeature.claim();
    }

    /// @dev Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.
    function exit() public virtual override(ThrottledExitFeature, RewardsPoolBase) {
        ThrottledExitFeature.exit();
    }

    /// @dev Completes the throttled exit from the pool.
    function completeExit() public virtual override(ThrottledExitFeature) {
        ThrottledExitFeature.completeExit();
    }

    /** @dev Exits the pool and tranfer to another pool
     * @param transferTo The new pool to tranfer to
     */
    function exitAndTransfer(address transferTo) public virtual override(StakeTransfererFeature) onlyUnlocked {
        StakeTransfererFeature.exitAndTransfer(transferTo);
    }

    /// @dev Not allowed
    function extend(uint256, uint256[] calldata) public virtual override(RewardsPoolBase) {
        revert('NonCompoundingRewardsPool: cannot extend this pool.');
    }
}
