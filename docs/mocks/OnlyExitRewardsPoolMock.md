## OnlyExitRewardsPoolMock





### Inheritance

```
OnlyExitRewardsPoolMock
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

#### constructor





```Solidity
contract IERC20Detailed _stakingToken; 
uint256 _startTimestamp; 
uint256 _endTimestamp; 
address[] _rewardsTokens; 
uint256 _stakeLimit; 
uint256 _contractStakeLimit; 
string _name; 
```
#### withdraw





```Solidity
uint256 _tokenAmount; 
```
#### claim





#### stake



Stake an amount of tokens


```Solidity
uint256 _tokenAmount; // The amount to be staked
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
