// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from './LibDiamond.sol';

library LibWhiteList {
  
  event AddToWhiteList(address indexed facetAddress);
  
  event RemoveFromWhiteList(address indexed facetAddres);
  
  event MasterDiamondTransferred(address indexed previousDiamond, address indexed newDiamond);
  
  function masterDiamond() internal view returns (address masterDiamond_) {
    masterDiamond_ = LibDiamond.diamondStorage().masterDiamond;
  }
  
  function setMasterDiamond(address _newMasterDiamond) internal {
    LibDiamond.enforceIsContractOwner();
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    address previousDiamond = ds.masterDiamond;
    ds.masterDiamond = _newMasterDiamond;
    emit MasterDiamondTransferred(previousDiamond, _newMasterDiamond);
  }
  
  function addFacetToWhileList(address _facet) internal {
    LibDiamond.enforceIsContractOwner();
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    ds.whiteListFacets[_facet] = true;
    emit AddToWhiteList(_facet);
  }
  
  function removeFacetFromWhiteList(address _facet) internal {
    LibDiamond.enforceIsContractOwner();
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    
    require(ds.whiteListFacets[_facet], 'removeFacetFromWhiteList: NO_FAUCET');
    
    emit RemoveFromWhiteList(_facet);
    
    ds.whiteListFacets[_facet] = false;
  }
}
