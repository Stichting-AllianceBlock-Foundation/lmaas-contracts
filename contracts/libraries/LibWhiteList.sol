// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from './LibDiamond.sol';

library LibWhiteList {
  bytes32 constant WHITELIST_STORAGE_POSITION = keccak256('diamond.standard.whitelist.storage');
  
  struct WhiteListStorage {
    // mapping to see which facets are whitelisted
    mapping(address => bool) whiteListFacets;
    // whitelisted alb diamond address
    address masterDiamond;
  }
  
  function whiteListStorage() internal pure returns (WhiteListStorage storage ws) {
    bytes32 position = WHITELIST_STORAGE_POSITION;
    // this is the position in the storage of the whitelist storage
    assembly {
      ws.slot := position
    }
  }
  
  event AddToWhiteList(address indexed facetAddress);
  
  event RemoveFromWhiteList(address indexed facetAddres);
  
  event MasterDiamondTransferred(address indexed previousDiamond, address indexed newDiamond);
  
  function masterDiamond() internal view returns (address masterDiamond_) {
    masterDiamond_ = LibDiamond.diamondStorage().masterDiamond;
  }
  
  function setMasterDiamond(address _newMasterDiamond) internal {
    LibDiamond.enforceIsContractOwner();
    WhiteListStorage storage ws = whiteListStorage();
    address previousDiamond = ws.masterDiamond;
    ws.masterDiamond = _newMasterDiamond;
    emit MasterDiamondTransferred(previousDiamond, _newMasterDiamond);
  }
  
  function addFacetToWhileList(address _facet) internal {
    LibDiamond.enforceIsContractOwner();
    WhiteListStorage storage ws = whiteListStorage();
    ws.whiteListFacets[_facet] = true;
    emit AddToWhiteList(_facet);
  }
  
  function removeFacetFromWhiteList(address _facet) internal {
    LibDiamond.enforceIsContractOwner();
    WhiteListStorage storage ws = whiteListStorage();
    
    require(ws.whiteListFacets[_facet], 'removeFacetFromWhiteList: NO_FAUCET');
    
    emit RemoveFromWhiteList(_facet);
    
    ws.whiteListFacets[_facet] = false;
  }
}
