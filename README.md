# LMaaS smart contracts

This project contains all smart contracts for LMaaS.
See the [specification](https://drive.google.com/file/d/16P_bKT26j9FsLWzWsdLISOnpMUZ5I2ue/view?usp=sharing) for a detailed explanation of all features.

## Getting started

Run `yarn compile` to compile the contracts and generate typing files.

## Documentation

The project consists of three different kind of staking pools/campaigns. All three use the `RewardsPoolBase` underneath. The `LiquidityMiningCampaign` is the most basic, it only adds a transfer stake feature.

The `NonCompoundingRewardsPool` is a staking pool with a time lock, you have to be in it for at least x amount of time. Therefore it disables claiming/withdrawing, you can only exit when the time is over. The exit happens with a throttling mechansism that makes sure the pool is not exited all at once.

The `CompoundingRewardsPool` is a staking pool that auto compounds the rewards. Instead of having to restake your rewards, this pool keeps track of your share of the stakes and rewards combined.

- [Rewards pool base](docs/RewardsPoolBase.md)
- [Liquidity mining campaign](docs/LiquidityMiningCampaign.md)
- [Non compounding pool](docs/V2/NonCompoundingRewardsPool.md)
- [Compounding pool](docs/V2/CompoundingRewardsPoolStaker.md)
