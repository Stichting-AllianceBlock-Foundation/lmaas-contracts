// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import './ERC20Faucet.sol';

contract GeneralFaucet is Context, AccessControl {
    mapping(uint256 => address) public faucetsToMint;
    uint256 public countOfFacets;
    bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /*
     * @notice mint a token to a msg.sender.
     * @param _faucetToMint the address of the faucet to mint.
     * @param _amountToMint the amount to mint.
     */
    function faucet(address _faucetToMint, uint256 _amountToMint) external returns (bool) {
        for (uint256 i; i < countOfFacets; i++) {
            if (faucetsToMint[i] == _faucetToMint) {
                ERC20Faucet(_faucetToMint).faucet(_msgSender(), _amountToMint);
                return true;
            }
        }

        return false;
    }

    /*
     * @notice mint multiple tokens to a specific address.
     * @param _faucetToMint the address of the faucet to mint.
     * @param _mintTo the address to mint to.
     * @param _amountToMint the amount to mint.
     */
    function faucetMintTo(
        address _faucetToMint,
        address _mintTo,
        uint256 _amountToMint
    ) external returns (bool) {
        for (uint256 i; i < countOfFacets; i++) {
            if (faucetsToMint[i] == _faucetToMint) {
                ERC20Faucet(_faucetToMint).faucet(_mintTo, _amountToMint);
                return true;
            }
        }

        return false;
    }

    /*
     * @notice mint multiple tokens to a msg.sender.
     * @param _faucetToMint the addresses of the faucets to mint.
     * @param _amountToMint the amount to mint.
     */
    function faucetMultiple(address[] calldata _faucetToMint, uint256 _amountToMint) external returns (bool) {
        for (uint256 i; i < countOfFacets; i++) {
            for (uint256 j; j < _faucetToMint.length; j++) {
                if (faucetsToMint[i] == _faucetToMint[j]) {
                    ERC20Faucet(_faucetToMint[j]).faucet(_msgSender(), _amountToMint);
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
    function faucetMintToMultiple(
        address[] calldata _faucetToMint,
        address _mintTo,
        uint256 _amountToMint
    ) external returns (bool) {
        for (uint256 i; i < countOfFacets; i++) {
            for (uint256 j; j < _faucetToMint.length; j++) {
                if (faucetsToMint[i] == _faucetToMint[j]) {
                    ERC20Faucet(_faucetToMint[j]).faucet(_mintTo, _amountToMint);
                    return true;
                }
            }
        }

        return false;
    }

    /*
     * @notice add a faucet to the list of faucets.
     */
    function addFaucet(address _faucet) external onlyRole(MANAGER_ROLE) returns (bool) {
        faucetsToMint[countOfFacets] = _faucet;
        countOfFacets++;
        return true;
    }

    /*
     * @notice remove a faucet from the list of faucets.
     */
    function deleteFaucet(address _faucet) external onlyRole(MANAGER_ROLE) returns (bool) {
        for (uint256 i; i < countOfFacets; i++) {
            if (faucetsToMint[i] == _faucet) {
                faucetsToMint[i] = faucetsToMint[countOfFacets - 1];
                delete faucetsToMint[countOfFacets - 1];
                countOfFacets--;

                return true;
            }
        }

        return false;
    }
}
