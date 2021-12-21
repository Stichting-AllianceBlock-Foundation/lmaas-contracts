// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './SafeERC20Detailed.sol';
import './interfaces/IERC20Detailed.sol';

abstract contract TreasuryOperated {
    using SafeERC20Detailed for IERC20Detailed;

    mapping(address => uint256) public externalRewards;
    address public immutable treasury;

    event StakeWithdrawn(uint256 amount);
    event ExternalRewardsAdded(address indexed from, address token, uint256 reward);
    event ExternalRewardsClaimed(address receiver);

    modifier onlyTreasury() {
        require(msg.sender == treasury, 'onlyTreasury::Not called by the treasury');
        _;
    }

    constructor(address _treasury) {
        require(_treasury != address(0x0), 'setTreasury::Treasury cannot be 0');
        treasury = _treasury;
    }

    function withdrawStake(uint256 amount) public virtual onlyTreasury {
        emit StakeWithdrawn(amount);
    }

    function notifyExternalReward(address token, uint256 reward) internal virtual {
        IERC20Detailed(token).safeTransferFrom(msg.sender, address(this), reward);
        externalRewards[token] = externalRewards[token] + reward;
        emit ExternalRewardsAdded(msg.sender, token, reward);
    }

    function claimExternalRewards() internal virtual {
        emit ExternalRewardsClaimed(msg.sender);
    }
}
