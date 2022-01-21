// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../RewardsPoolBase.sol';

abstract contract OnlyExitFeature is RewardsPoolBase {
    //Without the passed argument the function is not overriden
    function withdraw(uint256) public virtual override {
        revert('OnlyExitFeature::cannot withdraw from this contract. Only exit.');
    }

    function claim() public virtual override {
        revert('OnlyExitFeature::cannot claim from this contract. Only exit.');
    }
}
