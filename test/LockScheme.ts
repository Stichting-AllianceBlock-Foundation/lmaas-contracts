import { BigNumber, Contract } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import LockSchemeArtifact from '../artifacts/contracts/LockScheme.sol/LockScheme.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import PercentageCalculatorArtifact from '../artifacts/contracts/PercentageCalculator.sol/PercentageCalculator.json';
import { PercentageCalculator } from '../typechain-types/PercentageCalculator';
import { LockScheme } from '../typechain-types/LockScheme';
import { TestERC20 } from '../typechain-types/TestERC20';
import { timeTravel } from './utils';

describe.only('LockScheme', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account] = accounts;
  });

  let LockSchemeInstance: LockScheme;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress;

  let rampUpBlock: number;
  let lockEndPeriod: number;

  const bonusPercet = 10000; // In thousands
  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const bOne = ethers.utils.parseEther('1');
  const bTen = ethers.utils.parseEther('10');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const additionalRewards = bTen;

  let startTimestmap;
  let endTimestamp;
  const virtualBlocksTime = 10; // 10s == 10000ms
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    rampUpBlock = 15;
    lockEndPeriod = 30;
  };

  beforeEach(async () => {
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    await stakingTokenInstance.mint(testAccount.address, amount);
    await stakingTokenInstance.mint(test2Account.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    const percentageCalculator: PercentageCalculator = (await deployContract(
      testAccount,
      PercentageCalculatorArtifact
    )) as PercentageCalculator;

    const libraries = {
      PercentageCalculator: percentageCalculator.address,
    };

    LockSchemeInstance = (await deployContract(testAccount, LockSchemeArtifact, [
      libraries,
      lockEndPeriod,
      rampUpBlock,
      bonusPercet,
      testAccount.address,
      virtualBlocksTime,
    ])) as LockScheme;
  });

  it('[Should deploy the lock scheme successfully]:', async () => {
    expect(LockSchemeInstance.address);
  });

  describe('Locking', () => {
    it('[Should lock tokens sucessfully]:', async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);

      let userInfo = await LockSchemeInstance.userInfo(testAccount.address);
      let userBonuses = await LockSchemeInstance.getUserBonus(testAccount.address);
      let userAccruedRewards = await LockSchemeInstance.getUserAccruedReward(testAccount.address);
      const currentBlock = await LockSchemeInstance._getBlock();

      expect(userInfo.balance).to.equal(bOne);
      expect(userInfo.lockInitialStakeBlock).to.equal(currentBlock);
      expect(userAccruedRewards).to.equal(0);
      expect(userBonuses).to.equal(0);
    });

    it('[Should lock tokens two times and not update the lock start block sucessfully]:', async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);
      const currentBlock = await LockSchemeInstance._getBlock();
      await LockSchemeInstance.lock(testAccount.address, bOne);

      let userInfo = await LockSchemeInstance.userInfo(testAccount.address);

      expect(userInfo.balance).to.equal(bOne.add(bOne));
      expect(userInfo.lockInitialStakeBlock).to.equal(currentBlock);
    });

    it('[Should update the user accrued rewards successfully]:', async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);

      await LockSchemeInstance.updateUserAccruedRewards(testAccount.address, bOne);

      let userInfo = await LockSchemeInstance.userInfo(testAccount.address);
      expect(userInfo.accruedReward).to.equal(bOne);
    });

    it("[Should not update the user accrued rewards if the user hasn't locked]:", async () => {
      await LockSchemeInstance.updateUserAccruedRewards(testAccount.address, bOne);
      let userInfo = await LockSchemeInstance.userInfo(testAccount.address);

      expect(userInfo.accruedReward).to.equal(0);
    });

    it('[Should revert if the ramp up block has passed]:', async () => {
      await LockSchemeInstance.lock(testAccount.address, bOne);
      await timeTravel(200);
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await expect(LockSchemeInstance.lock(testAccount.address, bOne)).to.be.revertedWith(
        'lock::The ramp up period has finished'
      );
    });

    it('[Should fail trying to lock from non lmc address]:', async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);
      await expect(LockSchemeInstance.connect(test2Account).lock(testAccount.address, bOne)).to.be.revertedWith(
        'onlyLmc::Caller is not the LMC contract'
      );
    });
  });
  describe('Exitting', () => {
    it('[Should exit sucessfully and update the balances]:', async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);

      await timeTravel(180);
      await LockSchemeInstance.exit(testAccount.address);
      let userInfo = await LockSchemeInstance.userInfo(testAccount.address);
      let userAccruedRewards = await LockSchemeInstance.getUserAccruedReward(testAccount.address);
      let forfeitedBonuses = await LockSchemeInstance.forfeitedBonuses();

      expect(userInfo.balance).to.equal(0);
      expect(userAccruedRewards).to.equal(0);
      expect(forfeitedBonuses).to.equal(0);
    });

    it('[Should exit sucessfully and update the forfeitedBonuses if the exit is before the lock end]:', async () => {
      let initialContractBalance = await stakingTokenInstance.balanceOf(LockSchemeInstance.address);

      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);
      await LockSchemeInstance.updateUserAccruedRewards(testAccount.address, bTen);
      await LockSchemeInstance.exit(testAccount.address);

      let finalContractBalance = await stakingTokenInstance.balanceOf(LockSchemeInstance.address);
      let userInfo = await LockSchemeInstance.userInfo(testAccount.address);
      let userBonus = await LockSchemeInstance.getUserBonus(testAccount.address);
      let userAccruedRewards = await LockSchemeInstance.getUserAccruedReward(testAccount.address);
      let forfeitedBonuses = await LockSchemeInstance.forfeitedBonuses();

      expect(finalContractBalance).to.equal(initialContractBalance);
      expect(userInfo.balance).to.equal(0);
      expect(userAccruedRewards).to.equal(0);
      expect(userBonus).to.equal(0);
      expect(forfeitedBonuses).to.equal(bOne);
    });

    it("[Should not exit if the user hasn't locked]:", async () => {
      let userInfoInitial = await LockSchemeInstance.userInfo(testAccount.address);
      await LockSchemeInstance.exit(testAccount.address);
      let userInfoFinal = await LockSchemeInstance.userInfo(testAccount.address);
      expect(userInfoFinal.balance).to.equal(userInfoInitial.balance);
    });

    it('[Should fail trying to exit from non lmc address]:', async () => {
      await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
      await LockSchemeInstance.lock(testAccount.address, bOne);
      await expect(LockSchemeInstance.connect(test2Account.address).exit(testAccount.address)).to.be.revertedWith(
        'onlyLmc::Caller is not the LMC contract'
      );
    });
  });

  describe('Helpers', () => {
    it('[Should return true if the rampup has ended]:', async () => {
      await timeTravel(120);
      let hasRampUpEnded = await LockSchemeInstance.hasUserRampUpEnded(testAccount.address);
      expect(hasRampUpEnded).to.true;
    });

    it("[Should return the user bonus if the end period hasn't passed]:", async () => {
      await LockSchemeInstance.lock(testAccount.address, bOne);
      let userBonus = await LockSchemeInstance.getUserBonus(testAccount.address);
      expect(userBonus).to.equal(0);
    });

    it('[Should return the user bonus if the end period has passed]:', async () => {
      await LockSchemeInstance.lock(testAccount.address, bOne);
      await timeTravel(10);
      await LockSchemeInstance.updateUserAccruedRewards(testAccount.address, bTen);

      await timeTravel(550);
      let userBonus = await LockSchemeInstance.getUserBonus(testAccount.address);
      expect(userBonus).to.equal(bOne);
    });

    it("[Should return the user's accrued rewards]:", async () => {
      await LockSchemeInstance.lock(testAccount.address, bOne);
      let accruedRewards = await LockSchemeInstance.getUserAccruedReward(testAccount.address);
      expect(accruedRewards).to.be.equal(0);
    });
    it("[Should return the users's locked stake]:", async () => {
      await LockSchemeInstance.lock(testAccount.address, bOne);
      let lockedStake = await LockSchemeInstance.getUserLockedStake(testAccount.address);
      expect(lockedStake).to.equal(bOne);
    });
  });
});
