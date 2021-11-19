import { BigNumber, Contract } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import LockSchemeArtifact from '../artifacts/contracts/LockScheme.sol/LockScheme.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import PercentageCalculatorArtifact from '../artifacts/contracts/PercentageCalculator.sol/PercentageCalculator.json';
import LMCArtifact from '../artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import NonCompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/NonCompoundingRewardsPool.sol/NonCompoundingRewardsPool.json';
import { NonCompoundingRewardsPool } from '../typechain-types/NonCompoundingRewardsPool';
import { TestERC20 } from '../typechain-types/TestERC20';
import { PercentageCalculator } from '../typechain-types/PercentageCalculator';
import { LiquidityMiningCampaign } from '../typechain-types/LiquidityMiningCampaign';
import { timeTravel } from './utils';

describe('LMC No Lock', () => {
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

  let rampUpBlock: number;
  let lockBlock: number;
  let secondLockBlock: number;
  let startBlock: number;
  let endBlock: number;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerBlock: BigNumber[];
  let lockSchemеs;
  let libraries;

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
  let throttleRoundBlocks = 10;
  let throttleRoundCap = ethers.utils.parseEther('1');

  let startTimestmap: number;
  let endTimestamp: number;
  const virtualBlocksTime = 10; // 10s == 10000ms
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerBlock = [];
    lockSchemеs = [];

    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      let parsedReward = await ethers.utils.parseEther(`${i + 1}`);
      rewardPerBlock.push(parsedReward);
    }
    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestmap = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestmap + oneMinute * 2;
    startBlock = Math.trunc(startTimestmap / virtualBlocksTime);
    endBlock = Math.trunc(endTimestamp / virtualBlocksTime);
    rampUpBlock = startBlock + 5;
    lockBlock = endBlock + 30;
    secondLockBlock = lockBlock + 5;
  };

  beforeEach(async () => {
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    await stakingTokenInstance.mint(testAccount.address, thirty);
    await stakingTokenInstance.mint(test2Account.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    const percentageCalculator: PercentageCalculator = (await deployContract(
      testAccount,
      PercentageCalculatorArtifact
    )) as PercentageCalculator;

    libraries = {
      PercentageCalculator: percentageCalculator.address,
    };

    LmcInstance = (await deployContract(testAccount, LMCArtifact, [
      stakingTokenAddress,
      startTimestmap,
      endTimestamp,
      rewardTokensAddresses,
      rewardPerBlock,
      rewardTokensAddresses[0],
      stakeLimit,
      contractStakeLimit,
      virtualBlocksTime,
    ])) as LiquidityMiningCampaign;

    await rewardTokensInstances[0].mint(LmcInstance.address, amount);
  });

  it('[Should deploy the lock scheme successfully]:', async () => {
    expect(LmcInstance.address);
  });

  describe('Staking and Locking', () => {
    beforeEach(async () => {
      await stakingTokenInstance.approve(LmcInstance.address, amount);
      await stakingTokenInstance.connect(test2Account).approve(LmcInstance.address, amount);
      await timeTravel(70);
    });

    it('[Should stake and lock sucessfully]:', async () => {
      let currentBlock = await ethers.provider.getBlock('latest');
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      let userInitialBalance = await stakingTokenInstance.balanceOf(test1Account.address);

      await LmcInstance.stake(bTen);

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

      const accumulatedReward = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0);
      expect(accumulatedReward).to.equal(bOne);
    });

    it("[Should stake and lock sucessfully in two different lmc's]:", async () => {
      let currentBlock = await ethers.provider.getBlock('latest');
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      await LmcInstance.stake(bTen);
      await LmcInstance.stake(bTwenty);

      await timeTravel(70);
      const accumulatedReward = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0);
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);

      currentBlock = await ethers.provider.getBlock('latest');

      expect(contractFinalBalance).to.equal(contractInitialBalance.add(bTen).add(bTwenty));
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
      expect(accumulatedReward).to.equal(bOne.mul(7));
    });

    it('[Should fail staking and locking with zero amount]:', async () => {
      await expect(LmcInstance.stake(0)).to.be.revertedWith('Stake::Cannot stake 0');
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
      const userRewards = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0);

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
      let currentBlock = await ethers.provider.getBlock('latest');
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);

      currentBlock = await ethers.provider.getBlock('latest');

      await timeTravel(120);

      const userTokensOwedInitial = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0);
      await LmcInstance.exit();
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userAccruedRewards = await LmcInstance.userAccruedRewards(testAccount.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.sub(bTen).sub(bTwenty));
      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards.add(userTokensOwedInitial));
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
      expect(userAccruedRewards).to.equal(0);
    });
    it('[Should withdraw sucessfully when staked in two different lmcs and called only exit]:', async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);

      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(testAccount.address);

      await timeTravel(120);
      const userTokensOwedInitial = await LmcInstance.getUserAccumulatedReward(testAccount.address, 0);
      await LmcInstance.exit();
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userAccruedRewards = await LmcInstance.userAccruedRewards(testAccount.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.sub(bTen).sub(bTwenty));
      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards.add(userTokensOwedInitial));
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
      expect(userAccruedRewards).to.equal(0);
    });

    it('Should exit and stake sucessfully', async () => {
      await setupRewardsPoolParameters();
      await setupRewardsPoolParameters();

      const _contractStakeLimit = amount;

      let NewLmcInstance: LiquidityMiningCampaign = (await deployContract(testAccount, LMCArtifact, [
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        rewardTokensAddresses,
        rewardPerBlock,
        rewardTokensAddresses[0],
        stakeLimit,
        _contractStakeLimit,
        virtualBlocksTime,
      ])) as LiquidityMiningCampaign;

      await rewardTokensInstances[0].mint(NewLmcInstance.address, amount);
      let externalRewardsTokenInstance: TestERC20 = (await deployContract(testAccount, TestERC20Artifact, [
        amount,
      ])) as TestERC20;
      await externalRewardsTokenInstance.mint(trasury.address, amount);

      let NonCompoundingRewardsPoolInstance: NonCompoundingRewardsPool = (await deployContract(
        testAccount,
        NonCompoundingRewardsPoolArtifact,
        [
          rewardTokensAddresses[0],
          startTimestmap,
          endTimestamp + oneMinute,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          throttleRoundBlocks,
          throttleRoundCap,
          _contractStakeLimit,
          virtualBlocksTime,
        ]
      )) as NonCompoundingRewardsPool;

      await stakingTokenInstance.approve(NewLmcInstance.address, amount);
      await timeTravel(70);
      await NewLmcInstance.stake(bTen);
      await NewLmcInstance.setReceiverWhitelisted(NonCompoundingRewardsPoolInstance.address, true);

      await timeTravel(120);

      let initialBalance = await NonCompoundingRewardsPoolInstance.balanceOf(testAccount.address);
      const userTokensOwedInitial = await NewLmcInstance.getUserAccumulatedReward(testAccount.address, 0);

      await NewLmcInstance.exitAndStake(NonCompoundingRewardsPoolInstance.address);

      let finalBalance = await NonCompoundingRewardsPoolInstance.balanceOf(testAccount.address);
      let totalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      let userInfo = await NonCompoundingRewardsPoolInstance.userInfo(testAccount.address);
      const userAccruedRewards = await NewLmcInstance.userAccruedRewards(testAccount.address);
      expect(finalBalance.gt(initialBalance), 'Staked amount is not correct');
      expect(finalBalance.eq(userTokensOwedInitial), 'User rewards were not calculated properly');
      expect(totalStakedAmount.eq(userTokensOwedInitial), 'Total Staked amount is not correct');
      expect(userInfo.amountStaked.eq(finalBalance), "User's staked amount is not correct");
      expect(userAccruedRewards.eq(0), "User's accrued rewards should be zero");
    });

    it('[Should fail calling the claim function only]:', async () => {
      await expect(LmcInstance.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );
    });

    it("[Should return from exit if the user hasn't locked]:", async () => {
      await expect(LmcInstance.connect(test2Account).exit()).to.be.revertedWith('Withdraw::Cannot withdraw 0');
    });

    it("[Should return from the exit and stake if the user hasn't locked]:", async () => {
      await timeTravel(120);
      await LmcInstance.setReceiverWhitelisted(testAccount.address, true);
      await LmcInstance.connect(test2Account).exitAndStake(testAccount.address);
    });

    it('Should fail to exit and stake if the poolAddress is not whitelisted ', async () => {
      await expect(LmcInstance.exitAndStake(testAccount.address)).to.be.revertedWith(
        'exitAndTransfer::receiver is not whitelisted'
      );
    });
  });
});
