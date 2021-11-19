// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';
import './PercentageCalculator.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract LockScheme is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    uint256 public immutable lockPeriod; // The period of blocks that the stake is locked for this contract
    uint256 public immutable rampUpPeriod; // The period since the beginning of the lock that additions can be considered the same position.Might be 0 for the 0% lock periods
    uint256 public immutable bonusPercent; // saved in thousands = ex 3% = 3000
    address public immutable lmcContract; // The address of the lmc contract
    uint256 public forfeitedBonuses;
    uint256 public immutable virtualBlockTime;

    struct UserInfo {
        uint256 balance; // IOU Balance for this lock contract
        uint256 accruedReward; // Reward accrued by an address from previous additions
        uint256 lockInitialStakeBlock;
    }

    mapping(address => UserInfo) public userInfo;

    event Lock(address indexed _userAddress, uint256 _amountLocked, uint256 _additionalReward);
    event Exit(address indexed _userAddress, uint256 bonus, bool isBonusForreied);

    modifier onlyLmc() {
        require(msg.sender == lmcContract, 'onlyLmc::Caller is not the LMC contract');
        _;
    }

    constructor(
        uint256 _lockPeriod,
        uint256 _rampUpPeriod,
        uint256 _bonusPercent,
        address _lmcContract,
        uint256 _virtualBLockTime
    ) {
        require(_lmcContract != address(0x0), 'constructor:: Invalid LMC address');
        require(_rampUpPeriod <= _lockPeriod, 'constructor:: Periods are not properly set');
        require(_virtualBLockTime != 0, 'constructor::VirtualBlockTime should be greater than zero');
        lockPeriod = _lockPeriod;
        rampUpPeriod = _rampUpPeriod;
        bonusPercent = _bonusPercent;
        lmcContract = _lmcContract;
        virtualBlockTime = _virtualBLockTime;
    }

    /** @dev Locks the tokens into the current scheme, and updates user information
	@param _userAddress address of the staker
	@param _amountToLock the amount to be locked
	 */
    function lock(address _userAddress, uint256 _amountToLock) public onlyLmc {
        UserInfo storage user = userInfo[_userAddress];

        if (user.lockInitialStakeBlock == 0) {
            user.lockInitialStakeBlock = _getBlock();
        }

        uint256 userLockStartBlock = user.lockInitialStakeBlock + rampUpPeriod;

        require(userLockStartBlock > _getBlock(), 'lock::The ramp up period has finished');

        user.balance = user.balance.add(_amountToLock);

        emit Lock(_userAddress, _amountToLock, user.accruedReward);
    }

    /** @dev Exits the current lock scheme, calculates the bonus, updates user information
	@param _userAddress address of the user
	@return bonus the bonus of the user
	 */
    function exit(address _userAddress) public onlyLmc returns (uint256 bonus) {
        bool isBonusForfeited = false;
        UserInfo storage user = userInfo[_userAddress];
        if (user.balance == 0) {
            return 0;
        }
        bonus = PercentageCalculator.percentageCalc(user.accruedReward, bonusPercent);
        uint256 userLockEnd = user.lockInitialStakeBlock.add(lockPeriod);

        if (_getBlock() < userLockEnd) {
            forfeitedBonuses = forfeitedBonuses.add(bonus);
            bonus = 0;
            isBonusForfeited = true;
        }

        user.accruedReward = 0;
        user.balance = 0;
        user.lockInitialStakeBlock = 0;

        emit Exit(_userAddress, bonus, isBonusForfeited);

        return bonus;
    }

    /** @dev Updates the accrued rewards of the user
	@param _userAddress address of the user
	@param _rewards the rewards that will be added
	 */
    function updateUserAccruedRewards(address _userAddress, uint256 _rewards) public nonReentrant onlyLmc {
        UserInfo storage user = userInfo[_userAddress];
        if (user.balance > 0) {
            user.accruedReward = user.accruedReward.add(_rewards);
        }
    }

    function getUserBonus(address _userAddress) public view returns (uint256 bonus) {
        UserInfo storage user = userInfo[_userAddress];
        uint256 userLockEnd = user.lockInitialStakeBlock.add(lockPeriod);

        if (_getBlock() < userLockEnd) {
            return 0;
        }

        return PercentageCalculator.percentageCalc(user.accruedReward, bonusPercent);
    }

    function getUserAccruedReward(address _userAddress) public view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.accruedReward;
    }

    function getUserLockedStake(address _userAddress) public view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.balance;
    }

    /** @dev Returns whether the rampup period for a given user has ended
	@param _userAddress address of the user
	@return has the rapm up period has ended or not
	 */
    function hasUserRampUpEnded(address _userAddress) public view returns (bool) {
        UserInfo storage user = userInfo[_userAddress];
        uint256 userLockStartBlock = user.lockInitialStakeBlock + rampUpPeriod;
        return userLockStartBlock < _getBlock();
    }

    function _getBlock() public view virtual returns (uint256) {
        return (block.timestamp.div(virtualBlockTime));
    }
}
