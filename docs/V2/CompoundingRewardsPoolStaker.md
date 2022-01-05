## CompoundingRewardsPoolStaker





### Inheritance

```
CompoundingRewardsPoolStaker
StakeReceiverAutoStake
StakeReceiver
StakeTransfererAutoStake
StakeTransferer
LimitedAutoStake
AutoStake
Ownable
Context
ThrottledExit
StakeLock
ReentrancyGuard
```


### Functions

#### constructor





```Solidity
address token 
uint256 _throttleRoundBlocks 
uint256 _throttleRoundCap 
uint256 stakeEnd 
uint256 _stakeLimit 
```
#### stake





```Solidity
uint256 amount 
```
#### delegateStake





```Solidity
address staker 
uint256 amount 
```
#### setReceiverWhitelisted





```Solidity
address receiver 
bool whitelisted 
```
#### exitAndTransfer



exits the current campaign and trasnfers the stake to another whitelisted campaign
		@param transferTo address of the receiver to transfer the stake to

```Solidity
address transferTo 
```
#### setPool





```Solidity
address pool 
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


