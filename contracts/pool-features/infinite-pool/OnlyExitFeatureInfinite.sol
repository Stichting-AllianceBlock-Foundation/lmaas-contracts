// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../../infinite-pool/RewardsPoolBaseInfinite.sol';

/** @dev Only allows exits, no claims or withdrawals.
 */
abstract contract OnlyExitFeatureInfinite is RewardsPoolBaseInfinite {
    //Without the passed argument the function is not overriden
    function withdraw(uint256) public virtual override {
        revert('OnlyExitFeature::cannot withdraw from this contract. Only exit.');
    }

    function claim() public virtual override {
        revert('OnlyExitFeature::cannot claim from this contract. Only exit.');
    }
}
