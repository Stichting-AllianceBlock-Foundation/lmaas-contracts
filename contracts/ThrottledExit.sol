// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';

abstract contract ThrottledExit {
    using SafeMath for uint256;
    using SafeERC20Detailed for IERC20Detailed;

    uint256 public nextAvailableExitBlock;
    uint256 public nextAvailableRoundExitVolume;
    uint256 public throttleRoundBlocks;
    uint256 public throttleRoundCap;
    uint256 private virtualBlockTime;
    uint256 public campaignEndBlock;

    struct ExitInfo {
        uint256 exitBlock;
        uint256 exitStake;
        uint256[] rewards;
    }

    mapping(address => ExitInfo) public exitInfo;

    event ExitRequested(address user, uint256 exitBlock);
    event ExitCompleted(address user, uint256 stake);

    function setThrottleParams(
        uint256 _throttleRoundBlocks,
        uint256 _throttleRoundCap,
        uint256 throttleStart,
        uint256 _virtualBlockTime
    ) internal {
        require(_throttleRoundBlocks > 0, 'setThrottle::throttle round blocks must be more than 0');
        require(_throttleRoundCap > 0, 'setThrottle::throttle round cap must be more than 0');
        require(throttleRoundBlocks == 0 && throttleRoundCap == 0, 'setThrottle::throttle parameters were already set');
        throttleRoundBlocks = _throttleRoundBlocks;
        throttleRoundCap = _throttleRoundCap;
        virtualBlockTime = _virtualBlockTime;
        campaignEndBlock = _calculateBlock(throttleStart);
        nextAvailableExitBlock = campaignEndBlock.add(throttleRoundBlocks);
    }

    function initiateExit(
        uint256 amountStaked,
        uint256 _rewardsTokensLength,
        uint256[] memory _tokensOwed
    ) internal virtual {
        initialiseExitInfo(msg.sender, _rewardsTokensLength);

        ExitInfo storage info = exitInfo[msg.sender];
        info.exitBlock = getAvailableExitTime(amountStaked);
        info.exitStake = info.exitStake.add(amountStaked);

        for (uint256 i = 0; i < _rewardsTokensLength; i++) {
            info.rewards[i] = info.rewards[i].add(_tokensOwed[i]);
        }

        emit ExitRequested(msg.sender, info.exitBlock);
    }

    function finalizeExit(address _stakingToken, address[] memory _rewardsTokens) internal virtual {
        ExitInfo storage info = exitInfo[msg.sender];
        require(_getCurrentBlock() > info.exitBlock, 'finalizeExit::Trying to exit too early');

        uint256 infoExitStake = info.exitStake;
        info.exitStake = 0;

        IERC20Detailed(_stakingToken).safeTransfer(address(msg.sender), infoExitStake);

        for (uint256 i = 0; i < _rewardsTokens.length; i++) {
            uint256 infoRewards = info.rewards[i];
            info.rewards[i] = 0;
            IERC20Detailed(_rewardsTokens[i]).safeTransfer(msg.sender, infoRewards);
        }

        emit ExitCompleted(msg.sender, infoExitStake);
    }

    function getAvailableExitTime(uint256 exitAmount) internal returns (uint256 exitBlock) {
        uint256 currentBlock = _getCurrentBlock();
        if (currentBlock > nextAvailableExitBlock) {
            // We've passed the next available block and need to readjust
            uint256 blocksFromCurrentRound = (currentBlock - nextAvailableExitBlock) % throttleRoundBlocks; // Find how many blocks have passed since last block should have started
            nextAvailableExitBlock = currentBlock.sub(blocksFromCurrentRound).add(throttleRoundBlocks); // Find where the lst block should have started and add one round to find the next one
            nextAvailableRoundExitVolume = exitAmount; // Reset volume
            return nextAvailableExitBlock;
        } else {
            // We are still before the next available block
            nextAvailableRoundExitVolume = nextAvailableRoundExitVolume.add(exitAmount); // Add volume
        }

        exitBlock = nextAvailableExitBlock;

        if (nextAvailableRoundExitVolume >= throttleRoundCap) {
            // If cap reached
            nextAvailableExitBlock = nextAvailableExitBlock.add(throttleRoundBlocks); // update next exit block.
            // Note we know that this behaviour will lead to people exiting a bit more than the cap when the last user does not hit perfectly the cap. This is OK
            nextAvailableRoundExitVolume = 0; // Reset volume
        }
    }

    function getPendingReward(uint256 tokenIndex) public view returns (uint256) {
        ExitInfo storage info = exitInfo[msg.sender];
        return info.rewards[tokenIndex];
    }

    function initialiseExitInfo(address _userAddress, uint256 tokensLength) private {
        ExitInfo storage info = exitInfo[_userAddress];

        if (info.rewards.length == tokensLength) {
            // Already initialised
            return;
        }

        for (uint256 i = info.rewards.length; i < tokensLength; i++) {
            info.rewards.push(0);
        }
    }

    function _getCurrentBlock() public view returns (uint256) {
        return (block.timestamp.div(virtualBlockTime));
    }

    function _calculateBlock(uint256 _timeInSeconds) internal view returns (uint256) {
        return _timeInSeconds.div(virtualBlockTime);
    }

    function getVirtualBlockTime() public view returns (uint256) {
        return virtualBlockTime;
    }
}
