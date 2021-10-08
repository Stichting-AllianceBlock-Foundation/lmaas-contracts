// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol';

contract PaymentPortal is Ownable {
    using SafeMath for uint256;

    // All payments will be sent to this address
    address paymentReceiverA;
    address paymentReceiverB;
    uint256 paymentShareA;

    address albtToken;
    address usdtToken;

    address uniswapPair;
    address uniswapRouter;

    uint256 priceWithALBT;
    uint256 priceWithUSDT;

    // Whitelisted addresses
    mapping(address => bool) whitelist;

    // Stores the timestamp at which each address made it's payment
    mapping(address => uint256) payments;

    constructor(
        address _paymentReceiverA, // required
        address _paymentReceiverB, // optional, but _paymentShareA must be 1000
        uint256 _paymentShareA, // what percentage of payments will go to payment receiver address A (1000 = 100%)
        address _albtToken, // address of the ALBT token
        address _usdtToken, // address of the USDT token
        address _uniswapPair, // address of the ALBT/USDT uniswap pair
        address _uniswapRouter, // address of the uniswap router
        uint256 _priceWithALBT, // price in USDT when paying with ALBT
        uint256 _priceWithUSDT // price in USDT when paying with USDT
    ) {
        setPaymentReceivers(_paymentReceiverA, _paymentReceiverB);
        setPaymentShareA(_paymentShareA);

        uniswapPair = _uniswapPair;
        uniswapRouter = _uniswapRouter;

        albtToken = _albtToken;
        usdtToken = _usdtToken;

        priceWithALBT = _priceWithALBT;
        priceWithUSDT = _priceWithUSDT;
    }

    function getPaymentReceivers() public view returns (address, address) {
        return (paymentReceiverA, paymentReceiverB);
    }

    function setPaymentReceivers(address _paymentReceiverA, address _paymentReceiverB) public onlyOwner {
        require(_paymentReceiverA != address(0), 'Payment receiver A must be set');

        paymentReceiverA = _paymentReceiverA;
        paymentReceiverB = _paymentReceiverB;
    }

    function getPaymentShareA() public view returns (uint256) {
        return paymentShareA;
    }

    function setPaymentShareA(uint256 _paymentShareA) public onlyOwner {
        require(
            _paymentShareA == 1000 || paymentReceiverB != address(0),
            'If payment is shared, payment receiver B must be set'
        );

        paymentShareA = _paymentShareA;
    }

    function addToWhitelist(address wallet) public onlyOwner {
        whitelist[wallet] = true;
    }

    function removeFromWhitelist(address wallet) public onlyOwner {
        whitelist[wallet] = false;
    }

    function isWhitelisted(address wallet) public view returns (bool) {
        return whitelist[wallet];
    }

    // Returns the timestamp at which the wallet has payed
    function paymentTimestamp(address wallet) public view returns (uint256) {
        return payments[wallet];
    }

    // Checks if the wallet has access, either via the whitelist or by a payment which is still not expired
    function hasAccess(address wallet, uint256 subscriptionDuration) public view returns (bool) {
        return whitelist[wallet] || payments[wallet].add(subscriptionDuration) > block.timestamp;
    }

    // Returns the amount of ALBT you need to pay when paying with ALBT, calculated from a discounted USDT rate
    function getPriceInALBT() public view returns (uint256) {
        return calculateUSDTtoALBT(priceWithALBT);
    }

    // Returns the amount of USDT you have to pay when paying with USDT
    function getPriceInUSDT() public view returns (uint256) {
        return priceWithUSDT;
    }

    // When you pay with ALBT the tokens are transfered directly
    function payALBT() public {
        uint256 albtAmount = calculateUSDTtoALBT(priceWithALBT);

        transferPayment(msg.sender, albtAmount);

        payments[msg.sender] = block.timestamp;
    }

    // When you pay with USDT the tokens are transfered to this contract, then swapped to ALBT, and then transfered
    function payUSDT() public {
        SafeERC20.safeTransferFrom(IERC20(usdtToken), msg.sender, address(this), priceWithUSDT);

        address[] memory route = new address[](2);
        route[0] = usdtToken;
        route[1] = albtToken;

        uint256 albtAmount = calculateUSDTtoALBT(priceWithUSDT);

        IERC20(usdtToken).approve(uniswapRouter, priceWithUSDT);

        uint256[] memory amounts = IUniswapV2Router01(uniswapRouter).swapExactTokensForTokens(
            priceWithUSDT,
            albtAmount.mul(900).div(1000), // max 10% slippage
            route,
            address(this),
            block.timestamp + 3600 * 24
        );

        uint256 exactALBTAmount = amounts[amounts.length - 1];

        transferPayment(address(this), exactALBTAmount);

        payments[msg.sender] = block.timestamp;
    }

    function transferPayment(address from, uint256 amount) internal {
        uint256 amountA = amount.mul(paymentShareA).div(1000);
        uint256 amountB = amount.mul(uint256(1000).sub(paymentShareA)).div(1000);

        if (amountA > 0) {
            if (from == address(this)) {
                SafeERC20.safeTransfer(IERC20(albtToken), paymentReceiverA, amountA);
            } else {
                SafeERC20.safeTransferFrom(IERC20(albtToken), from, paymentReceiverA, amountA);
            }
        }

        if (amountB > 0) {
            if (from == address(this)) {
                SafeERC20.safeTransfer(IERC20(albtToken), paymentReceiverB, amountB);
            } else {
                SafeERC20.safeTransferFrom(IERC20(albtToken), from, paymentReceiverB, amountB);
            }
        }
    }

    // Calculate the amount of ALBT you will get for an amount of USDT
    function calculateUSDTtoALBT(uint256 usdtAmount) internal view returns (uint256 albtAmount) {
        (uint256 usdtReserve, uint256 albtReserve, ) = IUniswapV2Pair(uniswapPair).getReserves();

        require(usdtAmount > 0, 'Insufficient USDT amount');
        require(albtReserve > 0 && usdtReserve > 0, 'Insufficient liquidity');

        albtAmount = albtReserve.mul(usdtAmount).div(usdtReserve);
    }
}
