import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { ThrottledExitRewardsPoolMock } from '../typechain-types/ThrottledExitRewardsPoolMock';
import { getTime, timeTravel } from './utils';

describe('ThrottledExitFeature', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;

  let ThrottledExitFeatureInstance: ThrottledExitRewardsPoolMock;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

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
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      const tknInst = (await TestERC20.deploy(amount)) as TestERC20;

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

  const stake = async (_throttleRoundSeconds: BigNumberish, _throttleRoundCap: BigNumberish) => {
    const ThrottledExitRewardsPoolMock = await ethers.getContractFactory('ThrottledExitRewardsPoolMock');
    ThrottledExitFeatureInstance = (await ThrottledExitRewardsPoolMock.deploy(
      stakingTokenAddress,
      startTimestamp,
      endTimestamp,
      rewardTokensAddresses,
      stakeLimit,
      _throttleRoundSeconds,
      _throttleRoundCap,
      contractStakeLimit
    )) as ThrottledExitRewardsPoolMock;

    await rewardTokensInstances[0].mint(ThrottledExitFeatureInstance.address, amount);

    await ThrottledExitFeatureInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

    await stakingTokenInstance.approve(ThrottledExitFeatureInstance.address, standardStakingAmount);
    await stakingTokenInstance.connect(bobAccount).approve(ThrottledExitFeatureInstance.address, standardStakingAmount);

    await timeTravel(70);
    await ThrottledExitFeatureInstance.stake(standardStakingAmount);
  };

  describe('Interaction Mechanics', async function () {
    beforeEach(async () => {
      [aliceAccount, bobAccount] = await ethers.getSigners();

      const TestERC20 = await ethers.getContractFactory('TestERC20');
      stakingTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;
      await stakingTokenInstance.mint(aliceAccount.address, amount);
      await stakingTokenInstance.mint(bobAccount.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      await setupRewardsPoolParameters();
      await stake(throttleRoundSeconds, throttleRoundCap);
    });

    it('Should not claim or withdraw', async () => {
      await expect(ThrottledExitFeatureInstance.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );
      await expect(ThrottledExitFeatureInstance.withdraw(bOne)).to.be.revertedWith(
        'OnlyExitFeature::cannot withdraw from this contract. Only exit.'
      );
    });

    it('Should request exit successfully', async () => {
      await timeTravel(130);
      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoInitial = await ThrottledExitFeatureInstance.userInfo(aliceAccount.address);
      const initialTotalStakedAmount = await ThrottledExitFeatureInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userRewards = await ThrottledExitFeatureInstance.getUserAccumulatedReward(
        aliceAccount.address,
        0,
        await getTime()
      );

      await ThrottledExitFeatureInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userTokensOwed = await ThrottledExitFeatureInstance.getUserOwedTokens(aliceAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoFinal = await ThrottledExitFeatureInstance.userInfo(aliceAccount.address);
      const finalTotalStkaedAmount = await ThrottledExitFeatureInstance.totalStaked();
      const finalRewardDebt = await ThrottledExitFeatureInstance.getUserRewardDebt(aliceAccount.address, 0);

      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards, 'Rewards claim was not successful');
      expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
      expect(finalRewardDebt).to.equal(0, 'User reward debt should be zero');
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking, 'Withdraw was not successfull');
      expect(userInfoFinal.amountStaked).to.equal(0, 'User staked amount is not updated properly');
      expect(finalTotalStkaedAmount).to.equal(
        initialTotalStakedAmount.sub(standardStakingAmount),
        'Contract total staked amount is not updated properly'
      );

      const userExitInfo = await ThrottledExitFeatureInstance.exitInfo(aliceAccount.address);
      const pendingReward = await ThrottledExitFeatureInstance.getPendingReward(0);
      expect(userInfoInitial.amountStaked).to.equal(userExitInfo.exitStake, 'User exit amount is not updated properly');
      expect(userRewards).to.equal(pendingReward, 'User exit rewards are not updated properly');
    });

    it('Should not get twice reward on exit twice', async () => {
      await timeTravel(130);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoInitial = await ThrottledExitFeatureInstance.userInfo(aliceAccount.address);
      const initialTotalStakedAmount = await ThrottledExitFeatureInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userRewards = await ThrottledExitFeatureInstance.getUserAccumulatedReward(
        aliceAccount.address,
        0,
        await getTime()
      );

      await ThrottledExitFeatureInstance.exit();
      await ThrottledExitFeatureInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userTokensOwed = await ThrottledExitFeatureInstance.getUserOwedTokens(aliceAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoFinal = await ThrottledExitFeatureInstance.userInfo(aliceAccount.address);
      const finalTotalStkaedAmount = await ThrottledExitFeatureInstance.totalStaked();
      const finalRewardDebt = await ThrottledExitFeatureInstance.getUserRewardDebt(aliceAccount.address, 0);

      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards, 'Rewards claim was not successful');
      expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
      expect(finalRewardDebt).to.equal(0, 'User reward debt should be zero');
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking, 'Withdraw was not successfull');
      expect(userInfoFinal.amountStaked).to.equal(0, 'User staked amount is not updated properly');
      expect(finalTotalStkaedAmount).to.equal(
        initialTotalStakedAmount.sub(standardStakingAmount),
        'Contract total staked amount is not updated properly'
      );

      const userExitInfo = await ThrottledExitFeatureInstance.exitInfo(aliceAccount.address);
      const pendingReward = await ThrottledExitFeatureInstance.getPendingReward(0);
      expect(userInfoInitial.amountStaked).to.equal(userExitInfo.exitStake, 'User exit amount is not updated properly');
      expect(userRewards).to.equal(pendingReward, 'User exit rewards are not updated properly');
    });
  });

  describe('Cap and Rounds Mechanics', async function () {
    beforeEach(async () => {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      stakingTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;

      await stakingTokenInstance.mint(aliceAccount.address, amount);
      await stakingTokenInstance.mint(bobAccount.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      await setupRewardsPoolParameters();
    });

    it('Should not change nextAvailableExitTimestamp before cap', async () => {
      const _throttleRoundSeconds = 100;
      const _throttleRoundCap = standardStakingAmount.mul(2);
      await stake(_throttleRoundSeconds, _throttleRoundCap);

      await timeTravel(130);

      await ThrottledExitFeatureInstance.exit();

      const nextBlock = await ThrottledExitFeatureInstance.nextAvailableExitTimestamp();
      expect(nextBlock).to.equal(endTimestamp + throttleRoundSeconds, 'End block has changed but it should not have');

      const volume = await ThrottledExitFeatureInstance.nextAvailableRoundExitVolume();
      expect(volume).to.equal(standardStakingAmount, 'Exit volume was incorrect');

      const userExitInfo = await ThrottledExitFeatureInstance.exitInfo(aliceAccount.address);
      expect(userExitInfo.exitTimestamp).to.equal(
        nextBlock,
        'The exit block for the user was not set on the next block'
      );
    });

    it('Should change nextAvailableExitTimestamp if cap is hit', async () => {
      const _throttleRoundSeconds = 100;
      const _throttleRoundCap = standardStakingAmount.mul(2);

      await stake(_throttleRoundSeconds, _throttleRoundCap);

      await ThrottledExitFeatureInstance.connect(bobAccount).stake(standardStakingAmount);

      await timeTravel(130);

      await ThrottledExitFeatureInstance.exit();
      await ThrottledExitFeatureInstance.connect(bobAccount).exit();

      const nextBlock = await ThrottledExitFeatureInstance.nextAvailableExitTimestamp();
      expect(nextBlock).to.equal(endTimestamp + throttleRoundSeconds * 2, 'End block has changed incorrectly');

      const volume = await ThrottledExitFeatureInstance.nextAvailableRoundExitVolume();
      expect(volume).to.equal(0, 'Exit volume was incorrect');

      const userExitInfo = await ThrottledExitFeatureInstance.exitInfo(bobAccount.address);
      expect(userExitInfo.exitTimestamp).to.equal(
        endTimestamp + throttleRoundSeconds,
        'The exit block for the user was not set for the current block'
      );
    });

    it('Should find next available', async () => {
      const _throttleRoundSeconds = 100;
      const _throttleRoundCap = standardStakingAmount.mul(2);

      await stake(_throttleRoundSeconds, _throttleRoundCap);

      await ThrottledExitFeatureInstance.connect(bobAccount).stake(standardStakingAmount);

      await timeTravel(130);

      await ThrottledExitFeatureInstance.exit();

      const nextBlock = await ThrottledExitFeatureInstance.nextAvailableExitTimestamp();
      expect(nextBlock).to.equal(endTimestamp + throttleRoundSeconds, 'End block has changed incorrectly');

      const volume = await ThrottledExitFeatureInstance.nextAvailableRoundExitVolume();
      expect(volume).to.equal(standardStakingAmount, 'Exit volume was incorrect');

      const userExitInfo = await ThrottledExitFeatureInstance.exitInfo(aliceAccount.address);
      expect(userExitInfo.exitTimestamp).to.equal(
        nextBlock,
        'The exit block for the user was not set on the next block'
      );
    });
  });

  describe('Completing Exit', async function () {
    beforeEach(async () => {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      stakingTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;

      await stakingTokenInstance.mint(aliceAccount.address, amount);
      await stakingTokenInstance.mint(bobAccount.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      await setupRewardsPoolParameters();

      await stake(throttleRoundSeconds, throttleRoundCap);
    });

    it('Should not complete early', async () => {
      await timeTravel(130);

      await ThrottledExitFeatureInstance.exit();

      await expect(ThrottledExitFeatureInstance.completeExit()).to.be.revertedWith(
        'finalizeExit::Trying to exit too early'
      );
    });

    it('Should complete succesfully', async () => {
      await timeTravel(130);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoInitial = await ThrottledExitFeatureInstance.userInfo(aliceAccount.address);
      const initialTotalStakedAmount = await ThrottledExitFeatureInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      await ThrottledExitFeatureInstance.exit();

      await timeTravel(130);

      await ThrottledExitFeatureInstance.completeExit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userTokensOwed = await ThrottledExitFeatureInstance.getUserOwedTokens(aliceAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoFinal = await ThrottledExitFeatureInstance.userInfo(aliceAccount.address);
      const finalTotalStkaedAmount = await ThrottledExitFeatureInstance.totalStaked();

      expect(userFinalBalanceRewards.gt(userInitialBalanceRewards)).to.equal(true, 'Rewards claim was not successful');
      expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
      expect(userFinalBalanceStaking).to.equal(
        userInitialBalanceStaking.add(standardStakingAmount),
        'Withdraw was not successfull'
      );
      expect(userInfoFinal.amountStaked).to.equal(
        userInfoInitial.amountStaked.sub(standardStakingAmount),
        'User staked amount is not updated properly'
      );
      expect(finalTotalStkaedAmount).to.equal(
        initialTotalStakedAmount.sub(standardStakingAmount),
        'Contract total staked amount is not updated properly'
      );

      const userExitInfo = await ThrottledExitFeatureInstance.exitInfo(aliceAccount.address);
      const pendingReward = await ThrottledExitFeatureInstance.getPendingReward(0);
      expect(userExitInfo.exitStake).to.equal(0, 'User exit amount is not updated properly');
      expect(pendingReward).to.equal(0, 'User exit rewards are not updated properly');
    });
  });
});
