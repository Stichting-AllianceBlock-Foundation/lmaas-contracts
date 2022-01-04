## TreasuryOperatedFeature

### Inheritance

```
TreasuryOperatedFeature
TreasuryOperated
RewardsPoolBase
Ownable
Context
ReentrancyGuard
```

### Variables

```Solidity
address externalRewardToken;
mapping(address => uint256) externalRewards;
address treasury;
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
string name;
mapping(address => struct RewardsPoolBase.UserInfo) userInfo;
```

### Functions

#### withdrawStake

```Solidity
uint256 amount;
```

#### notifyExternalReward

```Solidity
uint256 reward;
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

#### withdraw

Withdrawing a portion or all of staked tokens. This will not claim your rewards

```Solidity
uint256 _tokenAmount; // The amount to be withdrawn
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

#### getUserAccumulatedReward → uint256

Calculates the reward at a specific time

```Solidity
address _userAddress; // the address of the user

uint256 _tokenIndex; // the index of the reward token you are interested

uint256 _time; // the time to check the reward at
```

#### getAvailableBalance → uint256

Calculates the available amount of reward tokens that are not locked

```Solidity
uint256 _rewardTokenIndex; // the index of the reward token to check

uint256 _time; // the time to do the calculations at
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

#### StakeWithdrawn

```Solidity
uint256 amount;
```

#### ExternalRewardsAdded

```Solidity
address from;
address token;
uint256 reward;
```

#### ExternalRewardsClaimed

```Solidity
address receiver;
```

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
