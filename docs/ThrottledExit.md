## ThrottledExit





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
