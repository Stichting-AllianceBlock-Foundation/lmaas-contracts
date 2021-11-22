// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';

contract RewardsPoolBase is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    uint256 public totalStaked;
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

    event Staked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount, address token);
    event Withdrawn(address indexed user, uint256 amount);
    event Exited(address indexed user, uint256 amount);
    event Extended(uint256 newEndBlock, uint256[] newRewardsPerBlock);
    event WithdrawLPRewards(uint256 indexed rewardsAmount, address indexed recipient);

    constructor(
        IERC20Detailed _stakingToken,
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        address[] memory _rewardsTokens,
        uint256[] memory _rewardPerBlock,
        uint256 _stakeLimit,
        uint256 _contractStakeLimit,
        uint256 _virtualBlockTime
    ) {
        require(address(_stakingToken) != address(0), 'Constructor::Invalid staking token address');

        require(_startTimestamp > _getCurrentTime(), 'Constructor::The starting timestamp must be in the future.');
        require(_endTimestamp > _startTimestamp, 'Constructor::The end timestamp must be in the future.');
        require(
            _rewardPerBlock.length == _rewardsTokens.length,
            'Constructor::Rewards per block and rewards tokens must be with the same length.'
        );
        require(_stakeLimit != 0, 'Constructor::Stake limit needs to be more than 0');
        require(_contractStakeLimit != 0, 'Constructor:: Contract Stake limit needs to be more than 0');
        require(_virtualBlockTime != 0, 'Constructor:: Virtual block time should be greater than 0');

        stakingToken = _stakingToken;
        rewardPerBlock = _rewardPerBlock;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        rewardsTokens = _rewardsTokens;
        lastRewardBlock = startBlock;
        rewardsPoolFactory = msg.sender;
        stakeLimit = _stakeLimit;
        contractStakeLimit = _contractStakeLimit;
        virtualBlockTime = _virtualBlockTime * 1 seconds;
        startBlock = _calculateBlocks(startTimestamp);
        endBlock = _calculateBlocks(endTimestamp);
        for (uint256 i = 0; i < rewardsTokens.length; i++) {
            accumulatedRewardMultiplier.push(0);
        }
    }

    modifier onlyInsideBlockBounds() {
        uint256 currentBlock = _getBlock();
        require(currentBlock > startBlock, 'Stake::Staking has not yet started');
        require(currentBlock <= endBlock, 'Stake::Staking has finished');
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == rewardsPoolFactory, 'Caller is not RewardsPoolFactory contract');
        _;
    }

    modifier onlyUnderStakeLimit(address staker, uint256 newStake) {
        UserInfo storage user = userInfo[staker];
        require(user.amountStaked.add(newStake) <= stakeLimit, 'onlyUnderStakeLimit::Stake limit reached');
        require(totalStaked.add(newStake) <= contractStakeLimit, 'onlyUnderStakeLimit::Contract Stake limit reached');
        _;
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
            onInitialStake(staker);
        }

        updateRewardMultipliers(); // Update the accumulated multipliers for everyone
        updateUserAccruedReward(staker); // Update the accrued reward for this specific user

        user.amountStaked = user.amountStaked.add(_tokenAmount);
        totalStaked = totalStaked.add(_tokenAmount);

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 tokenDecimals = IERC20Detailed(rewardsTokens[i]).decimals();
            uint256 tokenMultiplier = 10**tokenDecimals;

            uint256 totalDebt = user.amountStaked.mul(accumulatedRewardMultiplier[i]).div(tokenMultiplier); // Update user reward debt for each token
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

        user.amountStaked = user.amountStaked.sub(_tokenAmount);
        totalStaked = totalStaked.sub(_tokenAmount);

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = 0; i < rewardsTokensLength; i++) {
            uint256 tokenDecimals = IERC20Detailed(rewardsTokens[i]).decimals();
            uint256 tokenMultiplier = 10**tokenDecimals;
            uint256 totalDebt = user.amountStaked.mul(accumulatedRewardMultiplier[i]).div(tokenMultiplier); // Update user reward debt for each token
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
		@dev Execute logic on initial stake of the user.
		Could be overriden if needed by the later contracts.
		@param _userAddress the address of the user
	 */
    function onInitialStake(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];
        user.firstStakedBlockNumber = _getBlock();
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

            uint256 newReward = blocksSinceLastReward.mul(rewardPerBlock[i]); // Get newly accumulated reward
            uint256 rewardMultiplierIncrease = newReward.mul(tokenMultiplier).div(totalStaked); // Calculate the multiplier increase
            accumulatedRewardMultiplier[i] = accumulatedRewardMultiplier[i].add(rewardMultiplierIncrease); // Add the multiplier increase to the accumulated multiplier
        }
        lastRewardBlock = applicableBlock;
    }

    /**
		@dev updates the accumulated reward for the user with the _userAddress address
		@param _userAddress the address of the updated user
	 */
    function updateUserAccruedReward(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        initialiseUserRewardDebt(_userAddress);
        initialiseUserTokensOwed(_userAddress);

        if (user.amountStaked == 0) {
            return;
        }

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 tokenIndex = 0; tokenIndex < rewardsTokensLength; tokenIndex++) {
            updateUserRewardForToken(_userAddress, tokenIndex);
        }
    }

    /**
		@dev initialises the tokensOwed array for the user
		@param _userAddress the address of the user
	 */
    function initialiseUserTokensOwed(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        if (user.tokensOwed.length == rewardsTokens.length) {
            // Already initialised
            return;
        }

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = user.tokensOwed.length; i < rewardsTokensLength; i++) {
            user.tokensOwed.push(0);
        }
    }

    /**
		@dev initialises the rewardDebt array for the user
		@param _userAddress the address of the user
	 */
    function initialiseUserRewardDebt(address _userAddress) internal {
        UserInfo storage user = userInfo[_userAddress];

        if (user.rewardDebt.length == rewardsTokens.length) {
            // Allready initialised
            return;
        }

        uint256 rewardsTokensLength = rewardsTokens.length;

        for (uint256 i = user.rewardDebt.length; i < rewardsTokensLength; i++) {
            user.rewardDebt.push(0);
        }
    }

    /**
		@dev calculates and updates the current user rewardDebt. Accrues accumulated reward.
		@param _userAddress the address of the user
	 */
    function updateUserRewardForToken(address _userAddress, uint256 tokenIndex) internal {
        UserInfo storage user = userInfo[_userAddress];
        uint256 tokenDecimals = IERC20Detailed(rewardsTokens[tokenIndex]).decimals();
        uint256 tokenMultiplier = 10**tokenDecimals;

        uint256 totalDebt = user.amountStaked.mul(accumulatedRewardMultiplier[tokenIndex]).div(tokenMultiplier);
        uint256 pendingDebt = totalDebt.sub(user.rewardDebt[tokenIndex]);
        if (pendingDebt > 0) {
            user.tokensOwed[tokenIndex] = user.tokensOwed[tokenIndex].add(pendingDebt);
            user.rewardDebt[tokenIndex] = totalDebt;
        }
    }

    // function _getBlock() internal view virtual returns (uint256) {
    // 	return block.number;
    // }

    function _getBlock() public view virtual returns (uint256) {
        return (block.timestamp.div(virtualBlockTime));
    }

    function _getCurrentTime() internal view virtual returns (uint256) {
        return block.timestamp;
    }

    function _calculateBlocks(uint256 _timeInSeconds) internal view virtual returns (uint256) {
        return _timeInSeconds.div(virtualBlockTime);
    }

    function hasStakingStarted() public view returns (bool) {
        return (_getBlock() >= startBlock);
    }

    function getBlockTime() public view returns (uint256) {
        return virtualBlockTime;
    }

    function getUserRewardDebt(address _userAddress, uint256 _index) external view returns (uint256) {
        require(_userAddress != address(0), 'GetUserRewardDebt::Invalid user address');
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt[_index];
    }

    function getUserOwedTokens(address _userAddress, uint256 _index) external view returns (uint256) {
        require(_userAddress != address(0), 'GetUserOwedTokens::Invalid user address');
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

        uint256 blocksSinceLastReward = applicableBlock.sub(lastRewardBlock);

        uint256 tokenDecimals = IERC20Detailed(rewardsTokens[tokenIndex]).decimals();
        uint256 tokenMultiplier = 10**tokenDecimals;

        uint256 newReward = blocksSinceLastReward.mul(rewardPerBlock[tokenIndex]); // Get newly accumulated reward
        uint256 rewardMultiplierIncrease = newReward.mul(tokenMultiplier).div(totalStaked); // Calculate the multiplier increase
        uint256 currentMultiplier = accumulatedRewardMultiplier[tokenIndex].add(rewardMultiplierIncrease); // Simulate the multiplier increase to the accumulated multiplier

        UserInfo storage user = userInfo[_userAddress];

        uint256 totalDebt = user.amountStaked.mul(currentMultiplier).div(tokenMultiplier); // Simulate the current debt
        uint256 pendingDebt = totalDebt.sub(user.rewardDebt[tokenIndex]); // Simulate the pending debt
        return user.tokensOwed[tokenIndex].add(pendingDebt);
    }

    function getUserTokensOwedLength(address _userAddress) external view returns (uint256) {
        require(_userAddress != address(0), 'GetUserTokensOwedLength::Invalid user address');
        UserInfo storage user = userInfo[_userAddress];
        return user.tokensOwed.length;
    }

    function getUserRewardDebtLength(address _userAddress) external view returns (uint256) {
        require(_userAddress != address(0), 'GetUserRewardDebtLength::Invalid user address');
        UserInfo storage user = userInfo[_userAddress];
        return user.rewardDebt.length;
    }

    /**
		@dev Extends the rewards period and updates the rates
		@param _endTimestamp  new end block for the rewards
		@param _rewardsPerBlock array with new rewards per block for each token 
	 */
    function extend(uint256 _endTimestamp, uint256[] memory _rewardsPerBlock) external virtual onlyOwner {
        require(_endTimestamp > _getCurrentTime(), 'Extend::End block must be in the future');
        require(_endTimestamp >= endTimestamp, 'Extend::End block must be after the current end block');
        require(
            _rewardsPerBlock.length == rewardsTokens.length,
            'Extend::Rewards amounts length is less than expected'
        );

        uint256[] memory currentRemainingRewards = new uint256[](_rewardsPerBlock.length);
        uint256[] memory newRemainingRewards = new uint256[](_rewardsPerBlock.length);

        for (uint256 i = 0; i < _rewardsPerBlock.length; i++) {
            currentRemainingRewards[i] = calculateRewardsAmount(block.timestamp, endTimestamp, rewardPerBlock[i]);

            newRemainingRewards[i] = calculateRewardsAmount(block.timestamp, _endTimestamp, _rewardsPerBlock[i]);

            require(
                newRemainingRewards[i] < currentRemainingRewards[i],
                'Extend:: Not enough rewards in the pool to extend'
            );
        }

        updateRewardMultipliers();

        // TODO: maybe remove this because its not needed anymore without factory
        for (uint256 i = 0; i < _rewardsPerBlock.length; i++) {
            address rewardsToken = rewardsTokens[i];

            if (currentRemainingRewards[i] > newRemainingRewards[i]) {
                // Some reward leftover needs to be returned
                IERC20Detailed(rewardsToken).safeTransfer(
                    msg.sender,
                    (currentRemainingRewards[i] - newRemainingRewards[i])
                );
            }

            rewardPerBlock[i] = _rewardsPerBlock[i];
        }

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
        require(
            _rewardPerBlock > 0,
            'RewardsPoolBase::calculateRewardsAmount: Rewards per block must be greater than zero'
        );
        uint256 rewardsPeriodSeconds = _endTimestamp.sub(_startTimestamp);
        uint256 rewardsPeriodBlocks = rewardsPeriodSeconds.div(virtualBlockTime);

        return _rewardPerBlock.mul(rewardsPeriodBlocks);
    }

    /** @dev Helper function to get the reward tokens count.
     */
    function getRewardTokensCount() public view returns (uint256) {
        return rewardsTokens.length;
    }
}
