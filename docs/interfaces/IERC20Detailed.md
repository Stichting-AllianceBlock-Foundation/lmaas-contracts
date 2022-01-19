## IERC20Detailed



Interface of the ERC20 standard as defined in the EIP. Does not include
the optional functions; to access them see `ERC20Detailed`.

### Inheritance

```
IERC20Detailed
```


### Functions


#### totalSupply → uint256



Returns the amount of tokens in existence.


#### balanceOf → uint256



Returns the amount of tokens owned by `account`.

```Solidity
address account; 
```

#### transfer → bool



Moves `amount` tokens from the caller's account to `recipient`.

Returns a boolean value indicating whether the operation succeeded.

Emits a `Transfer` event.

```Solidity
address recipient; 
uint256 amount; 
```

#### allowance → uint256



Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through `transferFrom`. This is
zero by default.

This value changes when `approve` or `transferFrom` are called.

```Solidity
address owner; 
address spender; 
```

#### approve → bool



Sets `amount` as the allowance of `spender` over the caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

> Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an `Approval` event.

```Solidity
address spender; 
uint256 amount; 
```

#### transferFrom → bool



Moves `amount` tokens from `sender` to `recipient` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a `Transfer` event.

```Solidity
address sender; 
address recipient; 
uint256 amount; 
```

#### name → string



Returns the name of the token.


#### symbol → string



Returns the symbol of the token, usually a shorter version of the
name.


#### decimals → uint8



Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5,05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei.

> Note that this information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
`IERC20.balanceOf` and `IERC20.transfer`.


### Events

#### Transfer



Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.

```Solidity
address from;
address to;
uint256 value;
```
#### Approval



Emitted when the allowance of a `spender` for an `owner` is set by
a call to `approve`. `value` is the new allowance.

```Solidity
address owner;
address spender;
uint256 value;
```

