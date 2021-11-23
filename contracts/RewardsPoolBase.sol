// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';

contract RewardsPoolBase is ReentrancyGuard, Ownable {
    using SafeERC20Detailed for IERC20Detailed;

    uint256 public totalStaked;
    uint256[] public totalClaimed;
    uint256[] public totalSpentRewards;
    uint256[] public rewardPerBlock;
    address[] public rewardsTokens;
    IERC20Detailed public stakingToken;
    uint256 public startTimestamp;
    uint256 public endTimestamp;
    uint256 public startBlock;
    uint256 public endBlock;
    uint256 public lastRewardBlock;
    uint256[] public accumulatedRewardMultiplier;
    address public rewardsPoolFactory;
    uint256 public stakeLimit;
    uint256 public contractStakeLimit;
    uint256 private virtualBlockTime;

    struct UserInfo {
        uint256 firstStakedBlockNumber;
        uint256 amountStaked; // How many tokens the user has staked.
        uint256[] rewardDebt; //
        uint256[] tokensOwed; // How many tokens the contract owes to the user.
    }

    mapping(address => UserInfo) public userInfo;

    event Started();
    event Staked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount, address token);
    event Withdrawn(address indexed user, uint256 amount);
    event Exited(address indexed user, uint256 amount);
    event Extended(uint256 newEndBlock, uint256[] newRewardsPerBlock);
    event WithdrawLPRewards(uint256 indexed rewardsAmount, address indexed recipient);

    constructor(
        IERC20Detailed _stakingToken,
        address[] memory _rewardsTokens,
        uint256[] memory _rewardPerBlock,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime
    ) {
        require(address(_stakingToken) != address(0), 'Constructor::Invalid staking token address');

        require(
            _rewardPerBlock.length == _rewardsTokens.length,
            'Constructor::Rewards per block and rewards tokens must be with the same length.'
        );
        require(_stakeLimit != 0, 'Constructor::Stake limit needs to be more than 0');
        require(_contractStakeLimit != 0, 'Constructor:: Contract Stake limit needs to be more than 0');
        require(_virtualBlockTime != 0, 'Constructor:: Virtual block time should be greater than 0');

        stakingToken = _stakingToken;
        rewardPerBlock = _rewardPerBlock;
        rewardsTokens = _rewardsTokens;
        lastRewardBlock = startBlock;
        rewardsPoolFactory = msg.sender;
        stakeLimit = _stakeLimit;
        contractStakeLimit = _contractStakeLimit;
        virtualBlockTime = _virtualBlockTime * 1 seconds;

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            accumulatedRewardMultiplier.push(0);
            totalClaimed.push(0);
            totalSpentRewards.push(0);
        }
    }

    modifier onlyInsideBlockBounds() {
        uint256 currentBlock = _getBlock();
        require(startBlock > 0 && currentBlock > startBlock, 'Stake::Staking has not yet started');
        require(currentBlock <= endBlock, 'Stake::Staking has finished');
        _;
    }

    modifier onlyUnderStakeLimit(address staker, uint256 newStake) {
        UserInfo storage user = userInfo[staker];
        require(user.amountStaked + newStake <= stakeLimit, 'onlyUnderStakeLimit::Stake limit reached');
        require(totalStaked + newStake <= contractStakeLimit, 'onlyUnderStakeLimit::Contract Stake limit reached');
        _;
    }

    function start(uint256 _startTimestamp, uint256 _endTimestamp) public onlyOwner {
        require(startTimestamp == 0, 'start::Pool is already started');

        require(_startTimestamp > block.timestamp, 'start::The starting timestamp must be in the future.');
        require(_endTimestamp > _startTimestamp, 'start::The end timestamp must be bigger then the start timestamp.');

        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            uint256 rewardsAmount = calculateRewardsAmount(_startTimestamp, _endTimestamp, rewardPerBlock[i]);

            uint256 balance = IERC20Detailed(rewardsTokens[i]).balanceOf(address(this));

            require(balance >= rewardsAmount, 'Start::Rewards pool does not have enough rewards');
        }

        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;

        startBlock = _calculateBlocks(startTimestamp);
        endBlock = _calculateBlocks(endTimestamp);

        emit Started();
    }

    /** @dev Providing LP tokens to stake, update rewards.
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public virtual nonReentrant {
        _stake(_tokenAmount, msg.sender, true);
    }

    /** @dev Providing LP tokens to stake, update rewards.
     * @param _tokenAmount The amount to be staked
     * @param staker The staker to be associated with the stake
     * @param chargeStaker Whether to draw from the staker or from the msg.sender
     */
    function _stake(
        uint256 _tokenAmount,
        address staker,
        bool chargeStaker
    ) internal onlyInsideBlockBounds onlyUnderStakeLimit(staker, _tokenAmount) {
        require(_tokenAmount > 0, 'Stake::Cannot stake 0');

        UserInfo storage user = userInfo[staker];

        // if no amount has been staked this is considered the initial stake
        if (user.amountStaked == 0) {
            user.firstStakedBlockNumber = _getBlock();
        }

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(staker); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked + _tokenAmount;
        totalStaked = totalStaked + _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 tokenDecimals = IERC20Detailed(rewardsTokens[i]).decimals();
            uint256 tokenMultiplier = 10**tokenDecimals;

            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[i]) / tokenMultiplier; // Update user reward debt for each token
            user.rewardDebt[i] = totalDebt;
        }

        stakingToken.safeTransferFrom(address(chargeStaker ? staker : msg.sender), address(this), _tokenAmount);

        emit Staked(staker, _tokenAmount);
    }

    /** @dev Claiming accrued rewards.
     */
    function claim() public virtual nonReentrant {
        _claim(msg.sender);
    }

    function _claim(address claimer) internal {
        UserInfo storage user = userInfo[claimer];
        updateRewardMultipliers();
        updateUserAccruedReward(claimer);

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 reward = user.tokensOwed[i];
            user.tokensOwed[i] = 0;

            IERC20Detailed(rewardsTokens[i]).safeTransfer(claimer, reward);
            totalClaimed[i] = totalClaimed[i] + reward;

            emit Claimed(claimer, reward, rewardsTokens[i]);
        }
    }

    /** @dev Withdrawing portion of staked tokens.
     * @param _tokenAmount The amount to be withdrawn
     */
    function withdraw(uint256 _tokenAmount) public virtual nonReentrant {
        _withdraw(_tokenAmount, msg.sender);
    }

    function _withdraw(uint256 _tokenAmount, address withdrawer) internal {
        require(_tokenAmount > 0, 'Withdraw::Cannot withdraw 0');

        UserInfo storage user = userInfo[withdrawer];

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(withdrawer); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked - _tokenAmount;
        totalStaked = totalStaked - _tokenAmount;

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 tokenDecimals = IERC20Detailed(rewardsTokens[i]).decimals();
            uint256 tokenMultiplier = 10**tokenDecimals;
            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[i]) / tokenMultiplier; // Update user reward debt for each token
            user.rewardDebt[i] = totalDebt;
        }

        stakingToken.safeTransfer(address(withdrawer), _tokenAmount);

        emit Withdrawn(withdrawer, _tokenAmount);
    }

    /** @dev Claiming all rewards and withdrawing all staked tokens. Exits from the rewards pool
     */
    function exit() public virtual nonReentrant {
        _exit(msg.sender);
    }

    function _exit(address exiter) internal {
        UserInfo storage user = userInfo[exiter];
        _claim(exiter);
        _withdraw(user.amountStaked, exiter);

        emit Exited(exiter, user.amountStaked);
    }

    /** @dev Returns the amount of tokens the user has staked
     */
    function balanceOf(address _userAddress) public view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.amountStaked;
    }

    /**
		@dev updates the accumulated reward multipliers for everyone and each token
	 */
    function updateRewardMultipliers() public {
        uint256 currentBlock = _getBlock();

        if (currentBlock <= lastRewardBlock) {
            return;
        }

        uint256 applicableBlock = (currentBlock < endBlock) ? currentBlock : endBlock;

        uint256 blocksSinceLastReward = applicableBlock - lastRewardBlock;

        if (blocksSinceLastReward == 0) {
            // Nothing to update
            return;
        }

        if (totalStaked == 0) {
            lastRewardBlock = applicableBlock;
            return;
        }

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 tokenDecimals = IERC20Detailed(rewardsTokens[i]).decimals();
            uint256 tokenMultiplier = 10**tokenDecimals;

            uint256 newReward = blocksSinceLastReward * rewardPerBlock[i]; // Get newly accumulated reward
            uint256 rewardMultiplierIncrease = (newReward * tokenMultiplier) / totalStaked; // Calculate the multiplier increase
            accumulatedRewardMultiplier[i] = accumulatedRewardMultiplier[i] + rewardMultiplierIncrease; // Add the multiplier increase to the accumulated multiplier
        }
        lastRewardBlock = applicableBlock;
    }

    /**
		@dev updates the accumulated reward for the user with the _userAddress address
		@param _userAddress the address of the updated user
	 */
    function updateUserAccruedReward(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        uint256 rewardsTokensLength = rewardsTokens.length;

        if (user.rewardDebt.length == 0) {
            // Initialize user struct

            for (uint256 i = 0; i < rewardsTokensLength; i++) {
                user.rewardDebt.push(0);
                user.tokensOwed.push(0);
            }
        }

        if (user.amountStaked == 0) {
            return;
        }

        for (uint256 tokenIndex = 0; tokenIndex < rewardsTokensLength; tokenIndex++) {
            uint256 tokenDecimals = IERC20Detailed(rewardsTokens[tokenIndex]).decimals();
            uint256 tokenMultiplier = 10**tokenDecimals;

            uint256 totalDebt = (user.amountStaked * accumulatedRewardMultiplier[tokenIndex]) / tokenMultiplier;
            uint256 pendingDebt = totalDebt - user.rewardDebt[tokenIndex];

            if (pendingDebt > 0) {
                user.tokensOwed[tokenIndex] = user.tokensOwed[tokenIndex] + pendingDebt;
                user.rewardDebt[tokenIndex] = totalDebt;
            }
        }
    }

    function _getBlock() internal view virtual returns (uint256) {
        return block.timestamp / virtualBlockTime;
    }

    function _calculateBlocks(uint256 _timeInSeconds) internal view virtual returns (uint256) {
        return _timeInSeconds / virtualBlockTime;
    }

    function hasStakingStarted() public view returns (bool) {
        return (_getBlock() >= startBlock);
    }

    function getBlockTime() public view returns (uint256) {
        return virtualBlockTime;
    }

    function getUserRewardDebt(address _userAddress, uint256 _index) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt[_index];
    }

    function getUserOwedTokens(address _userAddress, uint256 _index) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed[_index];
    }

    /**
		@dev Simulate all conditions in order to calculate the calculated reward at the moment
		@param _userAddress the address of the user
		@param tokenIndex the index of the reward token you are interested
	 */
    function getUserAccumulatedReward(address _userAddress, uint256 tokenIndex) public view returns (uint256) {
        uint256 currentBlock = _getBlock();
        uint256 applicableBlock = (currentBlock < endBlock) ? currentBlock : endBlock;

        uint256 blocksSinceLastReward = applicableBlock - lastRewardBlock;

        uint256 tokenDecimals = IERC20Detailed(rewardsTokens[tokenIndex]).decimals();
        uint256 tokenMultiplier = 10**tokenDecimals;

        uint256 newReward = blocksSinceLastReward * rewardPerBlock[tokenIndex]; // Get newly accumulated reward
        uint256 rewardMultiplierIncrease = (newReward * tokenMultiplier) / totalStaked; // Calculate the multiplier increase
        uint256 currentMultiplier = accumulatedRewardMultiplier[tokenIndex] + rewardMultiplierIncrease; // Simulate the multiplier increase to the accumulated multiplier

        UserInfo storage user = userInfo[_userAddress];

        uint256 totalDebt = (user.amountStaked * currentMultiplier) / tokenMultiplier; // Simulate the current debt
        uint256 pendingDebt = totalDebt - user.rewardDebt[tokenIndex]; // Simulate the pending debt
        return user.tokensOwed[tokenIndex] + pendingDebt;
    }

    function getUserTokensOwedLength(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed.length;
    }

    function getUserRewardDebtLength(address _userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt.length;
    }

    /**
		@dev Extends the rewards period and updates the rates
		@param _endTimestamp  new end block for the rewards
		@param _rewardsPerBlock array with new rewards per block for each token 
	 */
    function extend(uint256 _endTimestamp, uint256[] memory _rewardsPerBlock) external virtual onlyOwner {
        require(_endTimestamp > block.timestamp, 'Extend::End block must be in the future');
        require(_endTimestamp >= endTimestamp, 'Extend::End block must be after the current end block');
        require(
            _rewardsPerBlock.length == rewardsTokens.length,
            'Extend::Rewards amounts length is less than expected'
        );

        for (uint256 i = 0; i < _rewardsPerBlock.length; i++) {
            uint256 currentRemainingRewards = calculateRewardsAmount(block.timestamp, endTimestamp, rewardPerBlock[i]);
            uint256 newRemainingRewards = calculateRewardsAmount(block.timestamp, _endTimestamp, _rewardsPerBlock[i]);

            if (currentRemainingRewards > newRemainingRewards) {
                // Some reward leftover needs to be returned

                IERC20Detailed(rewardsTokens[i]).safeTransfer(
                    msg.sender,
                    (currentRemainingRewards - newRemainingRewards)
                );
            } else {
                // We need to check if we have enough balance available in the contract to pay for the extension

                uint256 spentRewards = calculateRewardsAmount(startTimestamp, block.timestamp, rewardPerBlock[i]);

                uint256 balance = IERC20Detailed(rewardsTokens[i]).balanceOf(address(this));
                uint256 availableBalance = balance -
                    totalStaked -
                    (totalSpentRewards[i] + spentRewards - totalClaimed[i]);

                require(availableBalance > newRemainingRewards, 'Extend:: Not enough rewards in the pool to extend');

                totalSpentRewards[i] = totalSpentRewards[i] + spentRewards;
            }

            rewardPerBlock[i] = _rewardsPerBlock[i];
        }

        updateRewardMultipliers();

        endTimestamp = _endTimestamp;

        emit Extended(_endTimestamp, _rewardsPerBlock);
    }

    /** @dev Withdrawing rewards acumulated from different pools for providing liquidity
     * @param recipient The address to whom the rewards will be trasferred
     * @param lpTokenContract The address of the rewards contract
     */
    function withdrawLPRewards(address recipient, address lpTokenContract) external nonReentrant onlyOwner {
        uint256 currentReward = IERC20Detailed(lpTokenContract).balanceOf(address(this));
        require(currentReward > 0, 'WithdrawLPRewards::There are no rewards from liquidity pools');

        require(lpTokenContract != address(stakingToken), 'WithdrawLPRewards:: cannot withdraw from the LP tokens');

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            require(lpTokenContract != rewardsTokens[i], 'WithdrawLPRewards::Cannot withdraw from token rewards');
        }
        IERC20Detailed(lpTokenContract).safeTransfer(recipient, currentReward);
        emit WithdrawLPRewards(currentReward, recipient);
    }

    /** @dev Helper function to calculate how much tokens should be transffered to a rewards pool.
     */
    function calculateRewardsAmount(
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256 _rewardPerBlock
    ) internal view returns (uint256) {
        uint256 rewardsPeriodSeconds = _endTimestamp - _startTimestamp;
        uint256 rewardsPeriodBlocks = rewardsPeriodSeconds / virtualBlockTime;

        return _rewardPerBlock * rewardsPeriodBlocks;
    }
}
