// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;
import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';

contract TestERC20 is ERC20PresetMinterPauser {
    uint8 private d = 18;

    constructor(uint256 amount) ERC20PresetMinterPauser('Test ERC20', 'TEST') {
        _mint(msg.sender, amount);
    }

    function setDecimals(uint8 _d) public {
        d = _d;
    }

    function decimals() public view override returns (uint8) {
        return d;
    }
}
