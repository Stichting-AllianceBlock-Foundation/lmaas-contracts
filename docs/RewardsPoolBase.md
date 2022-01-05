## RewardsPoolBase



Base pool contract used in all other pools. 
    Users can stake tokens and get rewards based on the percentage of total staked tokens.
    After deployment, owner can send funds and then start the pool. 
    When it's started a check is done to verify enough rewards are available. 
    Users can claim their rewards at any point, as well as withdraw their stake.
    The owner can extend the pool by setting a new end time and sending more rewards if needed.

### Inheritance

```
RewardsPoolBase
Ownable
Context
ReentrancyGuard
```

### Variables

```Solidity
uint256 PRECISION;
uint256 totalStaked;
uint256[] rewardPerSecond;
address[] rewardsTokens;
contract IERC20Detailed stakingToken;
uint256 startTimestamp;
uint256 endTimestamp;
uint256[] accumulatedRewardMultiplier;
uint256 stakeLimit;
uint256 contractStakeLimit;
mapping(address => struct RewardsPoolBase.UserInfo) userInfo;
```

### Functions

#### constructor





```Solidity
contract IERC20Detailed _stakingToken; 
address[] _rewardsTokens; 
uint256 _stakeLimit; 
uint256 _contractStakeLimit; 
```
#### start



Start the pool. Funds for rewards will be checked and staking will be opened.


```Solidity
uint256 _startTimestamp; // The start time of the pool

uint256 _endTimestamp; // The end time of the pool

uint256[] _rewardPerSecond; // Amount of rewards given per second
```
#### stake



Stake an amount of tokens


```Solidity
uint256 _tokenAmount; // The amount to be staked
```
#### claim



Claim all your rewards, this will not remove your stake

```Solidity
```
#### withdraw



Withdrawing a portion or all of staked tokens. This will not claim your rewards


```Solidity
uint256 _tokenAmount; // The amount to be withdrawn
```
#### exit



Claim all rewards and withdraw all staked tokens. Exits from the rewards pool

```Solidity
```
#### balanceOf → uint256



Returns the amount of tokens the user has staked


```Solidity
address _userAddress; // The user to get the balance of
```
#### updateRewardMultipliers



Updates the accumulated reward multipliers for everyone and each token

```Solidity
```
#### hasStakingStarted → bool



Checks if the staking has started

```Solidity
```
#### getUserAccumulatedReward → uint256



Calculates the reward at a specific time
		@param _userAddress the address of the user
		@param _tokenIndex the index of the reward token you are interested
        @param _time the time to check the reward at

```Solidity
address _userAddress; 
uint256 _tokenIndex; 
uint256 _time; 
```
#### getAvailableBalance → uint256



Calculates the available amount of reward tokens that are not locked
		@param _rewardTokenIndex the index of the reward token to check
		@param _time the time to do the calculations at

```Solidity
uint256 _rewardTokenIndex; 
uint256 _time; 
```
#### owner → address



Returns the address of the current owner.

```Solidity
```
#### renounceOwnership



Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.

```Solidity
```
#### transferOwnership



Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.

```Solidity
address newOwner; 
```

### Events

#### Started





```Solidity
```
#### Staked





```Solidity
address user;
uint256 amount;
```
#### Claimed





```Solidity
address user;
uint256 amount;
address token;
```
#### Withdrawn





```Solidity
address user;
uint256 amount;
```
#### Exited





```Solidity
address user;
uint256 amount;
```
#### Extended





```Solidity
uint256 newEndTimestamp;
uint256[] newRewardsPerSecond;
```
#### WithdrawLPRewards





```Solidity
uint256 rewardsAmount;
address recipient;
```

### Structs

#### UserInfo

```Solidity
uint256 firstStakedTimestamp;
uint256 amountStaked;
uint256[] rewardDebt;
uint256[] tokensOwed;
```
