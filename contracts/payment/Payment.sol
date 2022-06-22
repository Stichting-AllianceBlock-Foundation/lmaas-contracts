// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import 'hardhat/console.sol';

interface LiquidityMiningCampaignPaymentInterface {
    function startWithPaymentContract(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond
    ) external;

    function cancelWithPaymentContract() external;

    function extendWithPaymentContract(uint256 _durationTime, uint256[] calldata _rewardPerSecond) external;

    function cancelExtensionWithPaymentContract() external;

    // function useCreditExtension(address walletToGiveAccess) external;

    // function refundCreditExtension(address walletToGiveCredit) external;
}

// import ‘https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol’;
contract PaymentPortal is Ownable {
    using SafeERC20 for IERC20;
    uint256 private constant HUNDRED_PERCENT = 1000;
    uint256 private constant SECONDS_PER_DAY = 60 * 60 * 24;
    // All payments will be sent to this address
    address public paymentReceiverA;
    address public paymentReceiverB;
    uint256 public paymentShareA = HUNDRED_PERCENT;

    IERC20 private immutable usdtToken;

    //Short campaign <= 35 days
    //Medium campaign > 35 days <= 179 days
    //Long campaign > 179 days
    enum CampaignTypes {
        SHORT,
        MEDIUM,
        LONG
    }

    //Prices for deploying first campaigns
    //priceCampaign and discounts maps to the CampaignTypes - priceCampaign[0] = short,
    //priceCampaign[1] = medium and priceCampaign[2] = Long
    uint256[3] public priceCampaign;
    uint256[3] public discounts;
    //Credits per address
    mapping(address => mapping(uint256 => uint256)) public creditsCampaigns;

    //Prices for extensions
    uint256 public priceCampaignExtension;
    //Credits per address for extensions
    mapping(address => uint256) public creditsCampaignExtension;

    // Count number of short campaigns deployed ( <36 days )
    mapping(address => uint256) public campaignsDeployed;

    // Whitelisted addresses
    mapping(address => bool) public whitelist;
    // Addressess that are allowed to refund a credit
    mapping(address => bool) public refundWhitelist;
    mapping(address => bool) public refundWhitelistExtension;

    constructor(
        address _paymentReceiverA, // required
        address _paymentReceiverB, // optional, but _paymentShareA must be 1000
        address _usdtToken, // address of the USDT token
        uint256[3] memory _priceCampaign, // price in USDT when paying with USDT (USDT uses 6 decimals)
        uint256 _priceCampaignExtension,
        uint256[3] memory _discounts
    ) {
        _setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
        require(_usdtToken != address(0), 'PaymentPortal: USDT token address cannot be 0');
        usdtToken = IERC20(_usdtToken);
        priceCampaign = _priceCampaign;
        priceCampaignExtension = _priceCampaignExtension;
        discounts = _discounts;
    }

    function _setPaymentReceivers(address _paymentReceiverA, address _paymentReceiverB) internal {
        require(_paymentReceiverA != address(0), 'PaymentPortal: Payment receiver A must be set');
        require(
            paymentShareA == HUNDRED_PERCENT || _paymentReceiverB != address(0),
            'PaymentPortal: If payment is shared, payment receiver B must be set'
        );
        paymentReceiverA = _paymentReceiverA;
        paymentReceiverB = _paymentReceiverB;
    }

    function setPaymentReceivers(address _paymentReceiverA, address _paymentReceiverB) external onlyOwner {
        _setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
    }

    //Set prices of campaigns
    function setPriceCampaign(uint256[3] calldata _priceCampaign) external onlyOwner {
        priceCampaign = _priceCampaign;
    }

    //Set prices of campaigns
    function setPriceCampaignExtension(uint256 _priceCampaignExtension) external onlyOwner {
        priceCampaignExtension = _priceCampaignExtension;
    }

    function setDiscounts(uint256[3] calldata _discounts) external onlyOwner {
        discounts = _discounts;
    }

    //Whitelist functionalities
    function addToWhitelist(address _wallet) external onlyOwner {
        whitelist[_wallet] = true;
    }

    function removeFromWhitelist(address _wallet) external onlyOwner {
        whitelist[_wallet] = false;
    }

    function isWhitelisted(address _wallet) external view returns (bool) {
        return whitelist[_wallet];
    }

    function daysToCampaignType(uint256 _days) internal pure returns (uint256) {
        if (_days <= 35) {
            return uint256(CampaignTypes.SHORT);
        } else if (_days > 35 && _days <= 179) {
            return uint256(CampaignTypes.MEDIUM);
        } else if (_days > 179) {
            return uint256(CampaignTypes.LONG);
        } else {
            return 0;
        }
    }

    function addCredit(address walletToGiveCredit, uint256 _days) external onlyOwner {
        uint256 campaignType = daysToCampaignType(_days);
        creditsCampaigns[walletToGiveCredit][campaignType] += 1;
    }

    function addCreditExtension(address walletToGiveCredit) external onlyOwner {
        creditsCampaignExtension[walletToGiveCredit] += 1;
        refundWhitelistExtension[msg.sender] = false;
    }

    function getCampaignPrice(uint256 _days) public view returns (uint256) {
        uint256 priceToPay;
        uint256 campaignPrice;

        uint256 campaignType = daysToCampaignType(_days);
        campaignPrice = priceCampaign[campaignType];
        if (campaignsDeployed[msg.sender] == 0) {
            priceToPay = campaignPrice;
        } else if (campaignsDeployed[msg.sender] >= 1 && campaignsDeployed[msg.sender] <= 2) {
            priceToPay = (campaignPrice * (100 - discounts[uint256(CampaignTypes.SHORT)])) / 100;
        } else if (campaignsDeployed[msg.sender] > 2 && campaignsDeployed[msg.sender] <= 5) {
            priceToPay = (campaignPrice * (100 - discounts[uint256(CampaignTypes.MEDIUM)])) / 100;
        } else if (campaignsDeployed[msg.sender] > 5) {
            priceToPay = (campaignPrice * (100 - discounts[uint256(CampaignTypes.LONG)])) / 100;
        }
        return priceToPay;
    }

    function pay(address walletToGiveCredit, uint256 _days) external {
        uint256 priceToPay = getCampaignPrice(_days);
        uint256 campaignType = daysToCampaignType(_days);
        // usdtToken.safeTransferFrom(msg.sender, address(this), priceToPay);
        transferPayment(msg.sender, priceToPay);

        creditsCampaigns[walletToGiveCredit][campaignType] += 1;
        campaignsDeployed[walletToGiveCredit] += 1;
    }

    function payExtension(address walletToGiveCredit) external {
        // usdtToken.safeTransferFrom(msg.sender, address(this), priceCampaignExtension);
        transferPayment(msg.sender, priceCampaignExtension);
        creditsCampaignExtension[walletToGiveCredit] += 1;
    }

    function calculateCampaignDuration(uint256 _startTimestamp, uint256 _endTimestamp) internal pure returns (uint256) {
        return (_endTimestamp - _startTimestamp) / SECONDS_PER_DAY;
    }

    //msg.sender = LMC address

    function useCredit(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond,
        address _LMCAddress
    ) external {
        LiquidityMiningCampaignPaymentInterface LMCPI = LiquidityMiningCampaignPaymentInterface(_LMCAddress);

        uint256 campaignDuration = calculateCampaignDuration(_startTimestamp, _endTimestamp);
        uint256 campaignType = daysToCampaignType(campaignDuration);

        require(creditsCampaigns[msg.sender][campaignType] > 0, 'No credits available');
        creditsCampaigns[msg.sender][campaignType] -= 1;
        refundWhitelist[msg.sender] = true;

        LMCPI.startWithPaymentContract(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    function refundCredit(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        address _LMCAddress
    ) external {
        require(refundWhitelist[msg.sender] == true, 'Wallet not whitelisted for a refund');
        uint256 campaignDuration = calculateCampaignDuration(_startTimestamp, _endTimestamp);
        uint256 campaignType = daysToCampaignType(campaignDuration);

        creditsCampaigns[msg.sender][campaignType] += 1;
        refundWhitelist[msg.sender] = false;

        LiquidityMiningCampaignPaymentInterface LMCPI = LiquidityMiningCampaignPaymentInterface(_LMCAddress);
        LMCPI.cancelWithPaymentContract();
    }

    function useCreditExtension(
        uint256 _durationTime,
        uint256[] calldata _rewardPerSecond,
        address _LMCAddress
    ) external {
        require(creditsCampaignExtension[msg.sender] > 0, 'No credits available');

        creditsCampaignExtension[msg.sender] -= 1;
        refundWhitelistExtension[msg.sender] = true;

        LiquidityMiningCampaignPaymentInterface LMCPI = LiquidityMiningCampaignPaymentInterface(_LMCAddress);
        LMCPI.extendWithPaymentContract(_durationTime, _rewardPerSecond);
        (_durationTime, _rewardPerSecond);
    }

    function refundCreditExtension(address _LMCAddress) external {
        require(refundWhitelistExtension[msg.sender] == true, 'Wallet not whitelisted for a refund');

        creditsCampaignExtension[msg.sender] += 1;
        refundWhitelistExtension[msg.sender] = false;

        LiquidityMiningCampaignPaymentInterface LMCPI = LiquidityMiningCampaignPaymentInterface(_LMCAddress);
        LMCPI.cancelExtensionWithPaymentContract();
    }

    // Splits the payment among address A and B based on the share
    function transferPayment(address _from, uint256 _amount) internal {
        uint256 amountA = (_amount * paymentShareA) / HUNDRED_PERCENT;
        uint256 amountB = _amount - amountA;
        //Question: Why is this check in here, it’s always (address(this)) right?
        if (_from == address(this)) {
            if (amountA > 0) {
                usdtToken.safeTransfer(paymentReceiverA, amountA);
            }
            if (amountB > 0) {
                usdtToken.safeTransfer(paymentReceiverB, amountB);
            }
        } else {
            if (amountA > 0) {
                usdtToken.safeTransferFrom(_from, paymentReceiverA, amountA);
            }
            if (amountB > 0) {
                usdtToken.safeTransferFrom(_from, paymentReceiverB, amountB);
            }
        }
    }
}
