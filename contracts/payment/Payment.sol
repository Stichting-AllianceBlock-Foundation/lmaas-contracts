// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../interfaces/IPoolPayment.sol';

/** @dev Payment contract based on a credit system.
    User's pay in USDT for a short, medium or long campaign.
    When a credit is being used, this contract will kick off the start method in a liquidity mining campaign or staking campaign.
    Same goes for cancelling, extending and cancelling an extension.
    Prices for campaigns, extensions 
*/

contract Payment is Ownable {
    using SafeERC20 for IERC20;
    uint256 private constant HUNDRED_PERCENT = 1e18;
    uint256 private constant SECONDS_PER_DAY = 60 * 60 * 24;
    address public paymentReceiverA;
    address public paymentReceiverB;
    uint256 public constant paymentShareA = HUNDRED_PERCENT;

    IERC20 private immutable usdtToken;
    IERC20 private immutable wrappedUsdtToken;

    /** @dev Short campaign <= 35 days
        Medium campaign > 35 days <= 179 days
        Long campaign > 179 days
     */
    enum CampaignTypes {
        SHORT,
        MEDIUM,
        LONG
    }

    /** @dev Prices for deploying first campaigns
        priceCampaign and discounts maps to the CampaignTypes - priceCampaign[0] = short,
        priceCampaign[1] = medium and priceCampaign[2] = Long
     */
    uint256[3] public priceCampaign;
    uint256[3] public discounts;

    uint256 public priceCampaignExtension;
    mapping(address => mapping(uint256 => uint256)) public creditsCampaigns;

    mapping(address => uint256) public creditsCampaignExtension;
    mapping(address => uint256) public totalCreditsPurchased;

    mapping(address => bool) public whitelist;

    /** @param _paymentReceiverA First payment receiver
     * @param _paymentReceiverB Second payment receiver
     * @param _usdtToken Address of USDT token used to pay
     * @param _wrappedUsdtToken Address of the wrappedUSDT token used to pay
     * @param _priceCampaign Array of prices it costs to deploy a campaign ( short, medium, long)
     * @param _priceCampaignExtension Price it costs to extend a campaign
     * @param _discounts Array of discounts that are applied when a user has deployed campaigns before
     */
    constructor(
        address _paymentReceiverA,
        address _paymentReceiverB,
        address _usdtToken,
        address _wrappedUsdtToken,
        uint256[3] memory _priceCampaign,
        uint256 _priceCampaignExtension,
        uint256[3] memory _discounts
    ) {
        _setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
        require(_usdtToken != address(0), 'PaymentPortal: USDT token address cannot be 0');
        for (uint256 i = 0; i < 3; i++) {
            require(_discounts[i] <= 100, 'Discount percentage cannot be higher than 100 percent');
        }
        require(_wrappedUsdtToken != address(0), 'PaymentPortal: WUSDT token address cannot be 0');
        usdtToken = IERC20(_usdtToken);
        wrappedUsdtToken = IERC20(_wrappedUsdtToken);
        priceCampaign = _priceCampaign;
        priceCampaignExtension = _priceCampaignExtension;
        discounts = _discounts;
    }

    /** @dev Set payment receivers
     * @param _paymentReceiverA First payment receiver
     * @param _paymentReceiverB Second payment receiver
     */
    function setPaymentReceivers(address _paymentReceiverA, address _paymentReceiverB) external onlyOwner {
        _setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
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

    /** @dev Set campaign prices
     * @param _priceCampaign Array of prices it costs to deploy a campaign ( short, medium, long)
     */
    function setPriceCampaign(uint256[3] calldata _priceCampaign) external onlyOwner {
        priceCampaign = _priceCampaign;
    }

    /** @dev Set price of campaign extensions
     * @param _priceCampaignExtension Price it costs to extend a campaign
     */
    function setPriceCampaignExtension(uint256 _priceCampaignExtension) external onlyOwner {
        priceCampaignExtension = _priceCampaignExtension;
    }

    /** @dev Set discounts applied to users that have deployed multiple campaigns
     * @param _discounts Array of discounts that are applied when a user has deployed campaigns before
     */
    function setDiscounts(uint256[3] calldata _discounts) external onlyOwner {
        discounts = _discounts;
    }

    /** @dev Add users to a whitelist so they don't have to pay
     * @param _wallet Wallet to add to whitelist
     */
    function addToWhitelist(address _wallet) external onlyOwner {
        whitelist[_wallet] = true;
    }

    /** @dev Remove user from whitelist
     * @param _wallet Wallet to remove from whitelist
     */
    function removeFromWhitelist(address _wallet) external onlyOwner {
        whitelist[_wallet] = false;
    }

    /** @dev Helper function to calculate what kind of campaign type it is based on amount of days.
     * @param _days Amount of days to calculate campaign type ( short, medium, long)
     * @return campaignType Returns a uint256 which represent that campaign type ( 0 = short, 1 = medium, 2 = long)
     */
    function daysToCampaignType(uint256 _days) internal pure returns (uint256) {
        if (_days <= 35) {
            return uint256(CampaignTypes.SHORT);
        } else if (_days <= 179) {
            return uint256(CampaignTypes.MEDIUM);
        } else {
            return uint256(CampaignTypes.LONG);
        }
    }

    /** @dev Admin function to give a wallet a credit to deploy a campaign
     * @param _walletToGiveCredit Wallet to give a credit
     * @param _days Campaign duration in days
     */
    function addCredit(address _walletToGiveCredit, uint256 _days) external onlyOwner {
        uint256 campaignType = daysToCampaignType(_days);
        creditsCampaigns[_walletToGiveCredit][campaignType] += 1;
    }

    /** @dev Admin function to give a wallet a credit to extend a campaign
     * @param _walletToGiveCredit Wallet to give a credit
     */
    function addCreditExtension(address _walletToGiveCredit) external onlyOwner {
        creditsCampaignExtension[_walletToGiveCredit] += 1;
    }

    /** @dev Returns campaign price based on campaign duration and applied discounts if user has deployed campaigns in the past.
     * @param _days Campaign duration in days
     * @return priceToPay Price to pay in USDT.
     */
    function getCampaignPrice(uint256 _days, address _walletWithCredit) public view returns (uint256, uint256) {
        uint256 priceToPay;
        uint256 campaignPrice;

        uint256 deployedCampaigns = totalCreditsPurchased[_walletWithCredit];
        uint256 campaignType = daysToCampaignType(_days);

        uint256 discount;

        campaignPrice = priceCampaign[campaignType];
        if (deployedCampaigns != 0) {
            if (deployedCampaigns >= 1 && deployedCampaigns <= 2) {
                discount = discounts[0];
            } else if (deployedCampaigns <= 5) {
                discount = discounts[1];
            } else {
                discount = discounts[2];
            }
        }

        priceToPay = (campaignPrice * (100 - discount)) / 100;
        return (priceToPay, campaignType);
    }

    /** @dev Payment function to buy a credit for deploying a campaign
     * @param _walletToGiveCredit Wallet to give credit to
     * @param _days Campaign duration in days
     * @param _wrapped Use the wrappedVersion of USDT
     */
    function pay(
        address _walletToGiveCredit,
        uint256 _days,
        bool _wrapped
    ) external {
        (uint256 priceToPay, uint256 campaignType) = getCampaignPrice(_days, _walletToGiveCredit);
        transferPayment(priceToPay, _wrapped);
        creditsCampaigns[_walletToGiveCredit][campaignType] += 1;
        totalCreditsPurchased[_walletToGiveCredit] += 1;
    }

    /** @dev Payment function to buy a credit for extending a campaign
     * @param _walletToGiveCredit Wallet to give credit to
     * @param _wrapped Use the wrappedVersion of USDT
     */

    function payExtension(address _walletToGiveCredit, bool _wrapped) external {
        transferPayment(priceCampaignExtension, _wrapped);
        creditsCampaignExtension[_walletToGiveCredit] += 1;
    }

    /** @dev Helper function to calculate the campaign duration in days from unix timestamps
     * @param _startTimestamp Unix timestamp of start time
     * @param _endTimestamp Unix timestamp of end time
     * @return campaignDuration Campaign duration in days
     */
    function calculateCampaignDuration(uint256 _startTimestamp, uint256 _endTimestamp) internal pure returns (uint256) {
        return (_endTimestamp - _startTimestamp) / SECONDS_PER_DAY + 1;
    }

    /** @dev Deducts a credit and schedules the start of a campaign
     * @param _startTimestamp Unix timestamp of start time
     * @param _endTimestamp Unix timestamp of end time
     * @param _rewardPerSecond Amount of rewards per second
     * @param campaignAddress Address of the Liquidity Mining Campaign Payment Contract
     */
    function useCredit(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256[] calldata _rewardPerSecond,
        address campaignAddress
    ) external {
        IPoolPayment poolPaymentInterface = IPoolPayment(campaignAddress);
        require(msg.sender == poolPaymentInterface.owner(), 'Only the owner can use a credit');

        if (!whitelist[msg.sender]) {
            uint256 campaignDuration = calculateCampaignDuration(_startTimestamp, _endTimestamp);
            uint256 campaignType = daysToCampaignType(campaignDuration);

            require(creditsCampaigns[msg.sender][campaignType] > 0, 'No credits available');
            unchecked {
                creditsCampaigns[msg.sender][campaignType] -= 1;
            }
        }

        poolPaymentInterface.startWithPaymentContract(_startTimestamp, _endTimestamp, _rewardPerSecond);
    }

    /** @dev Cancels a scheduled campaign and refunds a credit to the user
     * @param campaignAddress Address of the Liquidity Mining Campaign Payment Contract
     */
    function refundCredit(address campaignAddress) external {
        IPoolPayment poolPaymentInterface = IPoolPayment(campaignAddress);
        require(msg.sender == poolPaymentInterface.owner(), 'Only the owner can cancel a campaign');

        poolPaymentInterface.cancelWithPaymentContract();

        if (!whitelist[msg.sender]) {
            uint256 _startTimestamp = poolPaymentInterface.startTimestamp();
            uint256 _endTimestamp = poolPaymentInterface.endTimestamp();
            uint256 campaignDuration = calculateCampaignDuration(_startTimestamp, _endTimestamp);
            uint256 campaignType = daysToCampaignType(campaignDuration);
            creditsCampaigns[msg.sender][campaignType] += 1;
        }
    }

    /** @dev Deducts an extension credit and schedules the extension of a campaign
     * @param _durationTime Campaign duration
     * @param _rewardPerSecond Rewards per second
     * @param campaignAddress Address of the Liquidity Mining Campaign Payment Contract
     */
    function useCreditExtension(
        uint256 _durationTime,
        uint256[] calldata _rewardPerSecond,
        address campaignAddress
    ) external {
        IPoolPayment poolPaymentInterface = IPoolPayment(campaignAddress);
        require(msg.sender == poolPaymentInterface.owner(), 'Only the owner can extend a campaign');

        if (!whitelist[msg.sender]) {
            require(creditsCampaignExtension[msg.sender] > 0, 'No credits available');
            creditsCampaignExtension[msg.sender] -= 1;
        }

        poolPaymentInterface.extendWithPaymentContract(_durationTime, _rewardPerSecond);
    }

    /** @dev Cancels a schedules campaign extensions and refunds the user a credit
     * @param campaignAddress Address of the Liquidity Mining Campaign Payment Contract
     */
    function refundCreditExtension(address campaignAddress) external {
        IPoolPayment poolPaymentInterface = IPoolPayment(campaignAddress);
        require(msg.sender == poolPaymentInterface.owner(), 'Only the owner can cancel an extension');

        if (!whitelist[msg.sender]) {
            creditsCampaignExtension[msg.sender] += 1;
        }

        poolPaymentInterface.cancelExtensionWithPaymentContract();
    }

    /** @dev Splits the payment between receiver A and receiver B
     * @param _amount Amount that's being split
     * @param _wrapped If the payment is in wrapped USDT or USDT
     */

    function transferPayment(
        address _from,
        uint256 _amount,
        bool _wrapped
    ) internal {
        uint256 amountA = (_amount * paymentShareA) / HUNDRED_PERCENT;
        uint256 amountB = _amount - amountA;

        IERC20 finalToken = _wrapped ? wrappedUsdtToken : usdtToken;

        if (amountA > 0) {
            finalToken.safeTransferFrom(msg.sender, paymentReceiverA, amountA);
        }
        if (amountB > 0) {
            finalToken.safeTransferFrom(msg.sender, paymentReceiverB, amountB);
        }
    }
}
