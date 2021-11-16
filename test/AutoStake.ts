import { BigNumber } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import OneStakerRewardsPoolArtifact from '../artifacts/contracts/mocks/OneStakerRewardsPoolMock.sol/OneStakerRewardsPoolMock.json';
import AutoStakeArtifact from '../artifacts/contracts/autostake-features/AutoStake.sol/AutoStake.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { OneStakerRewardsPoolMock } from '../typechain-types/OneStakerRewardsPoolMock';
import { AutoStake } from '../typechain-types/AutoStake';
import { TestERC20 } from '../typechain-types/TestERC20';
import { timeTravel } from './utils';

describe.only('AutoStake', () => {
  let accounts: SignerWithAddress[];
  let OneStakerRewardsPoolInstance: OneStakerRewardsPoolMock;
  let AutoStakingInstance: AutoStake;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let staker: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account] = accounts;
    staker = testAccount;
  });

  let startTimestmap: number;
  let endTimestamp: number;
  let endBlock;

  let throttleRoundBlocks = 20;
  const virtualBlocksTime: number = 10; // 10s == 10000ms
  const oneMinute: number = 60;

  const day: number = 60 * 24 * 60;
  const amount: BigNumber = ethers.utils.parseEther('5184000');
  const bOne: BigNumber = ethers.utils.parseEther('1');
  const standardStakingAmount: BigNumber = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit: BigNumber = ethers.utils.parseEther('15'); // 10 tokens

  const setupRewardsPoolParameters = async () => {
    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestmap = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestmap + oneMinute * 2;
    endBlock = Math.trunc(endTimestamp / virtualBlocksTime);
  };

  describe('Deploy and Connect', async function () {
    it('[Should deploy and connect the two tokens]:', async () => {
      stakingTokenInstance = (await deployContract(staker, TestERC20Artifact, [amount])) as TestERC20;
      stakingTokenAddress = stakingTokenInstance.address;

      await setupRewardsPoolParameters();

      AutoStakingInstance = (await deployContract(staker, AutoStakeArtifact, [
        stakingTokenAddress,
        throttleRoundBlocks,
        bOne,
        endTimestamp,
        virtualBlocksTime,
      ])) as AutoStake;

      OneStakerRewardsPoolInstance = (await deployContract(staker, OneStakerRewardsPoolArtifact, [
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        [stakingTokenAddress],
        [bOne],
        ethers.constants.MaxUint256,
        AutoStakingInstance.address,
        contractStakeLimit,
        virtualBlocksTime,
      ])) as OneStakerRewardsPoolMock;

      await AutoStakingInstance.setPool(OneStakerRewardsPoolInstance.address);

      const stakingToken = await AutoStakingInstance.stakingToken();
      expect(stakingToken).to.equal(stakingTokenAddress);

      const rewardPool = await AutoStakingInstance.rewardPool();
      expect(rewardPool).to.equal(OneStakerRewardsPoolInstance.address);
    });

    it('[Should fail setting the pool from not owner]:', async () => {
      let AutoStakingInstanceNew: AutoStake = (await deployContract(staker, AutoStakeArtifact, [
        stakingTokenAddress,
        throttleRoundBlocks,
        bOne,
        endTimestamp,
        virtualBlocksTime,
      ])) as AutoStake;

      let OneStakerRewardsPoolInstanceNew: OneStakerRewardsPoolMock = (await deployContract(
        staker,
        OneStakerRewardsPoolArtifact,
        [
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          [stakingTokenAddress],
          [bOne],
          ethers.constants.MaxUint256,
          AutoStakingInstance.address,
          contractStakeLimit,
          virtualBlocksTime,
        ]
      )) as OneStakerRewardsPoolMock;

      await expect(
        AutoStakingInstanceNew.connect(test1Account).setPool(OneStakerRewardsPoolInstanceNew.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Staking', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(staker, TestERC20Artifact, [amount])) as TestERC20;
      stakingTokenAddress = stakingTokenInstance.address;

      await setupRewardsPoolParameters();

      AutoStakingInstance = (await deployContract(staker, AutoStakeArtifact, [
        stakingTokenAddress,
        throttleRoundBlocks,
        bOne,
        endTimestamp,
        virtualBlocksTime,
      ])) as AutoStake;

      OneStakerRewardsPoolInstance = (await deployContract(staker, OneStakerRewardsPoolArtifact, [
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        [stakingTokenAddress],
        [bOne],
        ethers.constants.MaxUint256,
        AutoStakingInstance.address,
        contractStakeLimit,
        virtualBlocksTime,
      ])) as OneStakerRewardsPoolMock;

      await AutoStakingInstance.setPool(OneStakerRewardsPoolInstance.address);
      await stakingTokenInstance.mint(staker.address, amount);
      await stakingTokenInstance.mint(test1Account.address, amount);

      await stakingTokenInstance.mint(OneStakerRewardsPoolInstance.address, amount);

      await stakingTokenInstance.connect(staker).approve(AutoStakingInstance.address, standardStakingAmount);
      await stakingTokenInstance.connect(test1Account).approve(AutoStakingInstance.address, standardStakingAmount);
      await timeTravel(70);
    });

    it('[Should successfully stake]:', async () => {
      let startBlock = Math.trunc(startTimestmap / virtualBlocksTime);

      await AutoStakingInstance.connect(staker).stake(standardStakingAmount);
      const totalStakedAmount = await OneStakerRewardsPoolInstance.totalStaked();
      const userInfo = await OneStakerRewardsPoolInstance.userInfo(AutoStakingInstance.address);
      const userRewardDebt = await OneStakerRewardsPoolInstance.getUserRewardDebt(AutoStakingInstance.address, 0);
      const userOwedToken = await OneStakerRewardsPoolInstance.getUserOwedTokens(AutoStakingInstance.address, 0);
      const userBalance = await AutoStakingInstance.balanceOf(staker.address);
      const userShares = await AutoStakingInstance.share(staker.address);

      expect(totalStakedAmount).to.equal(standardStakingAmount);
      expect(userInfo.amountStaked).to.equal(standardStakingAmount);
      expect(userInfo.firstStakedBlockNumber).to.gt(startBlock);
      expect(userRewardDebt).to.equal(0);
      expect(userOwedToken).to.equal(0);
      expect(userBalance).to.equal(standardStakingAmount);
      expect(userShares).to.equal(standardStakingAmount);
    });

    it('[Should accumulate reward]:', async () => {
      await AutoStakingInstance.connect(staker).stake(standardStakingAmount);

      await timeTravel(10);
      const accumulatedReward = await OneStakerRewardsPoolInstance.getUserAccumulatedReward(
        AutoStakingInstance.address,
        0
      );

      expect(accumulatedReward).to.equal(bOne);
      await timeTravel(10);
      await AutoStakingInstance.refreshAutoStake();

      const userBalance = await AutoStakingInstance.balanceOf(staker.address);
      const userShares = await AutoStakingInstance.share(staker.address);
      expect(userBalance).to.equal(standardStakingAmount.add(bOne.mul(2)));
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
          expect(userExitInfo.exitStake).to.equal(standardStakingAmount.add(bOne.mul(10)));
          expect(userBalanceAfter).to.equal(0);
        });

        it('[Should not get twice reward on exit twice]:', async () => {
          await timeTravel(190);

          await AutoStakingInstance.exit();
          await AutoStakingInstance.exit();

          const userBalanceAfter = await AutoStakingInstance.balanceOf(staker.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(staker.address);

          expect(userExitInfo.exitStake).to.equal(standardStakingAmount.add(bOne.mul(10)));
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

        it('Should complete succesfully', async () => {
          await timeTravel(190);
          await AutoStakingInstance.exit();

          await timeTravel(300);

          const userBalanceBefore = await stakingTokenInstance.balanceOf(staker.address);
          const contractBalance = await stakingTokenInstance.balanceOf(AutoStakingInstance.address);

          const tokenAddress = await AutoStakingInstance.stakingToken();

          await AutoStakingInstance.completeExit();

          const userBalanceAfter = await stakingTokenInstance.balanceOf(staker.address);
          const userExitInfo = await AutoStakingInstance.exitInfo(staker.address);

          expect(userExitInfo.exitStake).to.equal(0);
          expect(userBalanceAfter).to.equal(userBalanceBefore.add(standardStakingAmount.add(bOne.mul(10))));
        });
      });
    });
  });
});
