## Treasury





### Inheritance

```
Treasury
Ownable
Context
```

### Variables

```Solidity
address externalRewardToken
mapping(address => uint256) liquidityDrawn
contract IUniswapV2Router uniswapRouter
```

### Functions

#### constructor





```Solidity
address _uniswapRouter; 
address _externalRewardToken; 
```
#### withdrawLiquidity





```Solidity
address[] rewardPools; 
uint256[] amounts; 
```
#### returnLiquidity





```Solidity
address[] rewardPools; 
uint256[] externalRewards; 
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


