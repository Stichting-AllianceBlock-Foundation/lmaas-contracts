## TestERC20





### Inheritance

    TestERC20
    ERC20PresetMinterPauser
    ERC20Pausable
    Pausable
    ERC20Burnable
    ERC20
    IERC20Metadata
    IERC20
    AccessControlEnumerable
    AccessControl
    ERC165
    IERC165
    IAccessControlEnumerable
    IAccessControl
    Context


### Functions

  #### constructor

  

  

    uint256 amount 
  #### setDecimals

  

  

    uint8 _d 
  #### decimals → uint8

  

  

  #### mint

  

  Creates `amount` new tokens for `to`.
See {ERC20-_mint}.
Requirements:
- the caller must have the `MINTER_ROLE`.

    address to 
    uint256 amount 
  #### pause

  

  Pauses all token transfers.
See {ERC20Pausable} and {Pausable-_pause}.
Requirements:
- the caller must have the `PAUSER_ROLE`.

  #### unpause

  

  Unpauses all token transfers.
See {ERC20Pausable} and {Pausable-_unpause}.
Requirements:
- the caller must have the `PAUSER_ROLE`.

  #### paused → bool

  

  Returns true if the contract is paused, and false otherwise.

  #### burn

  

  Destroys `amount` tokens from the caller.
See {ERC20-_burn}.

    uint256 amount 
  #### burnFrom

  

  Destroys `amount` tokens from `account`, deducting from the caller's
allowance.
See {ERC20-_burn} and {ERC20-allowance}.
Requirements:
- the caller must have allowance for ``accounts``'s tokens of at least
`amount`.

    address account 
    uint256 amount 
  #### name → string

  

  Returns the name of the token.

  #### symbol → string

  

  Returns the symbol of the token, usually a shorter version of the
name.

  #### totalSupply → uint256

  

  See {IERC20-totalSupply}.

  #### balanceOf → uint256

  

  See {IERC20-balanceOf}.

    address account 
  #### transfer → bool

  

  See {IERC20-transfer}.
Requirements:
- `recipient` cannot be the zero address.
- the caller must have a balance of at least `amount`.

    address recipient 
    uint256 amount 
  #### allowance → uint256

  

  See {IERC20-allowance}.

    address owner 
    address spender 
  #### approve → bool

  

  See {IERC20-approve}.
Requirements:
- `spender` cannot be the zero address.

    address spender 
    uint256 amount 
  #### transferFrom → bool

  

  See {IERC20-transferFrom}.
Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {ERC20}.
Requirements:
- `sender` and `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.
- the caller must have allowance for ``sender``'s tokens of at least
`amount`.

    address sender 
    address recipient 
    uint256 amount 
  #### increaseAllowance → bool

  

  Atomically increases the allowance granted to `spender` by the caller.
This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.
Emits an {Approval} event indicating the updated allowance.
Requirements:
- `spender` cannot be the zero address.

    address spender 
    uint256 addedValue 
  #### decreaseAllowance → bool

  

  Atomically decreases the allowance granted to `spender` by the caller.
This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.
Emits an {Approval} event indicating the updated allowance.
Requirements:
- `spender` cannot be the zero address.
- `spender` must have allowance for the caller of at least
`subtractedValue`.

    address spender 
    uint256 subtractedValue 
  #### supportsInterface → bool

  

  See {IERC165-supportsInterface}.

    bytes4 interfaceId 
  #### getRoleMember → address

  

  Returns one of the accounts that have `role`. `index` must be a
value between 0 and {getRoleMemberCount}, non-inclusive.
Role bearers are not sorted in any particular way, and their ordering may
change at any point.
WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
you perform all queries on the same block. See the following
https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
for more information.

    bytes32 role 
    uint256 index 
  #### getRoleMemberCount → uint256

  

  Returns the number of accounts that have `role`. Can be used
together with {getRoleMember} to enumerate all bearers of a role.

    bytes32 role 
  #### grantRole

  

  Overload {grantRole} to track enumerable memberships

    bytes32 role 
    address account 
  #### revokeRole

  

  Overload {revokeRole} to track enumerable memberships

    bytes32 role 
    address account 
  #### renounceRole

  

  Overload {renounceRole} to track enumerable memberships

    bytes32 role 
    address account 
  #### hasRole → bool

  

  Returns `true` if `account` has been granted `role`.

    bytes32 role 
    address account 
  #### getRoleAdmin → bytes32

  

  Returns the admin role that controls `role`. See {grantRole} and
{revokeRole}.
To change a role's admin, use {_setRoleAdmin}.

    bytes32 role 


