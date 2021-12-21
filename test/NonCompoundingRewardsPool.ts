import { BigNumber } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import NonCompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/NonCompoundingRewardsPool.sol/NonCompoundingRewardsPool.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { TestERC20 } from '../typechain-types/TestERC20';
import { NonCompoundingRewardsPool } from '../typechain-types/NonCompoundingRewardsPool';
import { getTime, timeTravel } from './utils';

describe('NonCompoundingRewardsPool', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  let NonCompoundingRewardsPoolInstance: NonCompoundingRewardsPool;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let externalRewardsTokenInstance: TestERC20;
  let externalRewardsTokenAddress: string;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerSecond: BigNumber[];

  let throttleRoundSeconds = 100;
  let throttleRoundCap = ethers.utils.parseEther('1');

  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = ethers.utils.parseEther('10'); // 10 tokens

  let startTimestamp: number;
  let endTimestamp: number;
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerSecond = [];
    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
      let parsedReward = await ethers.utils.parseEther(`${i + 1}`);
      rewardPerSecond.push(parsedReward);
    }

    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestamp = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestamp + oneMinute * 2;
  };

  const stake = async (_throttleRoundSeconds: number, _throttleRoundCap: BigNumber) => {
    NonCompoundingRewardsPoolInstance = (await deployContract(testAccount, NonCompoundingRewardsPoolArtifact, [
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      _throttleRoundSeconds,
      _throttleRoundCap,
      contractStakeLimit,
    ])) as NonCompoundingRewardsPool;

    const reward = rewardPerSecond[0].mul(endTimestamp - startTimestamp);
    await rewardTokensInstances[0].mint(NonCompoundingRewardsPoolInstance.address, reward);

    await NonCompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

    await stakingTokenInstance.approve(NonCompoundingRewardsPoolInstance.address, standardStakingAmount);
    await stakingTokenInstance
      .connect(test2Account)
      .approve(NonCompoundingRewardsPoolInstance.address, standardStakingAmount);

    await timeTravel(70);
    await NonCompoundingRewardsPoolInstance.stake(standardStakingAmount);
  };

  describe('Interaction Mechanics', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
      await stakingTokenInstance.mint(testAccount.address, amount);
      await stakingTokenInstance.mint(test2Account.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      externalRewardsTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
      await externalRewardsTokenInstance.mint(trasury.address, amount);

      externalRewardsTokenAddress = externalRewardsTokenInstance.address;

      await setupRewardsPoolParameters();

      await stake(throttleRoundSeconds, throttleRoundCap);
    });

    it('[Should not claim or withdraw]:', async () => {
      await expect(NonCompoundingRewardsPoolInstance.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );

      await expect(NonCompoundingRewardsPoolInstance.withdraw(bOne)).revertedWith(
        'OnlyExitFeature::cannot withdraw from this contract. Only exit.'
      );
    });

    it('[Should not exit before end of campaign]:', async () => {
      await expect(NonCompoundingRewardsPoolInstance.exit()).to.be.revertedWith(
        'onlyUnlocked::cannot perform this action until the end of the lock'
      );
    });

    it('[Should request exit successfully]:', async () => {
      await timeTravel(140);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoInitial = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const initialTotalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userRewards = await NonCompoundingRewardsPoolInstance.getUserAccumulatedReward(
        testAccount.address,
        0,
        await getTime()
      );

      await NonCompoundingRewardsPoolInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userTokensOwed = await NonCompoundingRewardsPoolInstance.getUserOwedTokens(testAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoFinal = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const finalTotalStkaedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      const finalRewardDebt = await NonCompoundingRewardsPoolInstance.getUserRewardDebt(testAccount.address, 0);

      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards);
      expect(userTokensOwed).to.equal(0);
      expect(finalRewardDebt).to.equal(0);
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking);
      expect(userInfoFinal.amountStaked).to.equal(0);
      expect(finalTotalStkaedAmount).to.equal(initialTotalStakedAmount.sub(standardStakingAmount));

      const userExitInfo = await NonCompoundingRewardsPoolInstance.exitInfo(testAccount.address);
      const pendingReward = await NonCompoundingRewardsPoolInstance.getPendingReward(0);
      expect(userInfoInitial.amountStaked).to.equal(userExitInfo.exitStake);
      expect(userRewards).to.equal(pendingReward);
    });

    it('[Should not get twice reward on exit twice]:', async () => {
      await timeTravel(140);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoInitial = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const initialTotalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userRewards = await NonCompoundingRewardsPoolInstance.getUserAccumulatedReward(
        testAccount.address,
        0,
        await getTime()
      );

      await NonCompoundingRewardsPoolInstance.exit();
      await NonCompoundingRewardsPoolInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userTokensOwed = await NonCompoundingRewardsPoolInstance.getUserOwedTokens(testAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoFinal = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const finalTotalStkaedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      const finalRewardDebt = await NonCompoundingRewardsPoolInstance.getUserRewardDebt(testAccount.address, 0);

      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards);
      expect(userTokensOwed).to.equal(0);
      expect(finalRewardDebt).to.equal(0);
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking);
      expect(userInfoFinal.amountStaked).to.equal(0);
      expect(finalTotalStkaedAmount).to.equal(initialTotalStakedAmount.sub(standardStakingAmount));

      const userExitInfo = await NonCompoundingRewardsPoolInstance.exitInfo(testAccount.address);
      const pendingReward = await NonCompoundingRewardsPoolInstance.getPendingReward(0);
      expect(userInfoInitial.amountStaked).to.equal(userExitInfo.exitStake);
      expect(userRewards).to.equal(pendingReward);
    });
  });

  describe('Cap and Rounds Mechanics', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
      await stakingTokenInstance.mint(testAccount.address, amount);
      await stakingTokenInstance.mint(test2Account.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      await setupRewardsPoolParameters();
    });

    it('[Should not change nextAvailableExitTimestamp before cap]:', async () => {
      const _throttleRoundSeconds = 1000;
      const _throttleRoundCap = standardStakingAmount.mul(2);

      await stake(_throttleRoundSeconds, _throttleRoundCap);
      await timeTravel(190);

      await NonCompoundingRewardsPoolInstance.exit();

      const nextBlock = await NonCompoundingRewardsPoolInstance.nextAvailableExitTimestamp();
      expect(nextBlock).to.equal(endTimestamp + throttleRoundSeconds);

      const volume = await NonCompoundingRewardsPoolInstance.nextAvailableRoundExitVolume();
      expect(volume.eq(standardStakingAmount), 'Exit volume was incorrect');

      const userExitInfo = await NonCompoundingRewardsPoolInstance.exitInfo(testAccount.address);
      expect(userExitInfo.exitTimestamp.eq(nextBlock), 'The exit block for the user was not set on the next block');
    });

    it('[Should change nextAvailableExitTimestamp if cap is hit]:', async () => {
      const _throttleRoundSeconds = 100;
      const _throttleRoundCap = standardStakingAmount.mul(2);

      await stake(_throttleRoundSeconds, _throttleRoundCap);
      await timeTravel(70);
      await NonCompoundingRewardsPoolInstance.connect(test2Account).stake(standardStakingAmount);

      const currentBlock = await ethers.provider.getBlock('latest');
      const blocksDelta = endTimestamp - currentBlock.number;

      await timeTravel(70);

      await NonCompoundingRewardsPoolInstance.exit();
      await timeTravel(10);
      await NonCompoundingRewardsPoolInstance.connect(test2Account).exit();

      const nextBlock = await NonCompoundingRewardsPoolInstance.nextAvailableExitTimestamp();
      expect(nextBlock.eq(endTimestamp + throttleRoundSeconds * 2), 'End block has changed incorrectly');

      const volume = await NonCompoundingRewardsPoolInstance.nextAvailableRoundExitVolume();
      expect(volume.eq(0), 'Exit volume was incorrect');

      const userExitInfo = await NonCompoundingRewardsPoolInstance.exitInfo(test2Account.address);
      expect(
        userExitInfo.exitTimestamp.eq(endTimestamp + throttleRoundSeconds),
        'The exit block for the user was not set for the current block'
      );
    });

    it('[Should find next available]:', async () => {
      const _throttleRoundSeconds = 100;
      const _throttleRoundCap = standardStakingAmount.mul(2);

      await stake(_throttleRoundSeconds, _throttleRoundCap);

      await NonCompoundingRewardsPoolInstance.connect(test2Account).stake(standardStakingAmount);

      const currentBlock = await ethers.provider.getBlock('latest');
      const blocksDelta = endTimestamp - currentBlock.number;

      await timeTravel(120);

      await NonCompoundingRewardsPoolInstance.exit();

      const nextBlock = await NonCompoundingRewardsPoolInstance.nextAvailableExitTimestamp();

      expect(nextBlock.eq(endTimestamp + throttleRoundSeconds), 'End block has changed incorrectly');

      const volume = await NonCompoundingRewardsPoolInstance.nextAvailableRoundExitVolume();
      expect(volume).to.equal(standardStakingAmount);

      const userExitInfo = await NonCompoundingRewardsPoolInstance.exitInfo(testAccount.address);
      expect(userExitInfo.exitTimestamp).to.equal(nextBlock);
    });
  });

  describe('Completing Exit', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      await stakingTokenInstance.mint(testAccount.address, amount);
      await stakingTokenInstance.mint(test2Account.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      externalRewardsTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
      await externalRewardsTokenInstance.mint(trasury.address, amount);

      externalRewardsTokenAddress = externalRewardsTokenInstance.address;

      await setupRewardsPoolParameters();

      await stake(throttleRoundSeconds, throttleRoundCap);
    });

    it('[Should not complete early]:', async () => {
      await timeTravel(140);
      await NonCompoundingRewardsPoolInstance.exit();

      await expect(NonCompoundingRewardsPoolInstance.completeExit()).to.be.revertedWith(
        'finalizeExit::Trying to exit too early'
      );
    });

    it('[Should complete succesfully]:', async () => {
      await timeTravel(190);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoInitial = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const initialTotalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userRewards = await NonCompoundingRewardsPoolInstance.getUserAccumulatedReward(
        testAccount.address,
        0,
        await getTime()
      );

      await NonCompoundingRewardsPoolInstance.exit();
      await timeTravel(400);

      await NonCompoundingRewardsPoolInstance.completeExit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userTokensOwed = await NonCompoundingRewardsPoolInstance.getUserOwedTokens(testAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoFinal = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const finalTotalStkaedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();

      expect(userFinalBalanceRewards).to.gt(userInitialBalanceRewards);
      expect(userTokensOwed).to.equal(0);
      expect(userFinalBalanceStaking).to.eq(userInitialBalanceStaking.add(standardStakingAmount));
      expect(userInfoFinal.amountStaked).to.equal(userInfoInitial.amountStaked.sub(standardStakingAmount));
      expect(finalTotalStkaedAmount).to.equal(initialTotalStakedAmount.sub(standardStakingAmount));

      const userExitInfo = await NonCompoundingRewardsPoolInstance.exitInfo(testAccount.address);
      const pendingReward = await NonCompoundingRewardsPoolInstance.getPendingReward(0);
      expect(userExitInfo.exitStake).to.equal(0);
      expect(pendingReward).to.equal(0);
    });
  });
});
