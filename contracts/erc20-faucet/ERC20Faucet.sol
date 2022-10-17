// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Faucet is ERC20 {
    uint8 private decimals_;

    /*
     * @dev change the name, symbol and decimals depending on what token you need.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) ERC20(_name, _symbol) {
        decimals_ = _decimals;
    }

    function faucet(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    /*
     * @dev override this function to make sure you have the decimals you need.
     */
    function decimals() public view override returns (uint8) {
        return decimals_;
    }
}
