// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../interfaces/IUniswapV2Router.sol';
import './../SafeERC20Detailed.sol';
import './../interfaces/IERC20Detailed.sol';
import './../TestERC20.sol';

contract UniswapV2RouterMock is IUniswapV2Router {
    using SafeERC20Detailed for IERC20Detailed;

    address public lpToken;

    constructor() {
        lpToken = address(new TestERC20(type(uint256).max));
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256, // amountAMin,
        uint256, // amountBMin,
        address, // to,
        uint256 // deadline
    )
        external
        override
        returns (
            uint256, // amountA,
            uint256, // amountB,
            uint256 // liquidity
        )
    {
        IERC20Detailed(tokenA).safeTransferFrom(msg.sender, address(this), amountADesired);
        IERC20Detailed(tokenB).safeTransferFrom(msg.sender, address(this), amountBDesired);
        IERC20Detailed(lpToken).safeTransfer(msg.sender, 10**18);

        return (0, 0, 0);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address, // to,
        uint256 // deadline
    ) external override returns (uint256 amountA, uint256 amountB) {
        IERC20Detailed(lpToken).safeTransferFrom(msg.sender, address(this), liquidity);
        IERC20Detailed(tokenA).safeTransfer(msg.sender, amountAMin);
        IERC20Detailed(tokenB).safeTransfer(msg.sender, amountBMin);

        return (0, 0);
    }
}
