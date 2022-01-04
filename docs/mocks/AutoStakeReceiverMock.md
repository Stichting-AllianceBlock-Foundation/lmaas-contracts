## AutoStakeReceiverMock

### Inheritance

```
AutoStakeReceiverMock
StakeReceiverAutoStake
StakeReceiver
AutoStake
Ownable
Context
ThrottledExit
StakeLock
ReentrancyGuard
```

### Variables

```Solidity
contract IRewardsPoolBase rewardPool;
contract IERC20Detailed stakingToken;
address factory;
uint256 unit;
uint256 valuePerShare;
uint256 totalShares;
uint256 totalValue;
uint256 exitStake;
mapping(address => uint256) share;
uint256 nextAvailableExitTimestamp;
uint256 nextAvailableRoundExitVolume;
uint256 throttleRoundSeconds;
uint256 throttleRoundCap;
uint256 campaignEndTimestamp;
mapping(address => struct ThrottledExit.ExitInfo) exitInfo;
uint256 lockEndTimestamp;
```

### Functions

#### constructor

```Solidity
address token;
uint256 _throttleRoundSeconds;
uint256 _throttleRoundCap;
uint256 stakeEnd;
```

#### delegateStake

Receives a stake from another pool

```Solidity
address _staker; // The address who will own the stake

uint256 _amount; // The amount to stake
```

#### setPool

Sets the underlying reward pool. Can only be set once.

```Solidity
address _pool; // The reward pool
```

#### stake

Stake an amount of tokens

```Solidity
uint256 _tokenAmount; // The amount to be staked
```

#### exit

Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.

#### completeExit

Completes the throttled exit from the pool.

#### balanceOf → uint256

```Solidity
address _staker;
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

#### getPendingReward → uint256

Returns the amount of reward tokens that are pending for exit for this user

```Solidity
uint256 _tokenIndex; // The index of the reward to check
```

### Events

#### Staked

```Solidity
address user;
uint256 amount;
uint256 sharesIssued;
uint256 oldShareVaule;
uint256 newShareValue;
uint256 balanceOf;
```

#### OwnershipTransferred

```Solidity
address previousOwner;
address newOwner;
```

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

### Structs

#### ExitInfo

```Solidity
uint256 exitTimestamp;
uint256 exitStake;
uint256[] rewards;
```
