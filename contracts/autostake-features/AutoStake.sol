// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './../interfaces/IRewardsPoolBase.sol';
import './../StakeLock.sol';
import './../ThrottledExit.sol';

/** @dev Automatically restakes/compounds your rewards.
    Based on ideas here: https://github.com/harvest-finance/harvest/blob/7a455967e40e980d4cfb2115bd000fbd6b201cc1/contracts/AutoStake.sol
 */
contract AutoStake is StakeLock, ThrottledExit, Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant UNIT = 1 ether;

    IRewardsPoolBase public rewardPool;
    IERC20 public immutable stakingToken;
    address public immutable factory;
    uint256 public valuePerShare = UNIT;
    uint256 public totalShares;
    uint256 public totalValue;
    uint256 public exitStake;
    mapping(address => uint256) public share;

    uint256 public immutable contractStakeLimit;
    uint256 public totalAmountStaked;
    mapping(address => uint256) public userStakedAmount;

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
        uint256 _throttleRoundCap,
        uint256 _contractStakeLimit
    ) {
        require(_contractStakeLimit != 0, 'AutoStake: contract stake limit should not be 0');

        factory = msg.sender;
        stakingToken = IERC20(token);
        contractStakeLimit = _contractStakeLimit;
        setThrottleParams(_throttleRoundSeconds, _throttleRoundCap);
    }

    function onlyUnderContractStakeLimit(uint256 _stakeAmount) public view {
        require(totalAmountStaked + _stakeAmount <= contractStakeLimit, 'AutoStake: Only under contract stake limit');
    }

    function start(uint256 _endTimestamp) external virtual onlyOwner {
        require(rewardPool.endTimestamp() == _endTimestamp, 'AutoStake: End timestamp is not the same as rewards pool');
        startThrottle(_endTimestamp);
        lock(_endTimestamp);
    }

    /** @dev Sets the underlying reward pool. Can only be set once.
     * @param _pool The reward pool
     */
    function setPool(address _pool) external onlyOwner {
        require(address(rewardPool) == address(0), 'AutoStake: Reward pool already set');
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
    function stake(uint256 _tokenAmount) public virtual {
        onlyUnderContractStakeLimit(_tokenAmount);
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

        userStakedAmount[_staker] += _amount;
        totalAmountStaked += _amount;

        uint256 sharesToIssue = (_amount * UNIT) / valuePerShare;
        totalShares += sharesToIssue;
        share[_staker] += sharesToIssue;

        uint256 oldValuePerShare = valuePerShare;

        // Rate needs to be updated here, otherwise the valuePerShare would be incorrect.
        updateValuePerShare();

        emit Staked(_staker, _amount, sharesToIssue, oldValuePerShare, valuePerShare, balanceOf(_staker));

        restakeIntoRewardPool();
    }

    /// @dev Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.
    function exit() external virtual onlyUnlocked {
        exitRewardPool();
        updateValuePerShare();

        uint256 userStake = balanceOf(msg.sender);

        if (userStake == 0) {
            return;
        }

        totalShares -= share[msg.sender];
        totalAmountStaked -= userStakedAmount[msg.sender];
        share[msg.sender] = 0;
        userStakedAmount[msg.sender] = 0;
        exitStake += userStake;

        // now we can transfer funds and burn shares
        initiateExit(userStake, new uint256[](0));

        updateValuePerShare();
    }

    /// @dev Completes the throttled exit from the pool.
    function completeExit() external virtual onlyUnlocked {
        ExitInfo storage info = exitInfo[msg.sender];
        exitStake -= info.exitStake;

        finalizeExit(address(stakingToken), new address[](0), address(0));

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

            stakingToken.approve(address(rewardPool), balanceToRestake);
            rewardPool.stake(balanceToRestake);
        }
    }

    function getUserAccumulatedRewards(address who) public view returns (uint256) {
        uint256 balance = balanceOf(who);
        if (userStakedAmount[who] > balance) {
            return 0;
        }
        return balance - userStakedAmount[who];
    }
}
