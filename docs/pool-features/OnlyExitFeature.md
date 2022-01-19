## OnlyExitFeature





### Inheritance

```
OnlyExitFeature
RewardsPoolBase
Ownable
Context
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

#### withdraw





```Solidity
uint256 ; 
```

#### claim






#### constructor





```Solidity
contract IERC20Detailed _stakingToken; // The token to stake

address[] _rewardsTokens; // The reward tokens

uint256 _stakeLimit; // Maximum amount of tokens that can be staked per user

uint256 _contractStakeLimit; // Maximum amount of tokens that can be staked in total

string _name; // Name of the pool
```


#### start



Start the pool. Funds for rewards will be checked and staking will be opened.


```Solidity
uint256 _startTimestamp; // The start time of the pool

uint256 _endTimestamp; // The end time of the pool

uint256[] _rewardPerSecond; // Amount of rewards given per second
```


#### cancel





#### stake



Stake an amount of tokens


```Solidity
uint256 _tokenAmount; // The amount to be staked
```




#### exit



Claim all rewards and withdraw all staked tokens. Exits from the rewards pool




#### balanceOf → uint256



Returns the amount of tokens the user has staked


```Solidity
address _userAddress; // The user to get the balance of
```
#### updateRewardMultipliers



Updates the accumulated reward multipliers for everyone and each token





#### hasStakingStarted → bool



Checks if the staking has started


#### getUserRewardDebt → uint256



Returns the amount of reward debt of a specific token and user


```Solidity
address _userAddress; // the address of the updated user

uint256 _index; // index of the reward token to check
```

#### getUserOwedTokens → uint256



Returns the amount of reward owed of a specific token and user


```Solidity
address _userAddress; // the address of the updated user

uint256 _index; // index of the reward token to check
```

#### getUserAccumulatedReward → uint256



Calculates the reward at a specific time


```Solidity
address _userAddress; // the address of the user

uint256 _tokenIndex; // the index of the reward token you are interested

uint256 _time; // the time to check the reward at
```

#### getUserTokensOwedLength → uint256





```Solidity
address _userAddress; 
```

#### getUserRewardDebtLength → uint256





```Solidity
address _userAddress; 
```

#### getRewardTokensCount → uint256






#### extend



Extends the rewards period and updates the rates. 
     When the current campaign is still going on, the extension will be scheduled and started when the campaign ends.
     The extension can be cancelled until it starts. After it starts, the rewards are locked in and cannot be withdraw.


```Solidity
uint256 _durationTime; // duration of the campaign (how many seconds the campaign will have)

uint256[] _rewardPerSecond; // array with new rewards per second for each token
```


#### cancelExtension



Cancels the schedules extension

#### getAvailableBalance → uint256



Calculates the available amount of reward tokens that are not locked


```Solidity
uint256 _rewardTokenIndex; // the index of the reward token to check
```


#### withdrawTokens



Withdraw tokens other than the staking and reward token, for example rewards from liquidity mining


```Solidity
address _recipient; // The address to whom the rewards will be transferred

address _token; // The address of the rewards contract
```

#### withdrawExcessRewards



Withdraw excess rewards not needed for current campaign and extension


```Solidity
address _recipient; // The address to whom the rewards will be transferred
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





```Solidity
uint256 startTimestamp;
uint256 endTimestamp;
uint256[] rewardsPerSecond;
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
uint256 newStartTimestamp;
uint256 newEndTimestamp;
uint256[] newRewardsPerSecond;
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
