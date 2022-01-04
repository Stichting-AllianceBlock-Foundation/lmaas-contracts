## LiquidityMiningCampaign





### Inheritance

    LiquidityMiningCampaign
    RewardsPoolBase
    Ownable
    Context
    ReentrancyGuard
    StakeTransferer

### Variables

    string campaignName

### Functions

  #### constructor

  

  

    contract IERC20Detailed _stakingToken 
    address[] _rewardsTokens 
    uint256 _stakeLimit 
    uint256 _contractStakeLimit 
    string _campaingName 
  #### setReceiverWhitelisted

  

  

    address receiver 
    bool whitelisted 
  #### exitAndTransfer

  

  

    address  
  #### start

  

  Start the pool. Funds for rewards will be checked and staking will be opened.


    uint256 _startTimestamp // The start time of the pool

    uint256 _endTimestamp // The end time of the pool

    uint256[] _rewardPerSecond // Amount of rewards given per second
  #### stake

  

  Stake an amount of tokens


    uint256 _tokenAmount // The amount to be staked
  #### claim

  

  Claim all your rewards, this will not remove your stake

  #### withdraw

  

  Withdrawing a portion or all of staked tokens. This will not claim your rewards


    uint256 _tokenAmount // The amount to be withdrawn
  #### exit

  

  Claim all rewards and withdraw all staked tokens. Exits from the rewards pool

  #### balanceOf → uint256

  

  Returns the amount of tokens the user has staked


    address _userAddress // The user to get the balance of
  #### updateRewardMultipliers

  

  Updates the accumulated reward multipliers for everyone and each token

  #### hasStakingStarted → bool

  

  Checks if the staking has started

  #### getUserAccumulatedReward → uint256

  

  Calculates the reward at a specific time
		@param _userAddress the address of the user
		@param _tokenIndex the index of the reward token you are interested
        @param _time the time to check the reward at

    address _userAddress 
    uint256 _tokenIndex 
    uint256 _time 
  #### getAvailableBalance → uint256

  

  Calculates the available amount of reward tokens that are not locked
		@param _rewardTokenIndex the index of the reward token to check
		@param _time the time to do the calculations at

    uint256 _rewardTokenIndex 
    uint256 _time 
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


