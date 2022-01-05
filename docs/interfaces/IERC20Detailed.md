## IERC20Detailed



Interface of the ERC20 standard as defined in the EIP. Does not include
the optional functions; to access them see `ERC20Detailed`.

### Inheritance

```
IERC20Detailed
```


### Functions


### Events

#### Transfer



Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.

```Solidity
  address from
  address to
  uint256 value
```
#### Approval



Emitted when the allowance of a `spender` for an `owner` is set by
a call to `approve`. `value` is the new allowance.

```Solidity
  address owner
  address spender
  uint256 value
```

