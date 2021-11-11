// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;
import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';

contract TestERC20 is ERC20PresetMinterPauser {
    constructor(uint256 amount) public ERC20PresetMinterPauser('Test ERC20', 'TEST') {
        _mint(msg.sender, amount);
    }
}
