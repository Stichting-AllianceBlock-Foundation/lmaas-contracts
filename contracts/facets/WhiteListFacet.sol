// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from '../libraries/LibDiamond.sol';

contract WhiteListFacet {
    function facetWhiteListed(address _facet) external view returns (bool) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        for (uint256 facetIndex; facetIndex < ds.whiteListedFacetsCount; facetIndex++) {
            if (_facet == ds.whiteListFacets[facetIndex].facetAddress) {
                return true;
            }
        }
        return false;
    }

    function changeMasterDiamond(address _newDiamond) external {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.setMasterDiamond(_newDiamond);
    }

    function checkWhiteListFacet(uint256 _indexFacet) external view returns (LibDiamond.WhiteListedFacet memory) {
        return LibDiamond.diamondStorage().whiteListFacets[_indexFacet];
    }

    function masterDiamond() external view returns (address masterDiamond_) {
        masterDiamond_ = LibDiamond.masterDiamond();
    }

    function addFacetToWhiteList(LibDiamond.WhiteListedFacet memory _facet) external returns (bool added_) {
        require(LibDiamond.masterDiamond() == address(0), 'addFacetToWhiteList: NOT_THE_MASTER_DIAMOND');
        LibDiamond.addFacetToWhileList(_facet);
        added_ = true;
    }

    function removeFacetToWhiteList(uint256 _indexWhiteListed) external returns (bool removed_) {
        require(LibDiamond.masterDiamond() == address(0), 'removeFacetToWhiteList: NOT_THE_MASTER_DIAMOND');
        LibDiamond.removeFacetFromWhiteList(_indexWhiteListed);
        removed_ = true;
    }
}
