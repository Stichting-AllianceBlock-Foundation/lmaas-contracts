// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ERC721Faucet is ERC721 {
    /*
     * @dev change the name, symbol depending on what token you need.
     */
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function faucet(address _to, uint256 _idToMint) external returns (bool) {
        require(_to != address(0), 'ERC721Faucet: Invalid address');
        _mint(_to, _idToMint);
        return true;
    }
}
