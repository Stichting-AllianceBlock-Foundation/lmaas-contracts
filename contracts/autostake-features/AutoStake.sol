// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './../interfaces/IRewardsPoolBase.sol';
import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './../StakeLock.sol';
import './../ThrottledExit.sol';

// Based on ideas here: https://github.com/harvest-finance/harvest/blob/7a455967e40e980d4cfb2115bd000fbd6b201cc1/contracts/AutoStake.sol

contract AutoStake is ReentrancyGuard, StakeLock, ThrottledExit, Ownable {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    IRewardsPoolBase public rewardPool;
    IERC20Detailed public immutable stakingToken;
    address public immutable factory;
    uint256 public constant unit = 1e18;
    uint256 public valuePerShare = unit;
    uint256 public totalShares;
    uint256 public totalValue;
    uint256 public exitStake;
    mapping(address => uint256) public share;

    event Staked(
        address indexed user,
        uint256 amount,
        uint256 sharesIssued,
        uint256 oldShareVaule,
        uint256 newShareValue,
        uint256 balanceOf
    );

    constructor(
        address token,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 stakeEnd,
        uint256 _virtualBlockTime
    ) StakeLock(stakeEnd) {
        factory = msg.sender;
        stakingToken = IERC20Detailed(token);
        setThrottleParams(_throttleRoundBlocks, _throttleRoundCap, stakeEnd, _virtualBlockTime);
    }

    function setPool(address pool) public onlyOwner {
        require(address(rewardPool) == address(0), 'Reward pool already set');
        rewardPool = IRewardsPoolBase(pool);
    }

    function refreshAutoStake() external {
        exitRewardPool();
        updateValuePerShare();
        restakeIntoRewardPool();
    }

    function stake(uint256 amount) public virtual {
        _stake(amount, msg.sender, true);
    }

    function _stake(
        uint256 amount,
        address staker,
        bool chargeStaker
    ) internal nonReentrant {
        exitRewardPool();
        updateValuePerShare();

        // now we can issue shares
        stakingToken.safeTransferFrom(chargeStaker ? staker : msg.sender, address(this), amount);
        uint256 sharesToIssue = amount.mul(unit).div(valuePerShare);
        totalShares = totalShares.add(sharesToIssue);
        share[staker] = share[staker].add(sharesToIssue);

        uint256 oldValuePerShare = valuePerShare;

        // Rate needs to be updated here, otherwise the valuePerShare would be incorrect.
        updateValuePerShare();

        emit Staked(staker, amount, sharesToIssue, oldValuePerShare, valuePerShare, balanceOf(staker));

        restakeIntoRewardPool();
    }

    function exit() public virtual onlyUnlocked nonReentrant {
        exitRewardPool();
        updateValuePerShare();

        uint256 userStake = balanceOf(msg.sender);

        if (userStake == 0) {
            return;
        }

        // now we can transfer funds and burn shares
        initiateExit(userStake, 0, new uint256[](0));

        totalShares = totalShares.sub(share[msg.sender]);
        share[msg.sender] = 0;
        exitStake = exitStake.add(userStake);

        updateValuePerShare();
    }

    function completeExit() public virtual onlyUnlocked nonReentrant {
        ExitInfo storage info = exitInfo[msg.sender];
        exitStake = exitStake.sub(info.exitStake);

        finalizeExit(address(stakingToken), new address[](0));

        updateValuePerShare();
    }

    function balanceOf(address who) public view returns (uint256) {
        return valuePerShare.mul(share[who]).div(unit);
    }

    function updateValuePerShare() internal {
        if (totalShares == 0) {
            totalValue = 0;
            valuePerShare = unit;
            return;
        }
        totalValue = stakingToken.balanceOf(address(this)).sub(exitStake);
        valuePerShare = totalValue.mul(unit).div(totalShares);
    }

    function exitRewardPool() internal {
        if (rewardPool.balanceOf(address(this)) != 0) {
            // exit and do accounting first
            rewardPool.exit();
        }
    }

    function restakeIntoRewardPool() internal {
        if (stakingToken.balanceOf(address(this)) != 0) {
            // stake back to the pool

            uint256 balanceToRestake = stakingToken.balanceOf(address(this)).sub(exitStake);

            stakingToken.safeApprove(address(rewardPool), 0);
            stakingToken.safeApprove(address(rewardPool), balanceToRestake);
            rewardPool.stake(balanceToRestake);
        }
    }
}
