import { BigNumber } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import LockSchemeArtifact from '../artifacts/contracts/LockScheme.sol/LockScheme.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import PercentageCalculatorArtifact from '../artifacts/contracts/PercentageCalculator.sol/PercentageCalculator.json';
import LMCArtifact from '../artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import NonCompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/NonCompoundingRewardsPool.sol/NonCompoundingRewardsPool.json';
import { LockScheme } from '../typechain-types/LockScheme';
import { TestERC20 } from '../typechain-types/TestERC20';
import { LiquidityMiningCampaign } from '../typechain-types/LiquidityMiningCampaign';
import { PercentageCalculator } from '../typechain-types/PercentageCalculator';
import { timeTravel } from './utils';
import { NonCompoundingRewardsPool } from '../typechain-types/NonCompoundingRewardsPool';

describe('LMC', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  let LockSchemeInstance: LockScheme;
  let LockSchemeInstance2: LockScheme;
  let LockSchemeInstance3: LockScheme;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let LmcInstance: LiquidityMiningCampaign;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerBlock: BigNumber[];
  let lockSchemеs: string[];
  let libraries: {};

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

  let startBlock: number;
  let endBlock: number;
  let rampUpBlock: number;
  let lockBlock: number;
  let secondLockBlock: number;
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
      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
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
    await stakingTokenInstance.mint(test1Account.address, thirty);
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

    LockSchemeInstance = (await deployContract(testAccount, LockSchemeArtifact, [
      libraries,
      lockBlock,
      rampUpBlock,
      bonusPercet,
      LmcInstance.address,
      virtualBlocksTime,
    ])) as LockScheme;

    LockSchemeInstance2 = (await deployContract(testAccount, LockSchemeArtifact, [
      libraries,
      secondLockBlock,
      rampUpBlock,
      bonus20,
      LmcInstance.address,
      virtualBlocksTime,
    ])) as LockScheme;

    LockSchemeInstance3 = (await deployContract(testAccount, LockSchemeArtifact, [
      libraries,
      lockBlock,
      rampUpBlock,
      bonusPercet,
      LmcInstance.address,
      virtualBlocksTime,
    ])) as LockScheme;

    lockSchemеs.push(LockSchemeInstance.address);
    lockSchemеs.push(LockSchemeInstance2.address);
    lockSchemеs.push(LockSchemeInstance3.address);

    await LmcInstance.setLockSchemes(lockSchemеs);
    await rewardTokensInstances[0].mint(LmcInstance.address, amount);
  });

  it('[Should deploy the lock scheme successfully]:', async () => {
    expect(LockSchemeInstance.address);
    expect(LmcInstance.address);
  });

  describe('Staking and Locking', () => {
    beforeEach(async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await stakingTokenInstance.approve(LmcInstance.address, amount);
      await stakingTokenInstance.connect(test2Account).approve(LmcInstance.address, amount);
      await timeTravel(70);
    });

    it('[Should stake and lock sucessfully]:', async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      let userInitialBalance = await stakingTokenInstance.balanceOf(test1Account.address);

      await LmcInstance.stakeAndLock(bTen, LockSchemeInstance.address);

      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      let userFinalBalance = await stakingTokenInstance.balanceOf(test1Account.address);
      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(test1Account.address);
      const userRewardDebt = await LmcInstance.getUserRewardDebt(test1Account.address, 0);
      const userOwedToken = await LmcInstance.getUserOwedTokens(test1Account.address, 0);

      let userInfoLock = await LockSchemeInstance.userInfo(test1Account.address);
      let userBonus = await LockSchemeInstance.getUserBonus(test1Account.address);
      let userAccruedRewards = await LockSchemeInstance.getUserAccruedReward(test1Account.address);
      let currentBlock = await LmcInstance._getBlock();
      await timeTravel(10);

      expect(contractFinalBalance).to.equal(contractInitialBalance.add(bTen));
      expect(userInfoLock.balance).to.equal(bTen);
      expect(userInfoLock.lockInitialStakeBlock).to.equal(currentBlock);
      expect(userAccruedRewards).to.equal(0);
      expect(userBonus).to.equal(0);
      expect(totalStakedAmount).to.equal(bTen);
      expect(userInfo.amountStaked).to.equal(bTen);
      expect(userInfo.firstStakedBlockNumber).to.equal(currentBlock);
      expect(userRewardDebt).to.equal(0);
      expect(userOwedToken).to.equal(0);
      expect(userFinalBalance).to.equal(userInitialBalance.sub(bTen));

      const accumulatedReward = await LmcInstance.getUserAccumulatedReward(test1Account.address, 0);
      expect(accumulatedReward).to.equal(bOne);
    });

    it("[Should stake and lock sucessfully in two different lmc's]:", async () => {
      let currentBlock = await ethers.provider.getBlock('latest');
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      await LmcInstance.stakeAndLock(bTen, LockSchemeInstance2.address);

      await LmcInstance.stakeAndLock(bTwenty, LockSchemeInstance.address);

      await timeTravel(70);
      const accumulatedReward = await LmcInstance.getUserAccumulatedReward(test1Account.address, 0);
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);
      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(test1Account.address);

      let userInfoLock = await LockSchemeInstance.userInfo(test1Account.address);
      let userInfoLock2 = await LockSchemeInstance2.userInfo(test1Account.address);
      let userBonus = await LockSchemeInstance.getUserBonus(test1Account.address);
      currentBlock = await ethers.provider.getBlock('latest');

      expect(contractFinalBalance).to.equal(contractInitialBalance.add(bTen).add(bTwenty));
      expect(userInfoLock.balance).to.equal(bTwenty);
      expect(userInfoLock2.balance).to.equal(bTen);
      expect(userBonus).to.equal(0);
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
      expect(accumulatedReward).to.equal(bOne.mul(7));
    });

    it('[Should fail staking and locking with zero amount]:', async () => {
      await expect(LmcInstance.stakeAndLock(0, LockSchemeInstance.address)).to.be.revertedWith(
        'stakeAndLock::Cannot stake 0'
      );
    });

    it('[Should fail staking and locking if the ramp up period has finished]:', async () => {
      await LmcInstance.stakeAndLock(bTen, LockSchemeInstance2.address);
      await timeTravel(50);

      await expect(LmcInstance.stakeAndLock(bTen, LockSchemeInstance2.address)).to.be.revertedWith(
        'lock::The ramp up period has finished'
      );
    });
  });
  describe('Withdraw and Exit', () => {
    beforeEach(async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await stakingTokenInstance.approve(LmcInstance.address, amount);
      await stakingTokenInstance.connect(test2Account).approve(LmcInstance.address, amount);

      await timeTravel(70);
      await LmcInstance.stakeAndLock(bTen, LockSchemeInstance2.address);
      await timeTravel(80);
      await LmcInstance.stakeAndLock(bTwenty, LockSchemeInstance3.address);
    });

    xit('[Should withdraw and exit sucessfully]:', async () => {
      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(test1Account.address);
      const userInfoInitial = await LmcInstance.userInfo(test1Account.address);
      const initialTotalStakedAmount = await LmcInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(test1Account.address);
      const userRewards = await LmcInstance.getUserAccumulatedReward(test1Account.address, 0);

      await LmcInstance.exitAndUnlock();

      const bonus = await LockSchemeInstance2.getUserBonus(test1Account.address);
      let userInfo = await LockSchemeInstance2.userInfo(test1Account.address);
      let userAccruedRewards = await LockSchemeInstance2.getUserAccruedReward(test1Account.address);
      let userBonus = await LockSchemeInstance2.getUserBonus(test1Account.address);
      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(test1Account.address);
      console.log(userFinalBalanceRewards.toString());
      console.log(userInitialBalanceRewards.toString());
      console.log(bonus.toString());
      console.log(userRewards.toString());

      const userTokensOwed = await LmcInstance.getUserOwedTokens(test1Account.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(test1Account.address);
      const userInfoFinal = await LmcInstance.userInfo(test1Account.address);
      const finalTotalStkaedAmount = await LmcInstance.totalStaked();

      expect(userFinalBalanceRewards).to.gt(userInitialBalanceRewards);
      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards.add(userRewards.add(bonus)));
      expect(userTokensOwed).to.equal(0);
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking.add(standardStakingAmount));
      expect(userInfoFinal.amountStaked).to.equal(userInfoInitial.amountStaked.sub(standardStakingAmount));
      expect(finalTotalStkaedAmount).to.equal(initialTotalStakedAmount.sub(standardStakingAmount));
      expect(userInfo.balance).to.equal(0);
      expect(userAccruedRewards).to.equal(0);
      expect(userBonus).to.equal(bonus);
    });

    it('[Should withdraw sucessfully when staked in two different lmcs]:', async () => {
      let currentBlock = await ethers.provider.getBlock('latest');
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(test1Account.address);

      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(test1Account.address);

      let userInfoLock3 = await LockSchemeInstance3.userInfo(test1Account.address);
      let userInfoLock6 = await LockSchemeInstance2.userInfo(test1Account.address);

      currentBlock = await ethers.provider.getBlock('latest');

      await timeTravel(120);

      const userTokensOwedInitial = await LmcInstance.getUserAccumulatedReward(test1Account.address, 0);
      await LmcInstance.exitAndUnlock();
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      // User has staked 10 Tokens for 6 months, in the next block he has staked 20 in the 3 months.
      // 1 token was accrued as a reward to the 6 month, during the second stake.
      // The tokens owed before the withdraw are 34
      // The rewards which was not calculated is 34-1 = 33. The proportions are 1/3 and 2/3 of 33 = 11 - send to the 6 months, and 22 to the 3 mothns
      // Total accrued reward is 12 to 6 month, and 22 to 3 month
      //  For the bonus for 6 months we calculate 12 (11 + 1) + 20% of 12 = 2.4
      //  For the bonus for 3 omnths we calculate 22  + 10% of 22 = 2.2
      // Totwal reward should be 38.6 tokens;
      let bonus6 = await ethers.utils.parseEther('2.4');
      let bonus3 = await ethers.utils.parseEther('2.2');
      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(test1Account.address);
      const userAccruedRewards = await LmcInstance.userAccruedRewards(test1Account.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.sub(bTen).sub(bTwenty));
      expect(userInfoLock3.balance).to.equal(bTwenty);
      expect(userInfoLock6.balance).to.equal(bTen);
      expect(userFinalBalanceRewards).to.equal(
        userInitialBalanceRewards.add(bonus6).add(bonus3).add(userTokensOwedInitial)
      );
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
      expect(userAccruedRewards).to.equal(0);
    });
    it('[Should withdraw sucessfully when staked in two different lmcs and called only exit]:', async () => {
      let contractInitialBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(test1Account.address);

      const totalStakedAmount = await LmcInstance.totalStaked();
      const userInfo = await LmcInstance.userInfo(test1Account.address);

      let userInfoLock3 = await LockSchemeInstance3.userInfo(test1Account.address);
      let userInfoLock6 = await LockSchemeInstance2.userInfo(test1Account.address);

      await timeTravel(120);
      const userTokensOwedInitial = await LmcInstance.getUserAccumulatedReward(test1Account.address, 0);
      await LmcInstance.exit();
      let contractFinalBalance = await stakingTokenInstance.balanceOf(LmcInstance.address);

      // User has staked 10 Tokens for 6 months, in the next block he has staked 20 in the 3 months.
      // 1 token was accrued as a reward to the 6 month, during the second stake.
      // The tokens owed before the withdraw are 34
      // The rewards which was not calculated is 34-1 = 33. The proportions are 1/3 and 2/3 of 33 = 11 - send to the 6 months, and 22 to the 3 mothns
      // Total accrued reward is 12 to 6 month, and 22 to 3 month
      //  For the bonus for 6 months we calculate 12 (11 + 1) + 20% of 12 = 2.4
      //  For the bonus for 3 omnths we calculate 22  + 10% of 22 = 2.2
      // Totwal reward should be 38.6 tokens;
      let bonus6 = await ethers.utils.parseEther('2.4');
      let bonus3 = await ethers.utils.parseEther('2.2');
      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(test1Account.address);
      const userAccruedRewards = await LmcInstance.userAccruedRewards(test1Account.address);

      expect(contractFinalBalance).to.equal(contractInitialBalance.sub(bTen).sub(bTwenty));
      expect(userInfoLock3.balance).to.equal(bTwenty);
      expect(userInfoLock6.balance).to.equal(bTen);
      expect(userFinalBalanceRewards).to.equal(
        userInitialBalanceRewards.add(bonus6).add(bonus3).add(userTokensOwedInitial)
      );
      expect(totalStakedAmount).to.equal(bTen.add(bTwenty));
      expect(userInfo.amountStaked).to.equal(bTen.add(bTwenty));
      expect(userAccruedRewards).to.equal(0);
    });

    it('[Should exit and stake sucessfully]:', async () => {
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

      let lockScheme = [];

      LockSchemeInstance = (await deployContract(testAccount, LockSchemeArtifact, [
        libraries,
        lockBlock,
        rampUpBlock,
        bonusPercet,
        NewLmcInstance.address,
        virtualBlocksTime,
      ])) as LockScheme;

      lockScheme.push(LockSchemeInstance.address);

      await NewLmcInstance.setLockSchemes(lockScheme);

      await rewardTokensInstances[0].mint(NewLmcInstance.address, amount);

      let externalRewardsTokenInstance: TestERC20 = (await deployContract(testAccount, TestERC20Artifact, [
        amount,
      ])) as TestERC20;

      await externalRewardsTokenInstance.mint(trasury.address, amount);

      let NonCompoundingRewardsPoolInstance = (await deployContract(testAccount, NonCompoundingRewardsPoolArtifact, [
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
      ])) as NonCompoundingRewardsPool;

      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await stakingTokenInstance.approve(NewLmcInstance.address, amount);
      await timeTravel(70);
      await NewLmcInstance.stakeAndLock(bTen, LockSchemeInstance.address);
      await NewLmcInstance.setReceiverWhitelisted(NonCompoundingRewardsPoolInstance.address, true);

      await timeTravel(120);

      let initialBalance = await NonCompoundingRewardsPoolInstance.balanceOf(test1Account.address);
      const userTokensOwedInitial = await NewLmcInstance.getUserAccumulatedReward(test1Account.address, 0);
      // const userInitialBalanceRewards = await rewardTokensInstances[1].balanceOf(test1Account.address);

      //the bonus is 10% of the reward
      const bonus = userTokensOwedInitial.mul(10).div(100);
      await NewLmcInstance.exitAndStake(NonCompoundingRewardsPoolInstance.address);
      // const userFinalBalanceRewards = await rewardTokensInstances[1].balanceOf(test1Account.address);

      let finalBalance = await NonCompoundingRewardsPoolInstance.balanceOf(test1Account.address);
      let totalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
      let userInfo = await NonCompoundingRewardsPoolInstance.userInfo(test1Account.address);
      const userAccruedRewards = await NewLmcInstance.userAccruedRewards(test1Account.address);

      expect(finalBalance).to.gt(initialBalance);
      expect(finalBalance).to.equal(userTokensOwedInitial.add(bonus));
      expect(totalStakedAmount).to.equal(userTokensOwedInitial.add(bonus));
      expect(userInfo.amountStaked).to.equal(finalBalance);
      expect(userAccruedRewards).to.equal(0);
    });

    it('[Should fail calling the claim function only]:', async () => {
      await expect(LmcInstance.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );
    });

    it("[Should return from exit if the user hasn't locked]:", async () => {
      await LmcInstance.connect(test2Account.address).exitAndUnlock();
    });

    it("[Should return from the exit and stake if the user hasn't locked]:", async () => {
      await timeTravel(120);
      await LmcInstance.setReceiverWhitelisted(test1Account.address, true);
      await LmcInstance.connect(test2Account).exitAndStake(test1Account.address);
    });

    it('[Should fail to exit and stake if the poolAddress is not whitelisted]:', async () => {
      await expect(LmcInstance.exitAndStake(test1Account.address)).to.be.revertedWith(
        'exitAndTransfer::receiver is not whitelisted'
      );
    });
  });
});
