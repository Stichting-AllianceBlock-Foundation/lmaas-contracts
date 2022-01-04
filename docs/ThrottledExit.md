## ThrottledExit





### Inheritance

    ThrottledExit

### Variables

    uint256 nextAvailableExitTimestamp
    uint256 nextAvailableRoundExitVolume
    uint256 throttleRoundSeconds
    uint256 throttleRoundCap
    uint256 campaignEndTimestamp
    mapping(address => struct ThrottledExit.ExitInfo) exitInfo

### Functions

  #### getPendingReward → uint256

  

  

    uint256 tokenIndex 

### Events

  #### ExitRequested

  

  

    address user
    uint256 exitTimestamp
  #### ExitCompleted

  

  

    address user
    uint256 stake

### Structs

  #### ExitInfo

    uint256 exitTimestamp
    uint256 exitStake
    uint256[] rewards

