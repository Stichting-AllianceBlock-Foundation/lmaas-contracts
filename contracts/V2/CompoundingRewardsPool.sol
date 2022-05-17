// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './../RewardsPoolBase.sol';
import './../pool-features/OneStakerFeature.sol';

/** @dev The underlying staking pool for the compounding rewards pool.
    It only allows one staker to be active, namely the CompoundingRewardsPoolStaker,
    which manages the shares in the pool per user, and stakes for all users at once.
*/
contract CompoundingRewardsPool is RewardsPoolBase, OneStakerFeature {
    constructor(
        IERC20 _stakingToken,
        address[] memory _rewardsTokens,
        address _staker,
        string memory _name,
        address _wrappedNativeToken
    )
        RewardsPoolBase(_stakingToken, _rewardsTokens, type(uint256).max, type(uint256).max, _name, _wrappedNativeToken)
        OneStakerFeature(_staker)
    {}

    /** @dev Stake an amount of tokens
     * @param _tokenAmount The amount to be staked
     */
    function stake(uint256 _tokenAmount) public payable override(RewardsPoolBase, OneStakerFeature) {
        OneStakerFeature.stake(_tokenAmount);
    }

    /// @dev Not allowed
    function extend(uint256, uint256[] calldata) external virtual override(RewardsPoolBase) {
        revert('CompoundingRewardsPool: cannot extend this pool.');
    }
}
