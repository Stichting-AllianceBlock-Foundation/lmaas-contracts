## RewardsPoolBase



Base pool contract used in all other pools. 
Users can stake tokens and get rewards based on the percentage of total staked tokens.
After deployment, owner can send funds and then start the pool. 
When it's started a check is done to verify enough rewards are available. 
Users can claim their rewards at any point, as well as withdraw their stake.
The owner can extend the pool by setting a new end time and sending more rewards if needed.

Rewards are kept track of using the accumulatedRewardMultiplier.
This variable represents the accumulated reward per token staked from the start until now.
Based on the difference between the accumulatedRewardMultiplier at the time of your stake and withdrawal, 
we calculate the amount of tokens you can claim.

For example, you enter when the accumulatedRewardMultiplier is 5 and exit at 20. You staked 100 tokens.
Your reward is (20 - 5) * 100 = 1500 tokens.

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
uint256 extensionDuration;
uint256[] extensionRewardPerSecond;
uint256[] accumulatedRewardMultiplier;
uint256 stakeLimit;
uint256 contractStakeLimit;
string name;
mapping(address => struct RewardsPoolBase.UserInfo) userInfo;
```

### Functions

#### constructor





```Solidity
contract IERC20Detailed _stakingToken; // The token to stake

address[] _rewardsTokens; // The reward tokens

uint256 _stakeLimit; // Maximum amount of tokens that can be staked per user

uint256 _contractStakeLimit; // Maximum amount of tokens that can be staked in total

string _name; // Name of the pool
```
#### stake



Stake an amount of tokens


```Solidity
uint256 _tokenAmount; // The amount to be staked
```
#### claim



Claim all your rewards, this will not remove your stake

#### withdraw



Withdrawing a portion or all of staked tokens. This will not claim your rewards


```Solidity
uint256 _tokenAmount; // The amount to be withdrawn
```
#### exit



Claim all rewards and withdraw all staked tokens. Exits from the rewards pool

#### updateRewardMultipliers



Updates the accumulated reward multipliers for everyone and each token

#### getAvailableBalance → uint256



Calculates the available amount of reward tokens that are not locked


```Solidity
uint256 _rewardTokenIndex; // the index of the reward token to check
```
#### owner → address



Returns the address of the current owner.

#### renounceOwnership



Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.

#### transferOwnership



Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.

```Solidity
address newOwner; 
```

### Events

#### Started





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
#### OwnershipTransferred





```Solidity
address previousOwner;
address newOwner;
```

### Structs

#### UserInfo

```Solidity
uint256 firstStakedTimestamp;
uint256 amountStaked;
uint256[] rewardDebt;
uint256[] tokensOwed;
```
