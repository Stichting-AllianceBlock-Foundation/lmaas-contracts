import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import CompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/CompoundingRewardsPool.sol/CompoundingRewardsPool.json';
import AutoStakeArtifact from '../artifacts/contracts/autostake-features/AutoStake.sol/AutoStake.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { CompoundingRewardsPool } from '../typechain/CompoundingRewardsPool';
import { AutoStake } from '../typechain/AutoStake';
import { TestERC20 } from '../typechain/TestERC20';
import { getTime, timeTravel } from './utils';

describe('AutoStake', () => {
  let accounts: SignerWithAddress[];
  let CompoundingRewardsPoolInstance: CompoundingRewardsPool;
  let AutoStakingInstance: AutoStake;
  let stakingTokenInstance: TestERC20;

  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let staker: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account] = accounts;
    staker = testAccount;
  });

  let startTimestamp: number;
  let endTimestamp: number;

  let throttleRoundSeconds = 20;
  const oneMinute: number = 60;

  const amount: BigNumber = ethers.utils.parseEther('5184000');
  const bOne: BigNumber = ethers.utils.parseEther('1');
  const standardStakingAmount: BigNumber = ethers.utils.parseEther('5');
  const contractStakeLimit = amount;

  describe('Deploy and Connect', async function () {
    beforeEach(async () => {
      const currentTimestamp = await getTime();
      startTimestamp = currentTimestamp + oneMinute;
      endTimestamp = startTimestamp + oneMinute * 2;
    });

    it('[Should deploy and connect the two tokens]:', async () => {
      stakingTokenInstance = (await deployContract(staker, TestERC20Artifact, [amount])) as TestERC20;

      AutoStakingInstance = (await deployContract(staker, AutoStakeArtifact, [
        stakingTokenInstance.address,
        throttleRoundSeconds,
        bOne,
        contractStakeLimit,
      ])) as AutoStake;

      CompoundingRewardsPoolInstance = (await deployContract(staker, CompoundingRewardsPoolArtifact, [
        stakingTokenInstance.address,
        [stakingTokenInstance.address],
        AutoStakingInstance.address,
        contractStakeLimit,
      ])) as CompoundingRewardsPool;

      await AutoStakingInstance.setPool(CompoundingRewardsPoolInstance.address);

      const stakingToken = await AutoStakingInstance.stakingToken();
      expect(stakingToken).to.equal(stakingTokenInstance.address);

      const rewardPool = await AutoStakingInstance.rewardPool();
      expect(rewardPool).to.equal(CompoundingRewardsPoolInstance.address);
    });

    it('[Should fail setting the pool from not owner]:', async () => {
      let AutoStakingInstanceNew: AutoStake = (await deployContract(staker, AutoStakeArtifact, [
        stakingTokenInstance.address,
        throttleRoundSeconds,
        bOne,
        contractStakeLimit,
      ])) as AutoStake;

      let CompoundingRewardsPoolInstanceNew: CompoundingRewardsPool = (await deployContract(
        staker,
        CompoundingRewardsPoolArtifact,
        [stakingTokenInstance.address, [stakingTokenInstance.address], AutoStakingInstance.address, contractStakeLimit]
      )) as CompoundingRewardsPool;

      await expect(
        AutoStakingInstanceNew.connect(test1Account).setPool(CompoundingRewardsPoolInstanceNew.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Staking', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(staker, TestERC20Artifact, [amount])) as TestERC20;

      const currentTimestamp = await getTime();
      startTimestamp = currentTimestamp + oneMinute;
      endTimestamp = startTimestamp + oneMinute * 2;

      AutoStakingInstance = (await deployContract(staker, AutoStakeArtifact, [
        stakingTokenInstance.address,
        throttleRoundSeconds,
        bOne,
        contractStakeLimit,
      ])) as AutoStake;

      CompoundingRewardsPoolInstance = (await deployContract(staker, CompoundingRewardsPoolArtifact, [
        stakingTokenInstance.address,
        [stakingTokenInstance.address],
        AutoStakingInstance.address,
        contractStakeLimit,
      ])) as CompoundingRewardsPool;

      await AutoStakingInstance.setPool(CompoundingRewardsPoolInstance.address);
      await stakingTokenInstance.mint(staker.address, amount);
      await stakingTokenInstance.mint(test1Account.address, amount);

      await stakingTokenInstance.mint(CompoundingRewardsPoolInstance.address, amount);

      await CompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp, [bOne]);
      await AutoStakingInstance.start(endTimestamp);

      await stakingTokenInstance.connect(staker).approve(AutoStakingInstance.address, standardStakingAmount);
      await stakingTokenInstance.connect(test1Account).approve(AutoStakingInstance.address, standardStakingAmount);
      await timeTravel(69);
    });

    it('[Should successfully stake]:', async () => {
      await AutoStakingInstance.connect(staker).stake(standardStakingAmount);
      const totalStakedAmount = await CompoundingRewardsPoolInstance.totalStaked();
      const userInfo = await CompoundingRewardsPoolInstance.userInfo(AutoStakingInstance.address);
      const userRewardDebt = await CompoundingRewardsPoolInstance.getUserRewardDebt(AutoStakingInstance.address, 0);
      const userOwedToken = await CompoundingRewardsPoolInstance.getUserOwedTokens(AutoStakingInstance.address, 0);
      const userBalance = await AutoStakingInstance.balanceOf(staker.address);
      const userShares = await AutoStakingInstance.share(staker.address);

      expect(totalStakedAmount).to.equal(standardStakingAmount);
      expect(userInfo.amountStaked).to.equal(standardStakingAmount);
      expect(userInfo.firstStakedTimestamp).to.gt(startTimestamp);
      expect(userRewardDebt).to.equal(0);
      expect(userOwedToken).to.equal(0);
      expect(userBalance).to.equal(standardStakingAmount);
      expect(userShares).to.equal(standardStakingAmount);
    });

    it('[Should accumulate reward]:', async () => {
      await AutoStakingInstance.connect(staker).stake(standardStakingAmount);
      const stakeTime = await getTime();

      await timeTravel(10);
      const checkTime = await getTime();
      const accumulatedReward = await CompoundingRewardsPoolInstance.getUserAccumulatedReward(
        AutoStakingInstance.address,
        0,
        checkTime
      );

      expect(accumulatedReward).to.equal(bOne.mul(checkTime - stakeTime));
      await timeTravel(10);

      await AutoStakingInstance.refreshAutoStake();
      const refreshTime = await getTime();

      const userBalance = await AutoStakingInstance.balanceOf(staker.address);
      const userShares = await AutoStakingInstance.share(staker.address);
      expect(userBalance).to.equal(standardStakingAmount.add(bOne.mul(refreshTime - stakeTime)));
      expect(userShares).to.equal(standardStakingAmount);
    });

    it('[Should accumulate with two stakers]:', async () => {
      await AutoStakingInstance.connect(staker).stake(standardStakingAmount);
      await timeTravel(10);
      await AutoStakingInstance.connect(test1Account).stake(standardStakingAmount);
      await timeTravel(10);

      await timeTravel(10);
      await AutoStakingInstance.refreshAutoStake();

      const userBalance = await AutoStakingInstance.balanceOf(staker.address);
      const bobBalance = await AutoStakingInstance.balanceOf(test1Account.address);
      const userShares = await AutoStakingInstance.share(staker.address);
      const bobShares = await AutoStakingInstance.share(test1Account.address);
      const valuePerShare = await AutoStakingInstance.valuePerShare();

      expect(userBalance).to.gt(standardStakingAmount.add(bOne));
      expect(bobBalance).to.gt(standardStakingAmount);
      expect(userShares).to.equal(standardStakingAmount);
      expect(bobShares).to.lt(standardStakingAmount);
      expect(valuePerShare).to.gt(bOne);
    });

    describe('Exiting', async function () {
      describe('Interaction Mechanics', async function () {
        beforeEach(async () => {
          await AutoStakingInstance.connect(staker).stake(standardStakingAmount);
        });

        it('[Should not exit before end of campaign]:', async () => {
          await timeTravel(10);
          await expect(AutoStakingInstance.exit()).revertedWith(
            'onlyUnlocked::cannot perform this action until the end of the lock'
          );
        });

        it('[Should request exit successfully]:', async () => {
          await timeTravel(190);

          await AutoStakingInstance.exit();
          const userBalanceAfter = await AutoStakingInstance.balanceOf(staker.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(staker.address);
          expect(userExitInfo.exitStake).to.equal(standardStakingAmount.add(bOne.mul(100)));
          expect(userBalanceAfter).to.equal(0);
        });

        it('[Should not get twice reward on exit twice]:', async () => {
          await timeTravel(190);

          await AutoStakingInstance.exit();
          await AutoStakingInstance.exit();

          const userBalanceAfter = await AutoStakingInstance.balanceOf(staker.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(staker.address);

          expect(userExitInfo.exitStake).to.equal(standardStakingAmount.add(bOne.mul(100)));
          expect(userBalanceAfter).to.equal(0);
        });
      });

      describe('Completing Exit', async function () {
        beforeEach(async () => {
          await AutoStakingInstance.connect(staker).stake(standardStakingAmount);
        });

        it('[Should not complete early]:', async () => {
          await timeTravel(190);

          await AutoStakingInstance.exit();
          await expect(AutoStakingInstance.completeExit()).revertedWith('finalizeExit::Trying to exit too early');
        });

        it('[Should complete succesfully]:', async () => {
          await timeTravel(190);
          await AutoStakingInstance.exit();

          await timeTravel(300);

          const userBalanceBefore = await stakingTokenInstance.balanceOf(staker.address);

          await AutoStakingInstance.completeExit();

          const userBalanceAfter = await stakingTokenInstance.balanceOf(staker.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(staker.address);

          expect(userExitInfo.exitStake).to.equal(0);
          expect(userBalanceAfter).to.equal(userBalanceBefore.add(standardStakingAmount.add(bOne.mul(100))));
        });
      });
    });
  });
});
