## ThrottledExit



Provides a throttling mechanism for staking pools. Instead of allowing
    everyone to withdraw their stake at once at the end of the pool, this forces
    the exits to go in rounds. Every round has a limit of how many tokens can be exited
    and a certain amount of time has to pass before the next round can start. When the 
    round is full, users that want to exit are put into the next round. Exit happens
    in two stages, 'initiate exit' gives the user the time when they can exit. 
    'Finalize exit' actually withdraws the users stake and rewards.

### Inheritance

```
ThrottledExit
```

### Variables

```Solidity
uint256 nextAvailableExitTimestamp;
uint256 nextAvailableRoundExitVolume;
uint256 throttleRoundSeconds;
uint256 throttleRoundCap;
uint256 campaignEndTimestamp;
mapping(address => struct ThrottledExit.ExitInfo) exitInfo;
```

### Functions







#### getPendingReward → uint256



Returns the amount of reward tokens that are pending for exit for this user


```Solidity
uint256 _tokenIndex; // The index of the reward to check
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

### Structs

#### ExitInfo

```Solidity
uint256 exitTimestamp;
uint256 exitStake;
uint256[] rewards;
```
