## LimitedAutoStake





### Inheritance

    LimitedAutoStake
    AutoStake
    Ownable
    Context
    ThrottledExit
    StakeLock
    ReentrancyGuard

### Variables

    uint256 stakeLimit

### Functions

  #### constructor

  

  

    address token 
    uint256 _throttleRoundBlocks 
    uint256 _throttleRoundCap 
    uint256 stakeEnd 
    uint256 _stakeLimit 
  #### stake

  

  

    uint256 amount 
  #### setPool

  

  

    address pool 
  #### exit

  

  

  #### completeExit

  

  

  #### balanceOf → uint256

  

  

    address who 
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

    address newOwner 
  #### getPendingReward → uint256

  

  

    uint256 tokenIndex 


