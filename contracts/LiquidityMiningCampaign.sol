// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';
import './RewardsPoolBase.sol';
import './LockScheme.sol';
import './StakeTransferer.sol';
import './StakeReceiver.sol';
import './pool-features/OnlyExitFeature.sol';

contract LiquidityMiningCampaign is StakeTransferer, OnlyExitFeature {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    address public immutable rewardToken;
    address[] public lockSchemes;
    mapping(address => uint256) public userAccruedRewards;
    mapping(address => bool) public lockSchemesExist;

    event StakedAndLocked(address indexed _userAddress, uint256 _tokenAmount, address _lockScheme);
    event ExitedAndUnlocked(address indexed _userAddress);
    event BonusTransferred(address indexed _userAddress, uint256 _bonusAmount);

    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startTimeStamp,
        uint256 _endTimeStamp,
        address[] memory _rewardsTokens,
        uint256[] memory _rewardPerBlock,
        address _albtAddress,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime
    )
        RewardsPoolBase(
            _stakingToken,
            _startTimeStamp,
            _endTimeStamp,
            _rewardsTokens,
            _rewardPerBlock,
            _stakeLimit,
            _contractStakeLimit,
            _virtualBlockTime
        )
    {
        require(_albtAddress == _rewardsTokens[0], 'constructor:: The first reward address is different from the ALBT');
        rewardToken = _rewardsTokens[0];
    }

    function stakeAndLock(uint256 _tokenAmount, address _lockScheme) external nonReentrant {
        _stakeAndLock(msg.sender, _tokenAmount, _lockScheme);
    }

    /** @dev Stakes LP tokens to the campaing and lockes them to a specific lockScheme contract to earn bonuses
	@param _userAddress the address of the staker
	@param _tokenAmount the amount to be staked
	@param _lockScheme the address of the lock scheme 
	 */
    function _stakeAndLock(
        address _userAddress,
        uint256 _tokenAmount,
        address _lockScheme
    ) internal {
        require(_userAddress != address(0x0), '_stakeAndLock::Invalid staker');
        require(_tokenAmount > 0, 'stakeAndLock::Cannot stake 0');

        UserInfo storage user = userInfo[_userAddress];

        uint256 userRewards = 0;

        updateRewardMultipliers();
        updateUserAccruedReward(_userAddress);

        userRewards = user.tokensOwed[0];
        uint256 lockSchemesLenght = lockSchemes.length;

        for (uint256 i = 0; i < lockSchemesLenght; i++) {
            uint256 additionalRewards = calculateProportionalRewards(
                _userAddress,
                userRewards.sub(userAccruedRewards[_userAddress]),
                lockSchemes[i]
            );
            LockScheme(lockSchemes[i]).updateUserAccruedRewards(_userAddress, additionalRewards);
        }
        userAccruedRewards[_userAddress] = userRewards;
        _stake(_tokenAmount, _userAddress, true);

        LockScheme(_lockScheme).lock(_userAddress, _tokenAmount);

        emit StakedAndLocked(_userAddress, _tokenAmount, _lockScheme);
    }

    function exitAndUnlock() public nonReentrant {
        _exitAndUnlock(msg.sender);
    }

    /** @dev Exits the current campaing and claims the bonuses
	@param _userAddress the address of the staker
	 */
    function _exitAndUnlock(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        if (user.amountStaked == 0) {
            return;
        }

        updateRewardMultipliers();
        updateUserAccruedReward(_userAddress);

        uint256 finalRewards = user.tokensOwed[0].sub(userAccruedRewards[_userAddress]);
        uint256 lockSchemesLenght = lockSchemes.length;

        for (uint256 i = 0; i < lockSchemesLenght; i++) {
            uint256 additionalRewards = calculateProportionalRewards(_userAddress, finalRewards, lockSchemes[i]);

            if (additionalRewards > 0) {
                LockScheme(lockSchemes[i]).updateUserAccruedRewards(_userAddress, additionalRewards);
            }

            uint256 bonus = LockScheme(lockSchemes[i]).exit(_userAddress);
            IERC20Detailed(rewardToken).safeTransfer(_userAddress, bonus);
        }

        _exit(_userAddress);
        userAccruedRewards[_userAddress] = 0;

        emit ExitedAndUnlocked(_userAddress);
    }

    function setReceiverWhitelisted(address receiver, bool whitelisted) public override(StakeTransferer) onlyFactory {
        StakeTransferer.setReceiverWhitelisted(receiver, whitelisted);
    }

    function exitAndStake(address _stakePool) external nonReentrant {
        _exitAndStake(msg.sender, _stakePool);
    }

    /** @dev Exits the current campaing, claims the bonus and stake all rewards to ALBT staking contract
	@param _userAddress the address of the staker
	@param _stakePool the address of the pool where the tokens will be staked
	 */
    function _exitAndStake(address _userAddress, address _stakePool) internal onlyWhitelistedReceiver(_stakePool) {
        UserInfo storage user = userInfo[_userAddress];

        if (user.amountStaked == 0) {
            return;
        }

        updateRewardMultipliers();
        updateUserAccruedReward(_userAddress);

        uint256 finalRewards = user.tokensOwed[0].sub(userAccruedRewards[_userAddress]);
        uint256 lockSchemesLenght = lockSchemes.length;

        userAccruedRewards[_userAddress] = 0;
        uint256 userBonus;
        uint256 amountToStake;
        for (uint256 i = 0; i < lockSchemesLenght; i++) {
            uint256 additionalRewards = calculateProportionalRewards(_userAddress, finalRewards, lockSchemes[i]);
            if (additionalRewards > 0) {
                LockScheme(lockSchemes[i]).updateUserAccruedRewards(_userAddress, additionalRewards);
            }
            userBonus = LockScheme(lockSchemes[i]).exit(_userAddress);
            amountToStake = amountToStake.add(userBonus);
        }

        amountToStake = amountToStake.add(user.tokensOwed[0]);
        _withdraw(user.amountStaked, _userAddress);
        user.tokensOwed[0] = 0;
        _claim(_userAddress);

        IERC20Detailed(rewardToken).safeApprove(_stakePool, amountToStake);
        StakeReceiver(_stakePool).delegateStake(_userAddress, amountToStake);
    }

    /** @dev Function calculating the proportional rewards between all lock schemes where the user has locked tokens
	@param _userAddress the address of the staker
	@param _accruedRewards all unAccruedRewards that needs to be split
	@param _lockScheme the address of the lock scheme
	 */
    function calculateProportionalRewards(
        address _userAddress,
        uint256 _accruedRewards,
        address _lockScheme
    ) internal view returns (uint256) {
        if (totalStaked == 0) {
            return 0;
        }

        uint256 userLockedStake = LockScheme(_lockScheme).getUserLockedStake(_userAddress);
        return _accruedRewards.mul(userLockedStake).div(totalStaked);
    }

    function exit() public override {
        _exitAndUnlock(msg.sender);
    }

    function stake(uint256 _tokenAmount) public override {
        revert('LiquidityMiningCampaign::staking without locking is forbidden');
    }

    function exitAndTransfer(address transferTo) public override {
        revert('LiquidityMiningCampaign::exit and transfer is forbidden');
    }

    /** @dev Sets all schemes that are part of the current LMC
	@param _lockSchemes the address of the staker
	 */
    function setLockSchemes(address[] memory _lockSchemes) external onlyFactory {
        for (uint256 i = 0; i < _lockSchemes.length; i++) {
            if (!lockSchemesExist[_lockSchemes[i]]) {
                lockSchemes.push(_lockSchemes[i]);
                lockSchemesExist[_lockSchemes[i]] = true;
            }
        }
    }
}
