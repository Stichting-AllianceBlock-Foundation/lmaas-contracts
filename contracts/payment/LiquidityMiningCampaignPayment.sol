// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../LiquidityMiningCampaign.sol';
import '../RewardsPoolBase.sol';

interface PaymentInterface {
  function useCredit(address walletToGiveAccess, uint256 _startTimestamp, uint256 _endTimestamp) external;
  function refundCredit(address walletToGiveAccess, uint256 _startTimestamp, uint256 _endTimestamp) external;
  function refundCreditExtension(address walletToGiveAccess) external;
}

contract LiquidityMiningCampaignPayment is LiquidityMiningCampaign {

    address paymentContract;

    constructor (
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        string memory _name,
        address _paymentContract
    ) LiquidityMiningCampaign(
         _stakingToken,
        _rewardsTokens,
        _stakeLimit,
        _contractStakeLimit,
        _name
    ) {
        paymentContract = _paymentContract;
    }

    function start(
        uint256 _startTimestamp, 
        uint256 _endTimestamp, 
        uint256[] calldata _rewardPerSecond
    ) external override(RewardsPoolBase) onlyOwner {
        RewardsPoolBase._start(_startTimestamp, _endTimestamp, _rewardPerSecond);
        
        PaymentInterface payment = PaymentInterface(paymentContract);
        payment.useCredit(msg.sender, _startTimestamp, _endTimestamp);
    }

    function cancel() external override(RewardsPoolBase) onlyOwner {
        PaymentInterface payment = PaymentInterface(paymentContract);
        payment.refundCredit(msg.sender, RewardsPoolBase.startTimestamp, RewardsPoolBase.endTimestamp);

        RewardsPoolBase._cancel();
    }

    function cancelExtension() external override(RewardsPoolBase) onlyOwner {
        PaymentInterface payment = PaymentInterface(paymentContract);
        payment.refundCreditExtension(msg.sender);

        RewardsPoolBase._cancelExtension();
    }
}
