// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

// import ‘https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol’;
contract PaymentPortal is Ownable {
    using SafeERC20 for IERC20;
    uint256 private constant HUNDRED_PERCENT = 1000;
    // All payments will be sent to this address
    address private paymentReceiverA;
    address private paymentReceiverB;
    uint256 private paymentShareA = HUNDRED_PERCENT;
    IERC20 private immutable usdtToken;
    enum CampaignTypes {
        SHORT,
        MEDIUM,
        LONG
    }
    //Prices for deploying first campaigns
    uint256[3] private priceCampaign;
    //Prices for extensions
    uint256 private priceCampaignExtension;
    //Credits per address
    mapping(address => mapping(uint256 => uint256)) private creditsCampaigns;
    //Credits per address for extensions
    mapping(address => uint256) private creditsCampaignExtension;
    // Count number of short campaigns deployed ( <36 days )
    mapping(address => uint256) private campaignsDeployed;
    // Whitelisted addresses
    mapping(address => bool) private whitelist;
    //Discounts
    uint256 private lowestDiscount;
    uint256 private mediumDiscount;
    uint256 private highestDiscount;

    constructor(
        address _paymentReceiverA, // required
        address _paymentReceiverB, // optional, but _paymentShareA must be 1000
        address _usdtToken, // address of the USDT token
        uint256[3] memory _priceCampaign, // price in USDT when paying with USDT (USDT uses 6 decimals)
        uint256 _priceCampaignExtension,
        uint256 _lowestDiscount,
        uint256 _mediumDiscount,
        uint256 _highestDiscount
    ) {
        _setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
        require(
            _usdtToken != address(0),
            "PaymentPortal: USDT token address cannot be 0"
        );
        usdtToken = IERC20(_usdtToken);
        priceCampaign = _priceCampaign;
        priceCampaignExtension = _priceCampaignExtension;
        lowestDiscount = _lowestDiscount;
        mediumDiscount = _mediumDiscount;
        highestDiscount = _highestDiscount;
    }

    function getPriceCampaign() external view returns (uint256[3] memory) {
        return priceCampaign;
    }

    function getPaymentReceiverA() external view returns (address) {
        return paymentReceiverA;
    }

    function getPaymentReceiverB() external view returns (address) {
        return paymentReceiverB;
    }

    function getPaymentShareA() external view returns (uint256) {
        return paymentShareA;
    }

    function getPriceCampaignExtension() external view returns (uint256) {
        return priceCampaignExtension;
    }

    function getLowestDiscount() external view returns (uint256) {
        return lowestDiscount;
    }

    function getMediumDiscount() external view returns (uint256) {
        return mediumDiscount;
    }

    function getHighestDiscount() external view returns (uint256) {
        return highestDiscount;
    }

    function getCreditsCampaigns(address _wallet, CampaignTypes _type)
        external
        view
        returns (uint256)
    {
        return creditsCampaigns[_wallet][uint256(_type)];
    }

    function getCreditsCampaignExtension(address _wallet)
        external
        view
        returns (uint256)
    {
        return creditsCampaignExtension[_wallet];
    }

    function getCampaignsDeployed(address _wallet)
        external
        view
        returns (uint256)
    {
        return campaignsDeployed[_wallet];
    }

    //#Question: Split into external / internal function, why?
    function _setPaymentReceivers(
        address _paymentReceiverA,
        address _paymentReceiverB
    ) internal {
        require(
            _paymentReceiverA != address(0),
            "PaymentPortal: Payment receiver A must be set"
        );
        require(
            paymentShareA == HUNDRED_PERCENT || _paymentReceiverB != address(0),
            "PaymentPortal: If payment is shared, payment receiver B must be set"
        );
        paymentReceiverA = _paymentReceiverA;
        paymentReceiverB = _paymentReceiverB;
    }

    function setPaymentReceivers(
        address _paymentReceiverA,
        address _paymentReceiverB
    ) external onlyOwner {
        _setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
    }

    //Set prices of campaigns
    function setPriceCampaign(uint256[3] calldata _priceCampaign)
        external
        onlyOwner
    {
        priceCampaign = _priceCampaign;
    }

    //Set prices of campaigns
    function setPriceCampaignExtension(uint256 _priceCampaignExtension)
        external
        onlyOwner
    {
        priceCampaignExtension = _priceCampaignExtension;
    }

    function setLowestDiscount(uint256 _lowestDiscount) external onlyOwner {
        lowestDiscount = _lowestDiscount;
    }

    function setMediumDiscount(uint256 _mediumDiscount) external onlyOwner {
        mediumDiscount = _mediumDiscount;
    }

    function setHighestDiscount(uint256 _highestDiscount) external onlyOwner {
        highestDiscount = _highestDiscount;
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

    function addCredit(address walletToGiveCredit, uint256 _days)
        external
        onlyOwner
    {
        if (_days <= 35) {
            creditsCampaigns[walletToGiveCredit][
                uint256(CampaignTypes.SHORT)
            ] += 1;
        } else if (_days > 35 && _days <= 179) {
            creditsCampaigns[walletToGiveCredit][
                uint256(CampaignTypes.MEDIUM)
            ] += 1;
        } else if (_days > 179) {
            creditsCampaigns[walletToGiveCredit][
                uint256(CampaignTypes.LONG)
            ] += 1;
        }
    }

    function addCreditExtension(address walletToGiveCredit) external onlyOwner {
        creditsCampaignExtension[walletToGiveCredit] += 1;
    }

    function pay(address walletToGiveCredit, uint256 _days) external {
        uint256 priceToPay;
        uint256 campaignPrice;
        if (_days <= 35) {
            campaignPrice = priceCampaign[uint256(CampaignTypes.SHORT)];
        } else if (_days > 35 && _days <= 179) {
            campaignPrice = priceCampaign[uint256(CampaignTypes.MEDIUM)];
        } else if (_days > 179) {
            campaignPrice = priceCampaign[uint256(CampaignTypes.LONG)];
        }
        if (campaignsDeployed[msg.sender] == 0) {
            priceToPay = campaignPrice;
        } else if (
            campaignsDeployed[msg.sender] >= 1 &&
            campaignsDeployed[msg.sender] <= 2
        ) {
            priceToPay = (campaignPrice * (100 - lowestDiscount)) / 100;
        } else if (
            campaignsDeployed[msg.sender] > 2 &&
            campaignsDeployed[msg.sender] <= 5
        ) {
            priceToPay = (campaignPrice * (100 - mediumDiscount)) / 100;
        } else if (campaignsDeployed[msg.sender] > 5) {
            priceToPay = (campaignPrice * (100 - highestDiscount)) / 100;
        }

        usdtToken.safeTransferFrom(msg.sender, address(this), priceToPay);
        transferPayment(address(this), priceToPay);
        if (_days <= 35) {
            creditsCampaigns[walletToGiveCredit][
                uint256(CampaignTypes.SHORT)
            ] += 1;
        } else if (_days > 35 && _days <= 179) {
            creditsCampaigns[walletToGiveCredit][
                uint256(CampaignTypes.MEDIUM)
            ] += 1;
        } else if (_days > 179) {
            creditsCampaigns[walletToGiveCredit][
                uint256(CampaignTypes.LONG)
            ] += 1;
        }
        campaignsDeployed[walletToGiveCredit] += 1;
    }

    function payExtension(address walletToGiveCredit) external {
        usdtToken.safeTransferFrom(
            msg.sender,
            address(this),
            priceCampaignExtension
        );
        transferPayment(address(this), priceCampaignExtension);
        creditsCampaignExtension[walletToGiveCredit] += 1;
    }

    function useCredit(address walletToGiveAccess, uint256 _startTimestamp, uint256 _endTimestamp) external {
        uint256 campaignDuration = (_endTimestamp - _startTimestamp) / 60 / 60 / 24;

        if (campaignDuration <= 35) {
            require(
                creditsCampaigns[walletToGiveAccess][
                    uint256(CampaignTypes.SHORT)
                ] > 0,
                "No credits available"
            );
            creditsCampaigns[walletToGiveAccess][
                uint256(CampaignTypes.SHORT)
            ] -= 1;
        } else if (campaignDuration > 35 && campaignDuration <= 179) {
            require(
                creditsCampaigns[walletToGiveAccess][
                    uint256(CampaignTypes.MEDIUM)
                ] > 0,
                "No credits available"
            );
            creditsCampaigns[walletToGiveAccess][
                uint256(CampaignTypes.MEDIUM)
            ] -= 1;
        } else if (campaignDuration > 179) {
            require(
                creditsCampaigns[walletToGiveAccess][
                    uint256(CampaignTypes.LONG)
                ] > 0,
                "No credits available"
            );
            creditsCampaigns[walletToGiveAccess][
                uint256(CampaignTypes.LONG)
            ] -= 1;
        }
    }

    function useCreditExtension(address walletToGiveAccess) external {
        require(
            creditsCampaignExtension[walletToGiveAccess] > 0,
            "No credits available"
        );
        creditsCampaignExtension[walletToGiveAccess] -= 1;
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
