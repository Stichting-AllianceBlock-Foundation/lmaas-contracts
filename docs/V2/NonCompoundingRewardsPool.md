## NonCompoundingRewardsPool





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


### Functions

#### constructor





```Solidity
contract IERC20Detailed _stakingToken; 
address[] _rewardsTokens; 
uint256 _stakeLimit; 
uint256 _throttleRoundBlocks; 
uint256 _throttleRoundCap; 
uint256 _contractStakeLimit; 
```
#### start



Start the pool and set locking and throttling parameters.


```Solidity
uint256 _startTimestamp; // The start time of the pool

uint256 _endTimestamp; // The end time of the pool

uint256[] _rewardPerSecond; // Amount of rewards given per second
```
#### withdraw



Not allowed

```Solidity
uint256 _tokenAmount; 
```
#### claim



Not allowed

```Solidity
```
#### exit



Requests a throttled exit from the pool and gives you a time from which you can withdraw your stake and rewards.

```Solidity
```
#### completeExit



Completes the throttled exit from the pool.

```Solidity
```
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





```Solidity
address receiver; 
bool whitelisted; 
```
#### getPendingReward → uint256





```Solidity
uint256 tokenIndex; 
```
#### stake



Stake an amount of tokens


```Solidity
uint256 _tokenAmount; // The amount to be staked
```
#### balanceOf → uint256



Returns the amount of tokens the user has staked


```Solidity
address _userAddress; // The user to get the balance of
```
#### updateRewardMultipliers



Updates the accumulated reward multipliers for everyone and each token

```Solidity
```
#### hasStakingStarted → bool



Checks if the staking has started

```Solidity
```
#### getUserAccumulatedReward → uint256



Calculates the reward at a specific time
		@param _userAddress the address of the user
		@param _tokenIndex the index of the reward token you are interested
        @param _time the time to check the reward at

```Solidity
address _userAddress; 
uint256 _tokenIndex; 
uint256 _time; 
```
#### getAvailableBalance → uint256



Calculates the available amount of reward tokens that are not locked
		@param _rewardTokenIndex the index of the reward token to check
		@param _time the time to do the calculations at

```Solidity
uint256 _rewardTokenIndex; 
uint256 _time; 
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


