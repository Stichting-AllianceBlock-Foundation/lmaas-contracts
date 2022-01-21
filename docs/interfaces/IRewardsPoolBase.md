## IRewardsPoolBase





### Inheritance

```
IRewardsPoolBase
```


### Functions


#### getUserRewardDebt





```Solidity
address _userAddress; 
uint256 _index; 
```

#### getUserOwedTokens





```Solidity
address _userAddress; 
uint256 _index; 
```

#### getUserAccumulatedReward → uint256





```Solidity
address _userAddress; 
uint256 tokenIndex; 
uint256 time; 
```

#### getUserTokensOwedLength → uint256





```Solidity
address _userAddress; 
```

#### getUserRewardDebtLength → uint256





```Solidity
address _userAddress; 
```

#### calculateRewardsAmount → uint256





```Solidity
uint256 _startTimestamp; 
uint256 _endTimestamp; 
uint256 _rewardPerSecond; 
```

#### balanceOf → uint256





```Solidity
address _userAddress; 
```

#### stakingToken → address






#### updateRewardMultipliers






#### updateUserAccruedReward





```Solidity
address _userAddress; 
```

#### name → string






#### endTimestamp → uint256






#### start





```Solidity
uint256 _startTimestamp; 
uint256 _endTimestamp; 
uint256[] _rewardPerSecond; 
```

#### stake





```Solidity
uint256 _tokenAmount; 
```

#### withdraw





```Solidity
uint256 _tokenAmount; 
```

#### claim






#### exit






#### extend





```Solidity
uint256 _endTimestamp; 
uint256[] _rewardsPerSecond; 
```

#### withdrawTokens





```Solidity
address recipient; 
address token; 
```


