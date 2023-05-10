// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../LiquidityMiningCampaign.sol';
import '../RewardsPoolBase.sol';

/** @dev Extension of a liquidity mining campaign.
    This contract overrides methods from a liquidity mining campaign.
    This is done so that the payment contract can kick off functions from a liquidity mining campaign.
*/

contract LiquidityMiningCampaignPayment is LiquidityMiningCampaign {
    address internal immutable paymentContract;

    /** @param _stakingToken The token to stake
     * @param _rewardsTokens The reward tokens
     * @param _stakeLimit Maximum amount of tokens that can be staked per user
     * @param _contractStakeLimit Maximum amount of tokens that can be staked in total
     * @param _name Name of the pool
     * @param _paymentContract Address of the payment contract
     */
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name,
        address _paymentContract,
        address _wrappedNativeToken
    )
        LiquidityMiningCampaign(
            _stakingToken,
            _rewardsTokens,
            _stakeLimit,
            _contractStakeLimit,
            _name,
            _wrappedNativeToken
        )
    {
        require(_paymentContract != address(0), 'Payment contract address cannot be 0');
        paymentContract = _paymentContract;
    }

    modifier onlyPaymentContract() {
        require(msg.sender == paymentContract, 'Only payment contract can call this');
        _;
    }

    /** @dev Overrides the old start method so that it can only be called by the payment contract
     */
    function start(uint256, uint256, uint256[] calldata) external view override(RewardsPoolBase) onlyOwner {
        revert('Start cannot be called direct, must be called through payment contract');
    }

    /** @dev Start the pool. Funds for rewards will be checked and staking will be opened.
     * @param _startTimestamp The start time of the pool
     * @param _endTimestamp The end time of the pool
     * @param _rewardPerSecond Amount of rewards given per second
     */
    function startWithPaymentContract(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) external onlyPaymentContract {
        RewardsPoolBase._start(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    /// @dev Overrides the old cancel method so that it can only be called by the payment contract
    function cancel() external view override(RewardsPoolBase) onlyOwner {
        revert('Cancel cannot be called direct, must be called through payment contract');
    }

    /// @dev Cancels the scheduled start. Can only be done before the start.
    function cancelWithPaymentContract() external onlyPaymentContract {
        RewardsPoolBase._cancel();
    }

    /// @dev Overrides the old extend method so that it can only be called by the payment contract
    function extend(uint256, uint256[] calldata) external view override onlyOwner {
        revert('Extend cannot be called direct, must be called through payment contract');
    }

    /** @dev Extends the rewards period and updates the rates. 
     When the current campaign is still going on, the extension will be scheduled and started when the campaign ends.
     The extension can be cancelled until it starts. After it starts, the rewards are locked in and cannot be withdraw.
     * @param _durationTime duration of the campaign (how many seconds the campaign will have)
     * @param _rewardPerSecond array with new rewards per second for each token
     */
    function extendWithPaymentContract(
        uint256 _durationTime,
        uint256[] calldata _rewardPerSecond
    ) external onlyPaymentContract {
        RewardsPoolBase._extend(_durationTime, _rewardPerSecond);
    }

    /// @dev Overrides the cancel extend method so that it can only be called by the payment contract
    function cancelExtension() external view override(RewardsPoolBase) onlyOwner {
        revert('Cancel extension cannot be called direct, must be called through payment contract');
    }

    /// @dev Cancels the schedules extension
    function cancelExtensionWithPaymentContract() external onlyPaymentContract {
        RewardsPoolBase._cancelExtension();
    }
}
