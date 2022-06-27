// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../V2/NonCompoundingRewardsPool.sol';
import '../RewardsPoolBase.sol';

interface PaymentInterface {
    function useCredit(
        address walletToGiveAccess,
        uint256 _startTimestamp,
        uint256 _endTimestamp
    ) external;

    function refundCredit(
        address walletToGiveAccess,
        uint256 _startTimestamp,
        uint256 _endTimestamp
    ) external;

    function useCreditExtension(address walletToGiveAccess) external;

    function refundCreditExtension(address walletToGiveCredit) external;
}

contract StakingCampaignPayment is NonCompoundingRewardsPool {
    address paymentContract;

    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        uint256 _stakeLimit,
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit,
        string memory _name,
        address _paymentContract
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
    {
        setThrottleParams(_throttleRoundSeconds, _throttleRoundCap);
        paymentContract = _paymentContract;
    }

    modifier onlyPaymentContract() {
        require(msg.sender == paymentContract, 'Only payment contract can call this');
        _;
    }

    function start(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) public override(NonCompoundingRewardsPool) onlyOwner {
        revert('Start cannot be called direct, must be called through payment contract');
    }

    function startWithPaymentContract(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) external onlyPaymentContract {
        NonCompoundingRewardsPool.start(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    function cancel() external view override(RewardsPoolBase) onlyOwner {
        revert('Cancel cannot be called direct, must be called through payment contract');
    }

    function cancelWithPaymentContract() external onlyPaymentContract {
        RewardsPoolBase._cancel();
    }

    function extend(uint256 _durationTime, uint256[] calldata _rewardPerSecond) public view override onlyOwner {
        revert('Extend cannot be called direct, must be called through payment contract');
    }

    function extendWithPaymentContract(uint256 _durationTime, uint256[] calldata _rewardPerSecond)
        external
        onlyPaymentContract
    {
        NonCompoundingRewardsPool.extend(_durationTime, _rewardPerSecond);
    }

    function cancelExtension() external view override(RewardsPoolBase) onlyOwner {
        revert('Cancel extension cannot be called direct, must be called through payment contract');
    }

    function cancelExtensionWithPaymentContract() external onlyPaymentContract {
        RewardsPoolBase._cancelExtension();
    }
}
