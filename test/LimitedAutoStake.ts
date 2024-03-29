import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import CompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/CompoundingRewardsPool.sol/CompoundingRewardsPool.json';
import LimitedAutoStakeArtifact from '../artifacts/contracts/autostake-features/LimitedAutoStake.sol/LimitedAutoStake.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { LimitedAutoStake } from '../typechain/LimitedAutoStake';
import { TestERC20 } from '../typechain/TestERC20';
import { getTime, timeTravel } from './utils';
import { CompoundingRewardsPool } from '../typechain/CompoundingRewardsPool';

describe('LimitedAutoStake', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account] = accounts;
  });

  let CompoundingRewardsPoolInstance: CompoundingRewardsPool;
  let AutoStakingInstance: LimitedAutoStake;
  let stakingTokenInstance: TestERC20;

  let startTimestamp: number;
  let endTimestamp: number;

  const oneMinute: number = 60;

  let throttleRoundSeconds: number = 200;

  const day: number = 60 * 24 * 60;
  const amount: BigNumber = ethers.utils.parseEther('5184000');
  const stakeLimit: BigNumber = amount;
  const contractStakeLimit = amount;
  const bOne: BigNumber = ethers.utils.parseEther('1');
  const standardStakingAmount: BigNumber = ethers.utils.parseEther('5'); // 5 tokens

  describe('Deploy and connect', async function () {
    beforeEach(async () => {
      const currentTimestamp = await getTime();
      startTimestamp = currentTimestamp + oneMinute;
      endTimestamp = startTimestamp + oneMinute * 2;
    });

    it('[Should deploy and connect the two tokens]:', async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      AutoStakingInstance = (await deployContract(testAccount, LimitedAutoStakeArtifact, [
        stakingTokenInstance.address,
        throttleRoundSeconds,
        bOne,
        stakeLimit,
        contractStakeLimit,
      ])) as LimitedAutoStake;

      CompoundingRewardsPoolInstance = (await deployContract(testAccount, CompoundingRewardsPoolArtifact, [
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

    it('[Should fail to deploy RewardsPoolBase with 0 staking limit]:', async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      await expect(
        deployContract(testAccount, LimitedAutoStakeArtifact, [
          stakingTokenInstance.address,
          throttleRoundSeconds,
          bOne,
          0,
          contractStakeLimit,
        ])
      ).to.be.revertedWith('LimitedAutoStake: stake limit should not be 0');
    });

    it('[Should fail to deploy RewardsPoolBase with 0 contract staking limit]:', async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      await expect(
        deployContract(testAccount, LimitedAutoStakeArtifact, [
          stakingTokenInstance.address,
          throttleRoundSeconds,
          bOne,
          stakeLimit,
          0,
        ])
      ).to.be.revertedWith('AutoStake: contract stake limit should not be 0');
    });
  });

  describe('Staking', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      const currentTimestamp = await getTime();
      startTimestamp = currentTimestamp + oneMinute;
      endTimestamp = startTimestamp + oneMinute * 2;

      AutoStakingInstance = (await deployContract(testAccount, LimitedAutoStakeArtifact, [
        stakingTokenInstance.address,
        throttleRoundSeconds,
        bOne,
        stakeLimit,
        contractStakeLimit,
      ])) as LimitedAutoStake;

      CompoundingRewardsPoolInstance = (await deployContract(testAccount, CompoundingRewardsPoolArtifact, [
        stakingTokenInstance.address,
        [stakingTokenInstance.address],
        AutoStakingInstance.address,
        contractStakeLimit,
      ])) as CompoundingRewardsPool;

      await AutoStakingInstance.setPool(CompoundingRewardsPoolInstance.address);
      await stakingTokenInstance.mint(testAccount.address, amount);
      await stakingTokenInstance.mint(test2Account.address, amount);

      await stakingTokenInstance.mint(CompoundingRewardsPoolInstance.address, amount);

      await CompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp, [bOne]);
      await AutoStakingInstance.start(endTimestamp);

      await stakingTokenInstance.approve(AutoStakingInstance.address, standardStakingAmount);
      await stakingTokenInstance.connect(test2Account).approve(AutoStakingInstance.address, standardStakingAmount);

      await timeTravel(69);
    });

    it('[Should successfully stake]:', async () => {
      await AutoStakingInstance.stake(standardStakingAmount);
      const stakeTime = await getTime();

      const totalStakedAmount = await CompoundingRewardsPoolInstance.totalStaked();
      const userInfo = await CompoundingRewardsPoolInstance.userInfo(AutoStakingInstance.address);

      const userRewardDebt = await CompoundingRewardsPoolInstance.getUserRewardDebt(AutoStakingInstance.address, 0);
      const userOwedToken = await CompoundingRewardsPoolInstance.getUserOwedTokens(AutoStakingInstance.address, 0);
      const userBalance = await AutoStakingInstance.balanceOf(testAccount.address);
      const userShares = await AutoStakingInstance.share(testAccount.address);

      expect(totalStakedAmount).to.equal(standardStakingAmount);
      expect(userInfo.amountStaked).to.equal(standardStakingAmount);
      expect(userInfo.firstStakedTimestamp).to.equal(stakeTime);
      expect(userRewardDebt).to.equal(0);
      expect(userOwedToken).to.equal(0);
      expect(userBalance).to.equal(standardStakingAmount);
      expect(userShares).to.equal(standardStakingAmount);
    });

    it('[Should fail if amount to stake is more than limit]:', async () => {
      await expect(AutoStakingInstance.stake(stakeLimit.mul(2))).to.be.revertedWith(
        'LimitedAutoStake: user stake limit reache'
      );
    });

    describe('Exiting', async function () {
      describe('Interaction Mechanics', async function () {
        beforeEach(async () => {
          await AutoStakingInstance.stake(standardStakingAmount);
        });

        it('[Should not exit before end of campaign]:', async () => {
          await expect(AutoStakingInstance.exit()).to.be.revertedWith(
            'onlyUnlocked::cannot perform this action until the end of the lock'
          );
        });

        it('[Should request exit successfully]:', async () => {
          await timeTravel(130);

          await AutoStakingInstance.exit();

          const userBalanceAfter = await AutoStakingInstance.balanceOf(testAccount.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(testAccount.address);

          expect(userExitInfo.exitStake).to.equal(standardStakingAmount.add(bOne.mul(100)));
          expect(userBalanceAfter).to.eq(0);
        });

        it('[Should not get twice reward on exit twice]:', async () => {
          await timeTravel(130);

          await AutoStakingInstance.exit();
          await AutoStakingInstance.exit();

          const userBalanceAfter = await AutoStakingInstance.balanceOf(testAccount.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(testAccount.address);

          expect(userExitInfo.exitStake).to.equal(standardStakingAmount.add(bOne.mul(100)));
          expect(userBalanceAfter).to.equal(0);
        });
      });

      describe('Completing Exit', async function () {
        beforeEach(async () => {
          await AutoStakingInstance.stake(standardStakingAmount);
        });

        it('[Should not complete early]:', async () => {
          await timeTravel(130);
          await AutoStakingInstance.exit();
          await expect(AutoStakingInstance.completeExit()).to.be.revertedWith('finalizeExit::Trying to exit too early');
        });

        it('[Should complete succesfully]:', async () => {
          await timeTravel(130);
          await AutoStakingInstance.exit();
          await timeTravel(210);

          const userBalanceBefore = await stakingTokenInstance.balanceOf(testAccount.address);
          await AutoStakingInstance.completeExit();
          const userBalanceAfter = await stakingTokenInstance.balanceOf(testAccount.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(testAccount.address);

          expect(userExitInfo.exitStake).to.equal(0);
          expect(userBalanceAfter).to.equal(userBalanceBefore.add(standardStakingAmount.add(bOne.mul(100))));
        });
      });
    });
  });
});
