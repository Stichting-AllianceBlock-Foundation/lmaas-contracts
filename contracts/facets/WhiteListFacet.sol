// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from '../libraries/LibDiamond.sol';
import {LibWhiteList} from '../libraries/LibWhiteList.sol';

contract WhiteListFacet {
    modifier onlyMasterDiamond() {
        require(LibWhiteList.masterDiamond() == address(0), 'whiteListFacet: NOT_THE_MASTER_DIAMOND');
        _;
    }

    function facetWhiteListed(address _facet) external view returns (bool) {
        LibWhiteList.WhiteListStorage storage ws = LibWhiteList.whiteListStorage();
        return ws.whiteListFacets[_facet];
    }

    function changeMasterDiamond(address _newDiamond) external {
        LibDiamond.enforceIsContractOwner();
        LibWhiteList.setMasterDiamond(_newDiamond);
    }

    function masterDiamond() external view returns (address masterDiamond_) {
        masterDiamond_ = LibWhiteList.masterDiamond();
    }

    function addFacetToWhiteList(address _facet) external onlyMasterDiamond returns (bool added_) {
        LibWhiteList.addFacetToWhileList(_facet);
        added_ = true;
    }

    function removeFacetFromWhiteList(address _facet) external onlyMasterDiamond returns (bool removed_) {
        LibWhiteList.removeFacetFromWhiteList(_facet);
        removed_ = true;
    }
}
