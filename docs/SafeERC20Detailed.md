## SafeERC20Detailed



Wrappers around SafeERC20Detailed operations that throw on failure (when the token
contract returns false). Tokens that return no value (and instead revert or
throw on failure) are also supported, non-reverting calls are assumed to be
successful.
To use this library you can add a `using SafeERC20Detailed for ERC20;` statement to your contract,
which allows you to call the safe operations as `token.safeTransfer(...)`, etc.

### Inheritance

```
SafeERC20Detailed
```


### Functions






