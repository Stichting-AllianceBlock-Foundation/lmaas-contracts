// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from '../libraries/LibDiamond.sol';

contract WhiteListFacet {
    function facetWhiteListed(address _facet) external view returns (bool) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        return ds.whiteListFacets[_facet];
    }

    function changeMasterDiamond(address _newDiamond) external {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.setMasterDiamond(_newDiamond);
    }

    function masterDiamond() external view returns (address masterDiamond_) {
        masterDiamond_ = LibDiamond.masterDiamond();
    }

    function addFacetToWhiteList(address _facet) external returns (bool added_) {
        require(LibDiamond.masterDiamond() == address(0), 'addFacetToWhiteList: NOT_THE_MASTER_DIAMOND');
        LibDiamond.addFacetToWhileList(_facet);
        added_ = true;
    }

    function removeFacetFromWhiteList(address _facet) external returns (bool removed_) {
        require(LibDiamond.masterDiamond() == address(0), 'removeFacetToWhiteList: NOT_THE_MASTER_DIAMOND');
        LibDiamond.removeFacetFromWhiteList(_facet);
        removed_ = true;
    }
}
