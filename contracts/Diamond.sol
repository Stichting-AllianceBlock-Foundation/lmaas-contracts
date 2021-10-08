// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from './libraries/LibDiamond.sol';
import {LibWhiteList} from './libraries/LibWhiteList.sol';
import {IDiamondCut} from './interfaces/IDiamondCut.sol';

// A efficient way to call external functions from a faucet
//DiamondStorage storage ds = diamondStorage();
//bytes4 functionSelector = bytes4(keccak256("myFunction(uint256)"));
//// get facet address of function
//address facet = ds.selectorToFacet[functionSelector];
//bytes memory myFunctionCall = abi.encodeWithSelector(functionSelector, 4);
//(bool success, uint result) = address(facet).delegatecall(myFunctionCall);
//require(success, "myFunction failed");

contract Diamond {
    constructor(
        address _contractOwner,
        address _diamondCutFacet,
        address _masterDiamond
    ) payable {
        LibDiamond.setContractOwner(_contractOwner);

        /**
          @dev We initialize the _masterDiamond if the
          address of the constructor is different of the address(0).
        **/
        if (_masterDiamond != address(0)) {
            LibWhiteList.setMasterDiamond(address(_masterDiamond));
        }

        // Add the diamondCut external function from the diamondCutFacet
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);
        bytes4[] memory functionSelectors = new bytes4[](1);
        functionSelectors[0] = IDiamondCut.diamondCut.selector;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: _diamondCutFacet,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: functionSelectors
        });
        LibDiamond.diamondCut(cut, address(0), '');
    }

    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = ds.selectorToFacetAndPosition[msg.sig].facetAddress;
        require(facet != address(0), 'Diamond: Function does not exist');
        // Execute external function from facet using delegatecall and return any value.
        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
