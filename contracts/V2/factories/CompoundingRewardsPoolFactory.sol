// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './../../interfaces/IERC20Detailed.sol';
import './../../SafeERC20Detailed.sol';
import './../CompoundingRewardsPool.sol';
import './../CompoundingRewardsPoolStaker.sol';
import './StakeTransferEnabledFactory.sol';

contract CompoundingRewardsPoolFactory is AbstractPoolsFactory, StakeTransferEnabledFactory {
    using SafeERC20Detailed for IERC20Detailed;

    /* ========== Permissioned FUNCTIONS ========== */

    function deploy(
        address _stakingToken,
        uint256 _startTimestamp,
        uint256 _endTimestamp,
        uint256 _rewardPerBlock,
        uint256 _stakeLimit,
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 _virtualBlockTime
    ) external onlyOwner {
        require(
            _stakingToken != address(0),
            "CompoundingRewardsPoolFactory::deploy: Staking token address can't be zero address"
        );

        require(_rewardPerBlock != 0, 'CompoundingRewardsPoolFactory::deploy: Reward per block must be more than 0');

        require(_stakeLimit != 0, 'CompoundingRewardsPoolFactory::deploy: Stake limit must be more than 0');

        require(
            _throttleRoundBlocks != 0,
            'CompoundingRewardsPoolFactory::deploy: Throttle round blocks must be more than 0'
        );

        require(
            _throttleRoundCap != 0,
            'CompoundingRewardsPoolFactory::deploy: Throttle round cap must be more than 0'
        );

        CompoundingRewardsPoolStaker autoStaker = new CompoundingRewardsPoolStaker(
            _stakingToken,
            _throttleRoundBlocks,
            _throttleRoundCap,
            _endTimestamp,
            _stakeLimit,
            _virtualBlockTime
        );

        address[] memory rewardTokens = new address[](1);
        rewardTokens[0] = _stakingToken;

        uint256[] memory rewardsPerBlock = new uint256[](1);
        rewardsPerBlock[0] = _rewardPerBlock;

        CompoundingRewardsPool rewardsPool = new CompoundingRewardsPool(
            IERC20Detailed(_stakingToken),
            rewardTokens,
            address(autoStaker),
            _startTimestamp,
            _endTimestamp,
            rewardsPerBlock,
            _virtualBlockTime
        );

        autoStaker.setPool(address(rewardsPool));

        uint256 rewardsAmount = calculateRewardsAmount(
            _startTimestamp,
            _endTimestamp,
            _rewardPerBlock,
            _virtualBlockTime
        );
        IERC20Detailed(_stakingToken).safeTransfer(address(rewardsPool), rewardsAmount);

        rewardsPools.push(address(autoStaker));
    }
}
