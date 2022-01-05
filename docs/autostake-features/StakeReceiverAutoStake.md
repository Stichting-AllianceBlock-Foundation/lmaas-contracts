## StakeReceiverAutoStake





### Inheritance

```
StakeReceiverAutoStake
StakeReceiver
AutoStake
Ownable
Context
ThrottledExit
StakeLock
ReentrancyGuard
```


### Functions

#### delegateStake



Receives a stake from another pool


```Solidity
address _staker; // The address who will own the stake

uint256 _amount; // The amount to stake
```
#### constructor





```Solidity
address token; 
uint256 _throttleRoundBlocks; 
uint256 _throttleRoundCap; 
uint256 stakeEnd; 
```
#### setPool





```Solidity
address pool; 
```
#### stake





```Solidity
uint256 amount; 
```
#### exit





```Solidity
```
#### completeExit





```Solidity
```
#### balanceOf → uint256





```Solidity
address who; 
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
address newOwner; 
```
#### getPendingReward → uint256





```Solidity
uint256 tokenIndex; 
```


