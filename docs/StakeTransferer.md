## StakeTransferer



Interface to transfer staking tokens to another whitelisted pool

### Inheritance

```
StakeTransferer
```

### Variables

```Solidity
mapping(address => bool) receiversWhitelist;
```

### Functions

#### setReceiverWhitelisted



Change whitelist status of a receiver pool to receive transfers.


```Solidity
address _receiver; // The pool address to whitelist

bool _whitelisted; // If it should be whitelisted or not
```

#### exitAndTransfer





```Solidity
address transferTo; 
```



