## Payment





### Inheritance

```
Payment
Ownable
Context
```

### Variables

```Solidity
address paymentReceiverA;
address paymentReceiverB;
uint256 paymentShareA;
uint256[3] priceCampaign;
uint256[3] discounts;
uint256 priceCampaignExtension;
mapping(address => mapping(uint256 => uint256)) creditsCampaigns;
mapping(address => uint256) creditsCampaignExtension;
mapping(address => uint256) campaignsDeployed;
mapping(address => bool) whitelist;
mapping(address => mapping(uint256 => bool)) refundWhitelist;
mapping(address => bool) refundWhitelistExtension;
```

### Functions

#### constructor





```Solidity
address _paymentReceiverA; // First payment receiver

address _paymentReceiverB; // Second payment receiver

address _usdtToken; // Address of USDT token used to pay

uint256[3] _priceCampaign; // Array of prices it costs to deploy a campaign ( short, medium, long)

uint256 _priceCampaignExtension; // Price it costs to extend a campaign

uint256[3] _discounts; // Array of discounts that are applied when a user has deployed campaigns before
```


#### setPaymentReceivers



Set payment receivers


```Solidity
address _paymentReceiverA; // First payment receiver

address _paymentReceiverB; // Second payment receiver
```


#### setPriceCampaign



Set campaign prices


```Solidity
uint256[3] _priceCampaign; // Array of prices it costs to deploy a campaign ( short, medium, long)
```

#### setPriceCampaignExtension



Set price of campaign extensions


```Solidity
uint256 _priceCampaignExtension; // Price it costs to extend a campaign
```

#### setDiscounts



Set discounts applied to users that have deployed multiple campaigns


```Solidity
uint256[3] _discounts; // Array of discounts that are applied when a user has deployed campaigns before
```

#### addToWhitelist



Add users to a whitelist so they don't have to pay


```Solidity
address _wallet; // Wallet to add to whitelist
```

#### removeFromWhitelist



Remove user from whitelist


```Solidity
address _wallet; // Wallet to remove from whitelist
```


#### addCredit



Admin function to give a wallet a credit to deploy a campaign


```Solidity
address _walletToGiveCredit; // Wallet to give a credit

uint256 _days; // Campaign duration in days
```

#### addCreditExtension



Admin function to give a wallet a credit to extend a campaign


```Solidity
address _walletToGiveCredit; // Wallet to give a credit
```
#### getCampaignPrice → uint256, uint256



Returns campaign price based on campaign duration and applied discounts if user has deployed campaigns in the past.


```Solidity
uint256 _days; // Campaign duration in days

address _walletWithCredit; 
```


#### pay



Payment function to buy a credit for deploying a campaign


```Solidity
address _walletToGiveCredit; // Wallet to give credit to

uint256 _days; // Campaign duration in days
```

#### payExtension



Payment function to buy a credit for extending a campaign


```Solidity
address _walletToGiveCredit; // Wallet to give credit to
```


#### useCredit



Deducts a credit and schedules the start of a campaign


```Solidity
uint256 _startTimestamp; // Unix timestamp of start time

uint256 _endTimestamp; // Unix timestamp of end time

uint256[] _rewardPerSecond; // Amount of rewards per second

address CampaignAddress; // Address of the Liquidity Mining Campaign Payment Contract
```

#### refundCredit



Cancels a scheduled campaign and refunds a credit to the user


```Solidity
address CampaignAddress; // Address of the Liquidity Mining Campaign Payment Contract
```

#### useCreditExtension



Deducts an extension credit and schedules the extension of a campaign


```Solidity
uint256 _durationTime; // Campaign duration

uint256[] _rewardPerSecond; // Rewards per second

address CampaignAddress; // Address of the Liquidity Mining Campaign Payment Contract
```

#### refundCreditExtension



Cancels a schedules campaign extensions and refunds the user a credit


```Solidity
address CampaignAddress; // Address of the Liquidity Mining Campaign Payment Contract
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

