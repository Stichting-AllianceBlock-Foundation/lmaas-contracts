## PoolPaymentInterface



Payment contract based on a credit system.
    User's pay in USDT for a short, medium or long campaign.
    When a credit is being used, this contract will kick off the start method in a liquidity mining campaign or staking campaign.
    Same goes for cancelling, extending and cancelling an extension.
    Prices for campaigns, extensions

### Inheritance

```
PoolPaymentInterface
```


### Functions


#### startWithPaymentContract





```Solidity
uint256 _startTimestamp; 
uint256 _endTimestamp; 
uint256[] _rewardPerSecond; 
```

#### cancelWithPaymentContract






#### extendWithPaymentContract





```Solidity
uint256 _durationTime; 
uint256[] _rewardPerSecond; 
```

#### cancelExtensionWithPaymentContract






#### startTimestamp → uint256






#### endTimestamp → uint256







