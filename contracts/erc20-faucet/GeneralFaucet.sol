// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Context.sol';

interface IFaucet {
    function faucet(address _mintTo, uint256 _amountOrId) external;
}

contract GeneralFaucet is Context, AccessControl {
    enum FaucetType {
        ERC20,
        ERC721,
        ERC1155
    }

    mapping(uint256 => address) public ERC20Faucets;
    mapping(uint256 => address) public ERC721Faucets;
    mapping(uint256 => address) public ERC1155Faucets;

    uint256 public countERC20Facets;
    uint256 public countERC721Facets;
    uint256 public countERC1155Facets;

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
    ) external returns (bool) {
        for (uint256 i; i < countERC1155Facets; i++) {
            for (uint256 j; j < _faucetToMint.length; j++) {
                if (ERC1155Faucets[i] == _faucetToMint[j]) {
                    IFaucet(_faucetToMint[j]).faucet(_mintTo, _idToMint);
                    return true;
                }
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
    ) external returns (bool) {
        for (uint256 i; i < countERC721Facets; i++) {
            for (uint256 j; j < _faucetToMint.length; j++) {
                if (ERC721Faucets[i] == _faucetToMint[j]) {
                    IFaucet(_faucetToMint[j]).faucet(_mintTo, _idToMint);
                    return true;
                }
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
    ) external returns (bool) {
        for (uint256 i; i < countERC20Facets; i++) {
            for (uint256 j; j < _faucetToMint.length; j++) {
                if (ERC20Faucets[i] == _faucetToMint[j]) {
                    IFaucet(_faucetToMint[j]).faucet(_mintTo, _amountToMint);
                    return true;
                }
            }
        }

        return false;
    }

    /*
     * @notice add a faucet to the list of faucets.
     */
    function addFaucet(address _faucet, FaucetType _typeFacet) external onlyRole(MANAGER_ROLE) returns (bool) {
        if (_typeFacet == FaucetType.ERC20) {
            ERC20Faucets[countERC20Facets] = _faucet;
            countERC20Facets++;
            return true;
        } else if (_typeFacet == FaucetType.ERC721) {
            ERC721Faucets[countERC721Facets] = _faucet;
            countERC721Facets++;
            return true;
        } else if (_typeFacet == FaucetType.ERC1155) {
            ERC1155Faucets[countERC1155Facets] = _faucet;
            countERC1155Facets++;
            return true;
        }

        return false;
    }

    /*
     * @notice remove a faucet from the list of faucets.
     */
    function deleteFaucet(address _faucet, FaucetType _typeFacet) external onlyRole(MANAGER_ROLE) returns (bool) {
        if (_typeFacet == FaucetType.ERC20) {
            for (uint256 i; i < countERC20Facets; i++) {
                if (ERC20Faucets[i] == _faucet) {
                    ERC20Faucets[i] = ERC20Faucets[countERC20Facets - 1];
                    delete ERC20Faucets[countERC20Facets - 1];
                    countERC20Facets--;

                    return true;
                }
            }
        } else if (_typeFacet == FaucetType.ERC721) {
            for (uint256 i; i < countERC721Facets; i++) {
                if (ERC721Faucets[i] == _faucet) {
                    ERC721Faucets[i] = ERC721Faucets[countERC721Facets - 1];
                    delete ERC721Faucets[countERC721Facets - 1];
                    countERC721Facets--;

                    return true;
                }
            }
        } else if (_typeFacet == FaucetType.ERC1155) {
            for (uint256 i; i < countERC1155Facets; i++) {
                if (ERC1155Faucets[i] == _faucet) {
                    ERC1155Faucets[i] = ERC1155Faucets[countERC1155Facets - 1];
                    delete ERC1155Faucets[countERC1155Facets - 1];
                    countERC1155Facets--;

                    return true;
                }
            }
        }

        return false;
    }
}
