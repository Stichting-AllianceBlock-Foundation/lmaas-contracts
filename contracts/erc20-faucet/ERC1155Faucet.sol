// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract ERC1155Faucet is ERC1155 {
    /*
     * @dev change the name, symbol and decimals depending on what token you need.
     */
    constructor() ERC1155('') {}

    function faucet(address _to, uint256 _idToMint) external {
        require(_to != address(0), 'ERC20Faucet: Invalid address');
        _mint(_to, _idToMint, 1000000 * 1 ether, '');
    }
}
