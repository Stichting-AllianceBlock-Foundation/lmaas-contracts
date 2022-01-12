## NonCompoundingRewardsPool



Staking pool with a time lock and throttled exit. 
    Inherits all staking logic from RewardsPoolBase.
    Only allows exit at the end of the time lock and via the throttling mechanism.

### Inheritance

```
NonCompoundingRewardsPool
StakeReceiverFeature
StakeReceiver
StakeTransfererFeature
StakeTransferer
ThrottledExitFeature
ThrottledExit
StakeLockingFeature
StakeLock
OnlyExitFeature
RewardsPoolBase
Ownable
Context
ReentrancyGuard
```

### Variables

```Solidity
mapping(address => bool) receiversWhitelist;
uint256 nextAvailableExitTimestamp;
uint256 nextAvailableRoundExitVolume;
uint256 throttleRoundSeconds;
uint256 throttleRoundCap;
uint256 campaignEndTimestamp;
mapping(address => struct ThrottledExit.ExitInfo) exitInfo;
uint256 lockEndTimestamp;
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

uint256 _throttleRoundSeconds; // Seconds per throttle round

uint256 _throttleRoundCap; // Maximum tokens withdrawn per throttle round

uint256 _contractStakeLimit; // Maximum amount of tokens that can be staked in total

string _name; // Name of the pool
```
#### withdraw



Not allowed

```Solidity
uint256 _tokenAmount; 
```
#### claim



Not allowed

#### exit



Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.

#### completeExit



Completes the throttled exit from the pool.

#### exitAndTransfer



Exits the pool and tranfer to another pool


```Solidity
address transferTo; // The new pool to tranfer to
```
#### delegateStake



Receives a stake from another pool


```Solidity
address _staker; // The address who will own the stake

uint256 _amount; // The amount to stake
```
#### setReceiverWhitelisted



Change whitelist status of a receiver pool to receive transfers.


```Solidity
address _receiver; // The pool address to whitelist

bool _whitelisted; // If it should be whitelisted or not
```
#### stake



Stake an amount of tokens


```Solidity
uint256 _tokenAmount; // The amount to be staked
```
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

#### ExitRequested





```Solidity
address user;
uint256 exitTimestamp;
```
#### ExitCompleted





```Solidity
address user;
uint256 stake;
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

#### ExitInfo

```Solidity
uint256 exitTimestamp;
uint256 exitStake;
uint256[] rewards;
```
#### UserInfo

```Solidity
uint256 firstStakedTimestamp;
uint256 amountStaked;
uint256[] rewardDebt;
uint256[] tokensOwed;
```
