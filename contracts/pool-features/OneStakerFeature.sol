// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import './../RewardsPoolBase.sol';

/** @dev Only allows one whitelisted address to stake, this is used for compounding rewards pool
 */
abstract contract OneStakerFeature is RewardsPoolBase {
    address public immutable staker;

    constructor(address _staker) {
        require(
            _staker != address(0),
            "OneStakerFeature::setSconstructortaker new staker address can't be zero address"
        );
        staker = _staker;
    }

    modifier onlyStaker() {
        require(msg.sender == staker, 'onlyStaker::incorrect staker');
        _;
    }

    function stake(uint256 _tokenAmount) public payable virtual override(RewardsPoolBase) onlyStaker {
        RewardsPoolBase.stake(_tokenAmount);
    }
}
