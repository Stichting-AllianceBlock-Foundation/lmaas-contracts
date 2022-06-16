// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../LiquidityMiningCampaign.sol';
import '../RewardsPoolBase.sol';

interface PaymentInterface {
  function useCredit(address walletToGiveAccess, uint256 _startTimestamp, uint256 _endTimestamp) external;
  function refundCredit(address walletToGiveAccess, uint256 _startTimestamp, uint256 _endTimestamp) external;
  function useCreditExtension(address walletToGiveAccess) external;
  function refundCreditExtension(address walletToGiveCredit) external;
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

    function extend(uint256 _durationTime, uint256[] calldata _rewardPerSecond) external override onlyOwner {
        require(extensionDuration == 0, 'RewardsPoolBase: there is already an extension');

        require(_durationTime > 0, 'RewardsPoolBase: duration must be greater than 0');

        uint256 rewardPerSecondLength = _rewardPerSecond.length;
        require(rewardPerSecondLength == rewardsTokens.length, 'RewardsPoolBase: invalid rewardPerSecond');

        uint256 currentTimestamp = block.timestamp;
        bool ended = currentTimestamp > endTimestamp;

        uint256 newStartTimestamp = ended ? currentTimestamp : endTimestamp;
        uint256 newEndTimestamp = newStartTimestamp + _durationTime;

        for (uint256 i = 0; i < rewardPerSecondLength; i++) {
            uint256 newRewards = RewardsPoolBase.calculateRewardsAmount(newStartTimestamp, newEndTimestamp, _rewardPerSecond[i]);

            // We need to check if we have enough balance available in the contract to pay for the extension
            uint256 availableBalance = RewardsPoolBase.getAvailableBalance(i);

            require(availableBalance >= newRewards, 'RewardsPoolBase: not enough rewards to extend');
        }

        if (ended) {
            RewardsPoolBase._updateRewardMultipliers(endTimestamp);
            RewardsPoolBase._extend(newStartTimestamp, newEndTimestamp, _rewardPerSecond);
        } else {
            extensionDuration = _durationTime;
            extensionRewardPerSecond = _rewardPerSecond;
        }

        PaymentInterface payment = PaymentInterface(paymentContract);
        payment.useCreditExtension(msg.sender);
    }

    function cancelExtension() external override(RewardsPoolBase) onlyOwner {
        PaymentInterface payment = PaymentInterface(paymentContract);
        payment.refundCreditExtension(msg.sender);

        RewardsPoolBase._cancelExtension();
    }
}
