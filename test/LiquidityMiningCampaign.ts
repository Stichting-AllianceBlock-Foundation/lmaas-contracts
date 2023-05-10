import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import WTTArtifact from '../artifacts/contracts/canonical-weth/WETH9.sol/WETH9.json';
import LMCArtifact from '../artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import NonCompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/NonCompoundingRewardsPool.sol/NonCompoundingRewardsPool.json';
import { NonCompoundingRewardsPool } from '../typechain/NonCompoundingRewardsPool';
import { TestERC20 } from '../typechain/TestERC20';
import { LiquidityMiningCampaign } from '../typechain/LiquidityMiningCampaign';
import { getTime, timeTravel, timeTravelTo } from './utils';
import { WETH9 } from '../typechain';

describe('Liquidity mining campaign', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let LmcInstance: LiquidityMiningCampaign;

  let lockTimestamp: number;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerSecond: BigNumber[];
  let lockSchemеs;

  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const bonusPercet = 10000; // In thousands
  const bonus20 = 20000;
  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const thirty = ethers.utils.parseEther('30');
  const bOne = ethers.utils.parseEther('1');
  const bTen = ethers.utils.parseEther('10');
  const bTwenty = ethers.utils.parseEther('20');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const additionalRewards = [bTen];
  const stakeLimit = amount;
  const contractStakeLimit = ethers.utils.parseEther('35'); // 10 tokens
  let throttleRoundSeconds = 10;
  let throttleRoundCap = ethers.utils.parseEther('1');

  let startTimestamp: number;
  let endTimestamp: number;
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerSecond = [];
    lockSchemеs = [];

    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = (await (await ethers.getContractFactory('TestERC20')).deploy(amount)) as TestERC20;

      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      let parsedReward = await ethers.utils.parseEther(`${i + 1}`);
      rewardPerSecond.push(parsedReward);
    }

    const currentTimestamp = await getTime();
    startTimestamp = currentTimestamp + oneMinute;
    endTimestamp = startTimestamp + oneMinute * 2;
    lockTimestamp = endTimestamp + 30;
  };

  beforeEach(async () => {
    stakingTokenInstance = (await (await ethers.getContractFactory('TestERC20')).deploy(amount)) as TestERC20;
    await stakingTokenInstance.mint(testAccount.address, thirty);
    await stakingTokenInstance.mint(test2Account.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    LmcInstance = (await (
      await ethers.getContractFactory('LiquidityMiningCampaign')
    ).deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      'TestCampaign',
      ethers.constants.AddressZero
    )) as LiquidityMiningCampaign;

    await rewardTokensInstances[0].mint(LmcInstance.address, amount);

    await LmcInstance.start(startTimestamp, endTimestamp, rewardPerSecond);
  });

  it('[Should deploy the lmc successfully]:', async () => {
    expect(LmcInstance.address);
  });

  describe('Staking and Locking', () => {
    beforeEach(async () => {
      await stakingTokenInstance.approve(LmcInstance.address, amount);
      await stakingTokenInstance.connect(test2Account).approve(LmcInstance.address, amount);
      await timeTravel(70);
    });

    it('[Should stake sucessfully]:', async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      let userInitialBalance = await stakingTokenInstance.balanceOf(testAccount.address);

      await LmcInstance.stake(bTen);
      const stakeTime = await getTime();

      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      let userFinalBalance = await stakingTokenInstance.balanceOf(testAccount.address);
      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);
      const userRewardDebt = await LmcInstance.getUserRewardDebt(testAccount.address, 0);
      const userOwedToken = await LmcInstance.getUserOwedTokens(testAccount.address, 0);

      await timeTravel(10);

      expect(contractFinalBalance).to.equal(contractInitialBalance.add(bTen));
      expect(totalStakedAmount).to.equal(bTen);
      expect(userInfo.amountStaked).to.equal(bTen);
      expect(userRewardDebt).to.equal(0);
      expect(userOwedToken).to.equal(0);
      expect(userFinalBalance).to.equal(userInitialBalance.sub(bTen));

      const checkTime = await getTime();
      const accumulatedReward = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0, checkTime);

      expect(accumulatedReward).to.equal(bOne.mul(checkTime - stakeTime));
    });

    it.only('[Should stake in nativeTokens sucessfully]:', async () => {
      await setupRewardsPoolParameters();

      const _contractStakeLimit = amount;

      let wrappedNativeTokenInstance = (await (await ethers.getContractFactory('WETH9')).deploy()) as WETH9;

      let NewLmcInstance: LiquidityMiningCampaign = (await (
        await ethers.getContractFactory('LiquidityMiningCampaign')
      ).deploy(
        wrappedNativeTokenInstance.address,
        rewardTokensAddresses,
        stakeLimit,
        _contractStakeLimit,
        'TestCampaign',
        wrappedNativeTokenInstance.address
      )) as LiquidityMiningCampaign;

      await rewardTokensInstances[0].mint(NewLmcInstance.address, amount);
      await NewLmcInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

      await timeTravel(70);

      let contractInitialBalance = await wrappedNativeTokenInstance.balanceOf(NewLmcInstance.address);
      let userInitialBalance = await testAccount.getBalance();

      await NewLmcInstance.stakeNative({ value: bTen });
      const stakeTime = await getTime();

      let contractFinalBalance = await wrappedNativeTokenInstance.balanceOf(NewLmcInstance.address);
      let userFinalBalance = await testAccount.getBalance();
      const totalStakedAmount = await NewLmcInstance.totalStaked();
      const userInfo = await NewLmcInstance.userInfo(testAccount.address);
      const userRewardDebt = await NewLmcInstance.getUserRewardDebt(testAccount.address, 0);
      const userOwedToken = await NewLmcInstance.getUserOwedTokens(testAccount.address, 0);

      await timeTravel(10);

      expect(contractFinalBalance).to.equal(contractInitialBalance.add(bTen));
      expect(totalStakedAmount).to.equal(bTen);
      expect(userInfo.amountStaked).to.equal(bTen);
      expect(userRewardDebt).to.equal(0);
      expect(userOwedToken).to.equal(0);
      expect(userFinalBalance).to.lt(userInitialBalance);

      const checkTime = await getTime();
      const accumulatedReward = await NewLmcInstance.getUserAccumulatedReward(testAccount.address, 0, checkTime);

      expect(accumulatedReward).to.equal(bOne.mul(checkTime - stakeTime));
    });

    it("[Should stake sucessfully in two different lmc's]:", async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      await LmcInstance.stake(bTen);
      const stakeTime = await getTime();

      await LmcInstance.stake(bTen);

      const checkTime = startTimestamp + oneMinute;
      await timeTravelTo(checkTime);

      const accumulatedReward = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0, checkTime);
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.add(bTwenty));
      expect(totalStakedAmount).to.equal(bTwenty);
      expect(userInfo.amountStaked).to.equal(bTwenty);
      expect(accumulatedReward).to.equal(bOne.mul(checkTime - stakeTime));
    });

    it('[Should fail staking and locking with zero amount]:', async () => {
      await expect(LmcInstance.stake(0)).to.be.revertedWith('RewardsPoolBase: cannot stake 0');
    });
  });

  describe('Withdraw and Exit', () => {
    beforeEach(async () => {
      await stakingTokenInstance.approve(LmcInstance.address, amount);
      await stakingTokenInstance.connect(test2Account).approve(LmcInstance.address, amount);
      await timeTravel(70);
      await LmcInstance.stake(bTen);
      await timeTravel(80);
      await LmcInstance.stake(bTwenty);
    });

    it('[Should withdraw and exit sucessfully]:', async () => {
      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoInitial = await LmcInstance.userInfo(testAccount.address);
      const initialTotalStakedAmount = await LmcInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      const exitTime = (await getTime()) + 10;
      const userRewards = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0, exitTime);

      await timeTravelTo(exitTime);
      await LmcInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      const userTokensOwed = await LmcInstance.getUserOwedTokens(testAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);

      const userInfoFinal = await LmcInstance.userInfo(testAccount.address);
      const finalTotalStkaedAmount = await LmcInstance.totalStaked();

      expect(userFinalBalanceRewards).to.gt(userInitialBalanceRewards);
      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards.add(userRewards));
      expect(userTokensOwed).to.equal(0);
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking.add(bTen).add(bTwenty));
      expect(userInfoFinal.amountStaked).to.equal(userInfoInitial.amountStaked.sub(bTen).sub(bTwenty));
      expect(finalTotalStkaedAmount).to.equal(initialTotalStakedAmount.sub(bTen).sub(bTwenty));
    });

    it('[Should withdraw sucessfully when staked in two different lmcs]:', async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);

      await timeTravel(120);

      const userTokensOwedInitial = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0, await getTime());
      await LmcInstance.exit();
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.sub(bTen).sub(bTwenty));
      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards.add(userTokensOwedInitial));
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
    });
    it('[Should withdraw sucessfully when staked in two different lmcs and called only exit]:', async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);

      await timeTravel(120);
      const userTokensOwedInitial = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0, await getTime());
      await LmcInstance.exit();
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.sub(bTen).sub(bTwenty));
      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards.add(userTokensOwedInitial));
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
    });

    it('[Should exit and transfer sucessfully]:', async () => {
      await setupRewardsPoolParameters();

      const _contractStakeLimit = amount;

      let NewWrappedNativeTokenInstance = (await (await ethers.getContractFactory('WETH9')).deploy()) as WETH9;

      let NewLmcInstance: LiquidityMiningCampaign = (await (
        await ethers.getContractFactory('LiquidityMiningCampaig')
      ).deploy(
        stakingTokenAddress,
        rewardTokensAddresses,
        stakeLimit,
        _contractStakeLimit,
        'TestCampaign',
        NewWrappedNativeTokenInstance.address
      )) as LiquidityMiningCampaign;

      await rewardTokensInstances[0].mint(NewLmcInstance.address, amount);
      await NewLmcInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

      const externalRewardsTokenInstance = (await (
        await ethers.getContractFactory('TestERC20')
      ).deploy(amount)) as TestERC20;
      await externalRewardsTokenInstance.mint(trasury.address, amount);

      let NonCompoundingRewardsPoolInstance: NonCompoundingRewardsPool = (await (
        await ethers.getContractFactory('NonCompoundingRewardsPool')
      ).deploy(
        stakingTokenAddress,
        rewardTokensAddresses,
        stakeLimit,
        throttleRoundSeconds,
        throttleRoundCap,
        _contractStakeLimit,
        'TestNonCompoundingCampaign',
        NewWrappedNativeTokenInstance.address
      )) as NonCompoundingRewardsPool;

      await rewardTokensInstances[0].mint(NonCompoundingRewardsPoolInstance.address, amount);
      await NonCompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp + oneMinute, rewardPerSecond);

      await stakingTokenInstance.approve(NewLmcInstance.address, amount);
      await timeTravel(70);
      await NewLmcInstance.stake(bTen);
      await NewLmcInstance.setReceiverWhitelisted(NonCompoundingRewardsPoolInstance.address, true);

      await timeTravel(120);

      let initialBalance = await NonCompoundingRewardsPoolInstance.balanceOf(testAccount.address);
      const userTokensOwedInitial = await NewLmcInstance.getUserAccumulatedReward(
        testAccount.address,
        0,
        await getTime()
      );

      await NewLmcInstance.exitAndTransfer(NonCompoundingRewardsPoolInstance.address);

      let finalBalance = await NonCompoundingRewardsPoolInstance.balanceOf(testAccount.address);
      let totalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      let userInfo = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      expect(finalBalance.gt(initialBalance), 'Staked amount is not correct');
      expect(finalBalance.eq(userTokensOwedInitial), 'User rewards were not calculated properly');
      expect(totalStakedAmount.eq(userTokensOwedInitial), 'Total Staked amount is not correct');
      expect(userInfo.amountStaked.eq(finalBalance), "User's staked amount is not correct");
    });

    it("[Should return from exit if the user hasn't locked]:", async () => {
      await expect(LmcInstance.connect(test2Account).exit()).to.be.revertedWith('RewardsPoolBase: cannot withdraw 0');
    });

    it("[Should return from the exit and transfer if the user hasn't locked]:", async () => {
      await timeTravel(120);
      await LmcInstance.setReceiverWhitelisted(testAccount.address, true);
      await LmcInstance.connect(test2Account).exitAndTransfer(testAccount.address);
    });

    it('[Should fail to exit and transfer if the poolAddress is not whitelisted]:', async () => {
      await expect(LmcInstance.exitAndTransfer(testAccount.address)).to.be.revertedWith(
        'exitAndTransfer::receiver is not whitelisted'
      );
    });
  });
});
