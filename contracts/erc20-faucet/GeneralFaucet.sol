// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';

interface IFaucet {
    function faucet(address _mintTo, uint256 _amountOrId) external;
}

contract GeneralFaucet is Context, AccessControl {
    enum FaucetType {
        ERC20,
        ERC721,
        ERC1155
    }

    mapping(address => bool) public ERC20Faucets;
    mapping(address => bool) public ERC721Faucets;
    mapping(address => bool) public ERC1155Faucets;

    bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MANAGER_ROLE, _msgSender());
    }

    /*
     * @notice mint multiple tokens to a specific address.
     * @param _faucetToMint the addresses of the faucets to mint.
     * @param _mintTo the address to mint to.
     * @param _idToMint the id of the NFT to mint.
     */
    function faucetERC1155MintToMultiple(
        address[] calldata _faucetToMint,
        address _mintTo,
        uint256 _idToMint
    ) external returns (bool minted) {
        for (uint256 i; i < _faucetToMint.length; i++) {
            address faucetToMint = _faucetToMint[i];

            if (ERC1155Faucets[faucetToMint]) {
                IFaucet(faucetToMint).faucet(_mintTo, _idToMint);
                minted = true;
            }
        }

        return false;
    }

    /*
     * @notice mint multiple tokens to a specific address.
     * @param _faucetToMint the addresses of the faucets to mint.
     * @param _mintTo the address to mint to.
     * @param _idToMint the id of the NFT to mint.
     */
    function faucetERC721MintToMultiple(
        address[] calldata _faucetToMint,
        address _mintTo,
        uint256 _idToMint
    ) external returns (bool minted) {
        for (uint256 i; i < _faucetToMint.length; i++) {
            address faucetToMint = _faucetToMint[i];

            if (ERC721Faucets[faucetToMint]) {
                IFaucet(faucetToMint).faucet(_mintTo, _idToMint);
                minted = true;
            }
        }

        return false;
    }

    /*
     * @notice mint multiple tokens to a specific address.
     * @param _faucetToMint the addresses of the faucets to mint.
     * @param _mintTo the address to mint to.
     * @param _amountToMint the amount to mint.
     */
    function faucetERC20MintToMultiple(
        address[] calldata _faucetToMint,
        address _mintTo,
        uint256 _amountToMint
    ) external returns (bool minted) {
        for (uint256 i; i < _faucetToMint.length; i++) {
            address faucetToMint = _faucetToMint[i];

            if (ERC20Faucets[faucetToMint]) {
                uint8 decimals = IERC20Metadata(faucetToMint).decimals();

                IFaucet(faucetToMint).faucet(_mintTo, _amountToMint * 10**decimals);
                minted = true;
            }
        }

        return false;
    }

    /*
     * @notice add a faucet to the list of faucets.
     */
    function addFaucet(address _faucet, FaucetType _typeFacet) external onlyRole(MANAGER_ROLE) returns (bool) {
        if (_typeFacet == FaucetType.ERC20) {
            ERC20Faucets[_faucet] = true;
            return true;
        } else if (_typeFacet == FaucetType.ERC721) {
            ERC721Faucets[_faucet] = true;
            return true;
        } else if (_typeFacet == FaucetType.ERC1155) {
            ERC1155Faucets[_faucet] = true;
            return true;
        }

        return false;
    }

    /*
     * @notice remove a faucet from the list of faucets.
     */
    function deleteFaucet(address _faucet, FaucetType _typeFacet) external onlyRole(MANAGER_ROLE) returns (bool) {
        if (_typeFacet == FaucetType.ERC20) {
            if (ERC20Faucets[_faucet]) {
                ERC20Faucets[_faucet] = false;

                return true;
            }
        } else if (_typeFacet == FaucetType.ERC721) {
            if (ERC721Faucets[_faucet]) {
                ERC721Faucets[_faucet] = false;

                return true;
            }
        } else if (_typeFacet == FaucetType.ERC1155) {
            if (ERC1155Faucets[_faucet]) {
                ERC1155Faucets[_faucet] = false;

                return true;
            }
        }

        return false;
    }
}
