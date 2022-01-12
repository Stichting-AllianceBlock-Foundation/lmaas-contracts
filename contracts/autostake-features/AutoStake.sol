// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './../interfaces/IRewardsPoolBase.sol';
import './../interfaces/IERC20Detailed.sol';
import './../SafeERC20Detailed.sol';
import './../StakeLock.sol';
import './../ThrottledExit.sol';

// Based on ideas here: https://github.com/harvest-finance/harvest/blob/7a455967e40e980d4cfb2115bd000fbd6b201cc1/contracts/AutoStake.sol

contract AutoStake is ReentrancyGuard, StakeLock, ThrottledExit, Ownable {
    using SafeERC20Detailed for IERC20Detailed;

    uint256 public constant UNIT = 1 ether;

    IRewardsPoolBase public rewardPool;
    IERC20Detailed public immutable stakingToken;
    address public immutable factory;
    uint256 public valuePerShare = UNIT;
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
        uint256 _throttleRoundSeconds,
        uint256 _throttleRoundCap
    ) {
        factory = msg.sender;
        stakingToken = IERC20Detailed(token);
        setThrottleParams(_throttleRoundSeconds, _throttleRoundCap);
    }

    function start(uint256 _endTimestamp) external virtual onlyOwner {
        require(rewardPool.endTimestamp() == _endTimestamp, 'End timestamp is not the same as rewards pool');
        startThrottle(_endTimestamp);
        lock(_endTimestamp);
    }

    /** @dev Sets the underlying reward pool. Can only be set once.
     * @param _pool The reward pool
     */
    function setPool(address _pool) external onlyOwner {
        require(address(rewardPool) == address(0), 'Reward pool already set');
        rewardPool = IRewardsPoolBase(_pool);
    }

    function name() external view returns (string memory) {
        return rewardPool.name();
    }

    function refreshAutoStake() external {
        exitRewardPool();
        updateValuePerShare();
        restakeIntoRewardPool();
    }

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual nonReentrant {
        _stake(_tokenAmount, msg.sender, true);
    }

    function _stake(
        uint256 _amount,
        address _staker,
        bool _chargeStaker
    ) internal {
        exitRewardPool();
        updateValuePerShare();

        // now we can issue shares
        stakingToken.safeTransferFrom(_chargeStaker ? _staker : msg.sender, address(this), _amount);
        uint256 sharesToIssue = (_amount * UNIT) / valuePerShare;
        totalShares = totalShares + sharesToIssue;
        share[_staker] = share[_staker] + sharesToIssue;

        uint256 oldValuePerShare = valuePerShare;

        // Rate needs to be updated here, otherwise the valuePerShare would be incorrect.
        updateValuePerShare();

        emit Staked(_staker, _amount, sharesToIssue, oldValuePerShare, valuePerShare, balanceOf(_staker));

        restakeIntoRewardPool();
    }

    /// @dev Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.
    function exit() external virtual onlyUnlocked nonReentrant {
        exitRewardPool();
        updateValuePerShare();

        uint256 userStake = balanceOf(msg.sender);

        if (userStake == 0) {
            return;
        }

        // now we can transfer funds and burn shares
        initiateExit(userStake, 0, new uint256[](0));

        totalShares = totalShares - share[msg.sender];
        share[msg.sender] = 0;
        exitStake = exitStake + userStake;

        updateValuePerShare();
    }

    /// @dev Completes the throttled exit from the pool.
    function completeExit() external virtual onlyUnlocked nonReentrant {
        ExitInfo storage info = exitInfo[msg.sender];
        exitStake = exitStake - info.exitStake;

        finalizeExit(address(stakingToken), new address[](0));

        updateValuePerShare();
    }

    function balanceOf(address _staker) public view returns (uint256) {
        return (valuePerShare * share[_staker]) / UNIT;
    }

    function updateValuePerShare() internal {
        if (totalShares == 0) {
            totalValue = 0;
            valuePerShare = UNIT;
            return;
        }
        totalValue = stakingToken.balanceOf(address(this)) - exitStake;
        valuePerShare = (totalValue * UNIT) / totalShares;
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

            uint256 balanceToRestake = stakingToken.balanceOf(address(this)) - exitStake;

            stakingToken.safeApprove(address(rewardPool), 0);
            stakingToken.safeApprove(address(rewardPool), balanceToRestake);
            rewardPool.stake(balanceToRestake);
        }
    }
}
