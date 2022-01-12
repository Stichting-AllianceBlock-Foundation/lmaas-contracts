// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import './interfaces/IERC20Detailed.sol';
import './SafeERC20Detailed.sol';

abstract contract ThrottledExit {
    using SafeERC20Detailed for IERC20Detailed;

    uint256 public nextAvailableExitTimestamp;
    uint256 public nextAvailableRoundExitVolume;
    uint256 public throttleRoundSeconds;
    uint256 public throttleRoundCap;
    uint256 public campaignEndTimestamp;

    struct ExitInfo {
        uint256 exitTimestamp;
        uint256 exitStake;
        uint256[] rewards;
    }

    mapping(address => ExitInfo) public exitInfo;

    event ExitRequested(address user, uint256 exitTimestamp);
    event ExitCompleted(address user, uint256 stake);

    function setThrottleParams(uint256 _throttleRoundSeconds, uint256 _throttleRoundCap) internal {
        require(_throttleRoundSeconds > 0, 'setThrottle::throttle round seconds must be more than 0');
        require(_throttleRoundCap > 0, 'setThrottle::throttle round cap must be more than 0');
        require(
            throttleRoundSeconds == 0 && throttleRoundCap == 0,
            'setThrottle::throttle parameters were already set'
        );
        throttleRoundSeconds = _throttleRoundSeconds;
        throttleRoundCap = _throttleRoundCap;
    }

    function startThrottle(uint256 _throttleStart) internal {
        campaignEndTimestamp = _throttleStart;
        nextAvailableExitTimestamp = campaignEndTimestamp + throttleRoundSeconds;
    }

    function initiateExit(
        uint256 amountStaked,
        uint256 _rewardsTokensLength,
        uint256[] memory _tokensOwed
    ) internal virtual {
        initialiseExitInfo(msg.sender, _rewardsTokensLength);

        ExitInfo storage info = exitInfo[msg.sender];
        info.exitTimestamp = getAvailableExitTime(amountStaked);
        info.exitStake = info.exitStake + amountStaked;

        for (uint256 i = 0; i < _rewardsTokensLength; i++) {
            info.rewards[i] = info.rewards[i] + _tokensOwed[i];
        }

        emit ExitRequested(msg.sender, info.exitTimestamp);
    }

    function finalizeExit(address _stakingToken, address[] memory _rewardsTokens) internal virtual {
        ExitInfo storage info = exitInfo[msg.sender];
        require(block.timestamp > info.exitTimestamp, 'finalizeExit::Trying to exit too early');

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

    function getAvailableExitTime(uint256 exitAmount) internal returns (uint256 exitTimestamp) {
        uint256 currentTimestamp = block.timestamp;

        if (currentTimestamp > nextAvailableExitTimestamp) {
            // We've passed the next available timestamp and need to readjust
            uint256 secondsFromCurrentRound = (currentTimestamp - nextAvailableExitTimestamp) % throttleRoundSeconds; // Find how many seconds have passed since last round should have started
            nextAvailableExitTimestamp = currentTimestamp - secondsFromCurrentRound + throttleRoundSeconds; // Find where the lst round should have started and add one round to find the next one
            nextAvailableRoundExitVolume = exitAmount; // Reset volume
            return nextAvailableExitTimestamp;
        } else {
            // We are still before the next available timestamp
            nextAvailableRoundExitVolume = nextAvailableRoundExitVolume + exitAmount; // Add volume
        }

        exitTimestamp = nextAvailableExitTimestamp;

        if (nextAvailableRoundExitVolume >= throttleRoundCap) {
            // If cap reached
            nextAvailableExitTimestamp = nextAvailableExitTimestamp + throttleRoundSeconds; // update next exit timestamp.
            // Note we know that this behaviour will lead to people exiting a bit more than the cap when the last user does not hit perfectly the cap. This is OK
            nextAvailableRoundExitVolume = 0; // Reset volume
        }
    }

    /** @dev Returns the amount of reward tokens that are pending for exit for this user
     * @param _tokenIndex The index of the reward to check
     */
    function getPendingReward(uint256 _tokenIndex) external view returns (uint256) {
        ExitInfo storage info = exitInfo[msg.sender];
        return info.rewards[_tokenIndex];
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
}
