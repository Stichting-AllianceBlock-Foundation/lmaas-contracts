// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import './../interfaces/IERC20Detailed.sol';
import './../interfaces/ITreasuryOperated.sol';
import './../interfaces/IRewardsPoolBase.sol';
import './../SafeERC20Detailed.sol';
import './../interfaces/IUniswapV2Router.sol';

contract Treasury is Ownable {
    using SafeERC20Detailed for IERC20Detailed;

    address public immutable externalRewardToken;

    mapping(address => uint256) public liquidityDrawn;
    IUniswapV2Router public immutable uniswapRouter;

    constructor(address _uniswapRouter, address _externalRewardToken) {
        require(_uniswapRouter != address(0x0), 'Treasury:: Uniswap router cannot be 0');
        require(_externalRewardToken != address(0x0), 'Treasury:: External reward token not set');
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        externalRewardToken = _externalRewardToken;
    }

    function withdrawLiquidity(address[] calldata rewardPools, uint256[] calldata amounts) external onlyOwner {
        require(rewardPools.length == amounts.length, 'withdrawLiquidity:: pools and amounts do not match');
        for (uint256 i = 0; i < rewardPools.length; i++) {
            liquidityDrawn[rewardPools[i]] = liquidityDrawn[rewardPools[i]] + amounts[i];
            ITreasuryOperated(rewardPools[i]).withdrawStake(amounts[i]);
        }
    }

    function returnLiquidity(address[] calldata rewardPools, uint256[] calldata externalRewards) external onlyOwner {
        require(
            rewardPools.length == externalRewards.length,
            'returnLiquidity:: pools and external tokens do not match'
        );
        for (uint256 i = 0; i < rewardPools.length; i++) {
            address stakingToken = IRewardsPoolBase(rewardPools[i]).stakingToken();

            uint256 drawnLiquidity = liquidityDrawn[rewardPools[i]];
            liquidityDrawn[rewardPools[i]] = 0;
            IERC20Detailed(stakingToken).safeTransfer(rewardPools[i], drawnLiquidity);

            if (externalRewards[i] == 0) {
                continue;
            }
            IERC20Detailed(externalRewardToken).safeApprove(rewardPools[i], externalRewards[i]);
            ITreasuryOperated(rewardPools[i]).notifyExternalReward(externalRewards[i]);
        }
    }

    function addUniswapLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256 deadline
    )
        external
        onlyOwner
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        IERC20Detailed(tokenA).safeApprove(address(uniswapRouter), amountADesired);
        IERC20Detailed(tokenB).safeApprove(address(uniswapRouter), amountBDesired);
        return
            uniswapRouter.addLiquidity(
                tokenA,
                tokenB,
                amountADesired,
                amountBDesired,
                amountAMin,
                amountBMin,
                address(this),
                deadline
            );
    }

    function removeUniswapLiquidity(
        address tokenA,
        address tokenB,
        address lpToken,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256 deadline
    ) external onlyOwner returns (uint256 amountA, uint256 amountB) {
        IERC20Detailed(lpToken).safeApprove(address(uniswapRouter), liquidity);
        return
            uniswapRouter.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, address(this), deadline);
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20Detailed(token).safeTransfer(msg.sender, amount);
    }
}
