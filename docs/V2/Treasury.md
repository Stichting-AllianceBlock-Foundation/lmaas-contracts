## Treasury





### Inheritance

```
Treasury
Ownable
Context
```

### Variables

```Solidity
address externalRewardToken;
mapping(address => uint256) liquidityDrawn;
contract IUniswapV2Router uniswapRouter;
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

#### addUniswapLiquidity → uint256 amountA, uint256 amountB, uint256 liquidity





```Solidity
address tokenA; 
address tokenB; 
uint256 amountADesired; 
uint256 amountBDesired; 
uint256 amountAMin; 
uint256 amountBMin; 
uint256 deadline; 
```

#### removeUniswapLiquidity → uint256 amountA, uint256 amountB





```Solidity
address tokenA; 
address tokenB; 
address lpToken; 
uint256 liquidity; 
uint256 amountAMin; 
uint256 amountBMin; 
uint256 deadline; 
```

#### withdrawToken





```Solidity
address token; 
uint256 amount; 
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

#### OwnershipTransferred





```Solidity
address previousOwner;
address newOwner;
```

