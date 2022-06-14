// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface PaymentInterface {
  function useCredit(address walletToGiveAccess, uint256 _startTimestamp, uint256 _endTimestamp) external;
}

interface CampaignInterface {
    function start(uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond) external;
}

contract LiquidityMiningCampaignPayment {

    function start(uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond,
        address _campaignAddress,
        address _paymentContract) external {

            CampaignInterface campaign = CampaignInterface(_campaignAddress);
            campaign.start(_startTimestamp, _endTimestamp, _rewardPerSecond);
            
            PaymentInterface payment = PaymentInterface(_paymentContract);
            payment.useCredit(msg.sender, _startTimestamp, _endTimestamp);

        }


    
}
