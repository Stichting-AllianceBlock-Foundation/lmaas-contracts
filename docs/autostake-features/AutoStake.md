## AutoStake





### Inheritance

```
AutoStake
Ownable
Context
ThrottledExit
StakeLock
ReentrancyGuard
```

### Variables

```Solidity
contract IRewardsPoolBase rewardPool
contract IERC20Detailed stakingToken
address factory
uint256 unit
uint256 valuePerShare
uint256 totalShares
uint256 totalValue
uint256 exitStake
mapping(address => uint256) share
```

### Functions

#### constructor





```Solidity
address token 
uint256 _throttleRoundBlocks 
uint256 _throttleRoundCap 
uint256 stakeEnd 
```
#### setPool





```Solidity
address pool 
```
#### stake





```Solidity
uint256 amount 
```
#### exit





```Solidity
```
#### completeExit





```Solidity
```
#### balanceOf → uint256





```Solidity
address who 
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
address newOwner 
```
#### getPendingReward → uint256





```Solidity
uint256 tokenIndex 
```

### Events

#### Staked





```Solidity
  address user
  uint256 amount
  uint256 sharesIssued
  uint256 oldShareVaule
  uint256 newShareValue
  uint256 balanceOf
```

