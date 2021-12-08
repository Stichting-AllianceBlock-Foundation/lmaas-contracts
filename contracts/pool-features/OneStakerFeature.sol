// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './../RewardsPoolBase.sol';

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

    function stake(uint256 _tokenAmount) public virtual override(RewardsPoolBase) onlyStaker {
        RewardsPoolBase.stake(_tokenAmount);
    }
}
