import { BigNumber, Contract } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import LockSchemeArtifact from '../artifacts/contracts/LockScheme.sol/LockScheme.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import PercentageCalculatorArtifact from '../artifacts/contracts/PercentageCalculator.sol/PercentageCalculator.json';
import LMCArtifact from '../artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import LMCFactoryArtifact from '../artifacts/contracts/LiquidityMiningCampaignFactory.sol/LiquidityMiningCampaignFactory.json';
import RewardsPoolBaseArtifact from '../artifacts/contracts/RewardsPoolBase.sol/RewardsPoolBase.json';
import NonCompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/NonCompoundingRewardsPool.sol/NonCompoundingRewardsPool.json';
import { LockScheme } from '../typechain-types/LockScheme';
import { TestERC20 } from '../typechain-types/TestERC20';
import { LiquidityMiningCampaign } from '../typechain-types/LiquidityMiningCampaign';
import { LiquidityMiningCampaignFactory } from '../typechain-types/LiquidityMiningCampaignFactory';
import { PercentageCalculator } from '../typechain-types/PercentageCalculator';
import { timeTravel } from './utils';
import { NonCompoundingRewardsPool } from '../typechain-types/NonCompoundingRewardsPool';

describe('LMC Factory', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  let LMCFactoryInstance: LiquidityMiningCampaignFactory;
  let lmcInstance: Contract;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let NonCompoundingRewardsPoolInstance: NonCompoundingRewardsPool;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerBlock: BigNumber[];
  let libraries: {};

  let startBlock: number;
  let endBlock: number;
  let rampUpBlock: number;
  let lockBlock: number;

  const duration = 60 * 24 * 60 * 60; // 60 days in seconds
  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const amountToTransfer = ethers.utils.parseEther('10000');
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  let throttleRoundBlocks = 10;
  let throttleRoundCap = ethers.utils.parseEther('1');
  const bTen = ethers.utils.parseEther('10');
  const bonusPercet = 10000; // In thousands
  const contractStakeLimit = amount;

  let startTimestmap: number;
  let endTimestamp: number;
  const virtualBlocksTime = 10; // 10s == 10000ms
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerBlock = [];
    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
      let parsedReward = await ethers.utils.parseEther(`${i + 10}`);
      rewardPerBlock.push(parsedReward);
    }

    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestmap = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestmap + oneMinute * 2;
    startBlock = Math.trunc(startTimestmap / virtualBlocksTime);
    endBlock = Math.trunc(endTimestamp / virtualBlocksTime);
    rampUpBlock = startBlock + 20;
    lockBlock = endBlock + 30;
  };

  beforeEach(async () => {
    await setupRewardsPoolParameters();
    LMCFactoryInstance = (await deployContract(testAccount, LMCFactoryArtifact)) as LiquidityMiningCampaignFactory;
  });

  it('[Should deploy valid rewards pool factory contract]:', async () => {
    expect(LMCFactoryInstance.address);
  });

  describe('Deploying Liquidity Mining Campagin', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [
        ethers.utils.parseEther('300000'),
      ])) as TestERC20;
      stakingTokenAddress = stakingTokenInstance.address;
    });

    it('[Should deploy the lmc successfully]:', async () => {
      await stakingTokenInstance.mint(LMCFactoryInstance.address, amount);
      await rewardTokensInstances[0].mint(LMCFactoryInstance.address, amount);

      await LMCFactoryInstance.deploy(
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        rewardTokensAddresses,
        rewardPerBlock,
        rewardTokensAddresses[0],
        stakeLimit,
        contractStakeLimit,
        virtualBlocksTime
      );

      const lmcContract = await LMCFactoryInstance.rewardsPools(0);
      const LMCInstance = await ethers.getContractAt(LMCArtifact.abi, lmcContract);
      const stakingToken = await LMCInstance.stakingToken();

      expect(stakingTokenAddress.toLowerCase()).to.equal(stakingToken.toLowerCase());
      expect(lmcContract);
    });

    it('[Should fail on deploying not from owner]:', async () => {
      await expect(
        LMCFactoryInstance.connect(test2Account).deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.reverted('Not from owner');
    });

    it('[Should fail on deploying with zero address as staking token]:', async () => {
      await expect(
        LMCFactoryInstance.deploy(
          ethers.constants.AddressZero,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith("LiquidityMiningCampaignFactory::deploy: Staking token address can't be zero address");
    });

    it('[Should fail on zero stake limit]:', async () => {
      await expect(
        LMCFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          0,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('LiquidityMiningCampaignFactory::deploy: Stake limit must be more than 0');
    });

    it('[Should fail the rewards pool array is empty]:', async () => {
      await expect(
        LMCFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          [],
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('LiquidityMiningCampaignFactory::deploy: RewardsTokens array could not be empty');
    });

    it('[Should fail the rewards pool array and rewards amount arrays are with diffferent length]:', async () => {
      rewardPerBlock.push(bOne);

      await expect(
        LMCFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(
        'LiquidityMiningCampaignFactory::deploy: RewardsTokens and RewardPerBlock should have a matching sizes'
      );
    });

    it('[Should fail the rewards has 0 in the array]:', async () => {
      let rewardZero = [0];

      await expect(
        LMCFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardZero,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('LiquidityMiningCampaignFactory::deploy: Reward per block must be greater than zero');
    });

    describe('Whitelisting', async function () {
      beforeEach(async () => {
        await rewardTokensInstances[0].mint(LMCFactoryInstance.address, amount);

        await LMCFactoryInstance.deploy(
          stakingTokenInstance.address,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );

        const percentageCalculator: PercentageCalculator = (await deployContract(
          testAccount,
          PercentageCalculatorArtifact
        )) as PercentageCalculator;

        libraries = {
          PercentageCalculator: percentageCalculator.address,
        };

        const lmcAddress = await LMCFactoryInstance.rewardsPools(0);

        lmcInstance = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);

        let lockScheme = [];

        let LockSchemeInstance: LockScheme = (await deployContract(testAccount, LockSchemeArtifact, [
          libraries,
          lockBlock,
          rampUpBlock,
          bonusPercet,
          lmcInstance.address,
          virtualBlocksTime,
        ])) as LockScheme;

        lockScheme.push(LockSchemeInstance.address);

        await stakingTokenInstance.mint(lmcInstance.address, amount);
        await LMCFactoryInstance.setLockSchemesToLMC(lockScheme, lmcInstance.address);

        await rewardTokensInstances[0].mint(lmcInstance.address, amount);

        let externalRewardsTokenInstance: TestERC20 = (await deployContract(testAccount, TestERC20Artifact, [
          amount,
        ])) as TestERC20;

        await externalRewardsTokenInstance.mint(trasury.address, amount);

        NonCompoundingRewardsPoolInstance = (await deployContract(testAccount, NonCompoundingRewardsPoolArtifact, [
          rewardTokensAddresses[0],
          startTimestmap + 5,
          endTimestamp + 10,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          throttleRoundBlocks,
          throttleRoundCap,
          contractStakeLimit,
          virtualBlocksTime,
        ])) as NonCompoundingRewardsPool;

        await stakingTokenInstance.approve(LockSchemeInstance.address, amount);
        await stakingTokenInstance.approve(lmcInstance.address, amount);
        await stakingTokenInstance.approve(LMCFactoryInstance.address, amount);
        await timeTravel(70);
        await lmcInstance.stakeAndLock(bTen, LockSchemeInstance.address);
      });

      it('[Should fail transfer if receiver not whitelisted]:', async () => {
        await expect(lmcInstance.exitAndStake(trasury.address)).to.be.revertedWith(
          'exitAndTransfer::receiver is not whitelisted'
        );
      });

      it('[Should successfully exit and transfer if receiver whitelisted]:', async () => {
        await timeTravel(70);
        await LMCFactoryInstance.enableReceivers(lmcInstance.address, [NonCompoundingRewardsPoolInstance.address]);
        await lmcInstance.exitAndStake(NonCompoundingRewardsPoolInstance.address);

        let totalStakedAmount = await NonCompoundingRewardsPoolInstance.totalStaked();
        expect(totalStakedAmount).to.gt(0);
      });

      it('[Should fail whitelisting if called with wrong params]:', async () => {
        await expect(
          LMCFactoryInstance.enableReceivers(ethers.constants.AddressZero, [trasury.address])
        ).to.be.revertedWith('enableReceivers::Transferer cannot be 0');

        await expect(
          LMCFactoryInstance.enableReceivers(lmcInstance.address, [ethers.constants.AddressZero])
        ).to.be.revertedWith('enableReceivers::Receiver cannot be 0');
      });

      it('[Should fail whitelisting if not called by the owner]:', async () => {
        await expect(
          LMCFactoryInstance.connect(test2Account).enableReceivers(lmcInstance.address, [
            NonCompoundingRewardsPoolInstance.address,
          ])
        ).to.be.revertedWith('onlyOwner:: The caller is not the owner');
      });
    });

    describe('Extending Rewards', async function () {
      beforeEach(async () => {
        for (let i = 0; i < rewardTokensAddresses.length; i++) {
          await rewardTokensInstances[i].transfer(LMCFactoryInstance.address, amountToTransfer);
        }
        await LMCFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );
      });

      const calculateRewardsAmount = (startTime: number, endTimestamp: number, rewardsPerBlock: number) => {
        let rewardsPeriod = endTimestamp - startTime;
        let rewardsBlockPeriod = Math.trunc(rewardsPeriod / virtualBlocksTime);
        let rewardsAmount = rewardsPerBlock * rewardsBlockPeriod;
        let amount = ethers.BigNumber.from(rewardsAmount.toString());
        return amount;
      };

      it('[Should extend the rewards pool successfully with the same rate]:', async () => {
        let rewardsPoolLength: BigNumber = await LMCFactoryInstance.getRewardsPoolNumber();
        let lmcAddress = await LMCFactoryInstance.rewardsPools(Number(rewardsPoolLength) - 1);
        const LmcContract: Contract = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);
        const rewardTokenInstance = rewardTokensInstances[0];
        let rewardsBalanceInitial = await rewardTokenInstance.balanceOf(LmcContract.address);

        await timeTravel(110);

        let initialEndTime = await LmcContract.endTimestamp();
        let newEndTimestamp = initialEndTime.add(oneMinute);
        let extentionInBlocks = Math.trunc(newEndTimestamp.sub(initialEndTime).div(virtualBlocksTime));

        for (let i = 0; i < rewardTokensCount; i++) {
          let amount = rewardPerBlock[i].mul(extentionInBlocks);
          await rewardTokensInstances[i].transfer(LMCFactoryInstance.address, amount);
        }

        await LMCFactoryInstance.extendRewardPool(newEndTimestamp, rewardPerBlock, lmcAddress);

        let rewardsBalanceFinal = await rewardTokenInstance.balanceOf(LmcContract.address);
        let finalEndTime = await LmcContract.endTimestamp();
        let finalRewardPerBlock = await LmcContract.rewardPerBlock(0);
        let amountToTransfer = rewardPerBlock[0].mul(extentionInBlocks);

        expect(finalEndTime).to.equal(newEndTimestamp);
        expect(finalRewardPerBlock).to.equal(rewardPerBlock[0]);
        expect(rewardsBalanceFinal).to.equal(rewardsBalanceInitial.add(amountToTransfer));
      });

      it('[Should extend the rewards pool successfully with the half of the rate]:', async () => {
        let rewardsPoolLength: BigNumber = await LMCFactoryInstance.getRewardsPoolNumber();
        let lmcAddress = await LMCFactoryInstance.rewardsPools(Number(rewardsPoolLength) - 1);
        const LmcContract = await ethers.getContractAt(RewardsPoolBaseArtifact.abi, lmcAddress);
        const rewardTokenInstance = rewardTokensInstances[0];
        let rewardsBalanceInitial = await rewardTokenInstance.balanceOf(LmcContract.address);

        await timeTravel(110);

        let initialEndTimestamp = await LmcContract.endTimestamp();
        let newEndTimestamp = initialEndTimestamp.add(oneMinute);

        let newRewardPerBlock = [];

        for (let i = 0; i < rewardTokensCount; i++) {
          let newSingleReward = rewardPerBlock[i].div(2);
          newRewardPerBlock.push(newSingleReward);
        }

        await LMCFactoryInstance.extendRewardPool(newEndTimestamp, newRewardPerBlock, lmcAddress);

        let rewardsBalanceFinal = await rewardTokenInstance.balanceOf(LmcContract.address);
        let finalEndTime = await LmcContract.endTimestamp();
        let finalRewardPerBlock = await LmcContract.rewardPerBlock(0);

        expect(finalEndTime).to.equal(newEndTimestamp);
        expect(finalRewardPerBlock).to.equal(newRewardPerBlock[0]);
        expect(rewardsBalanceFinal).to.equal(rewardsBalanceInitial);
      });

      it('[Should extend the rewards pool successfully with the of the lower rate and return some money]:', async () => {
        let rewardsPoolLength: BigNumber = await LMCFactoryInstance.getRewardsPoolNumber();
        let lmcAddress = await LMCFactoryInstance.rewardsPools(Number(rewardsPoolLength) - 1);
        const LMCInstance = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);
        const rewardTokenInstance = rewardTokensInstances[0];
        let rewardsBalanceInitial = await rewardTokenInstance.balanceOf(LMCInstance.address);
        let factoryBalanceInitial = await rewardTokenInstance.balanceOf(LMCFactoryInstance.address);

        await timeTravel(110);

        let initialEndTimestamp = await LMCInstance.endTimestamp();
        let newEndTimestamp = initialEndTimestamp.add(oneMinute);
        let amountToTransfer = [];
        let newRewardPerBlock = [];
        const currentBlock = await ethers.provider.getBlock('latest');

        for (let i = 0; i < rewardTokensCount; i++) {
          let newSingleReward = rewardPerBlock[i].div(5);

          newRewardPerBlock.push(newSingleReward);

          let currentRemainingReward = calculateRewardsAmount(
            currentBlock.timestamp,
            Number(initialEndTimestamp),
            Number(rewardPerBlock[i])
          );

          let newRemainingReward = calculateRewardsAmount(
            currentBlock.timestamp,
            Number(newEndTimestamp),
            Number(newSingleReward)
          );

          amountToTransfer.push(currentRemainingReward.sub(newRemainingReward));
        }

        await LMCFactoryInstance.extendRewardPool(newEndTimestamp, newRewardPerBlock, lmcAddress);
        let rewardsBalanceFinal = await rewardTokenInstance.balanceOf(lmcAddress);
        let factoryBalanceFinal = await rewardTokenInstance.balanceOf(LMCFactoryInstance.address);
        let finalEndTimestamp = await LMCInstance.endTimestamp();
        let finalRewardPerBlock = await LMCInstance.rewardPerBlock(0);

        expect(finalEndTimestamp).to.equal(newEndTimestamp);
        expect(finalRewardPerBlock).to.equal(newRewardPerBlock[0]);
        expect(rewardsBalanceFinal).to.equal(rewardsBalanceInitial.sub(amountToTransfer[0]));
        expect(factoryBalanceFinal).to.equal(factoryBalanceInitial.add(amountToTransfer[0]));
      });

      it('[Should extend the rewards pool successfully on a expired pool with the same rate]:', async () => {
        await timeTravel(60 * 4);
        let rewardsPoolLength: BigNumber = await LMCFactoryInstance.getRewardsPoolNumber();
        let lmcAddress = await LMCFactoryInstance.rewardsPools(Number(rewardsPoolLength) - 1);
        const LmcContract = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);

        let currentTimestamp = await ethers.BigNumber.from(
          String((await ethers.provider.getBlock('latest')).timestamp)
        );
        let newEndTimestamp = currentTimestamp.add(oneMinute);

        for (let i = 0; i < rewardTokensCount; i++) {
          let amount = calculateRewardsAmount(
            Number(currentTimestamp),
            Number(newEndTimestamp),
            Number(rewardPerBlock[i])
          );

          await rewardTokensInstances[i].transfer(LMCFactoryInstance.address, amount);
        }

        await LMCFactoryInstance.extendRewardPool(newEndTimestamp, rewardPerBlock, lmcAddress);

        let finalEndTime = await LmcContract.endTimestamp();
        let finalRewardPerBlock = await LmcContract.rewardPerBlock(0);

        expect(finalEndTime).to.equal(newEndTimestamp);
        expect(finalRewardPerBlock).to.equal(rewardPerBlock[0]);
      });

      it('[Should fail trying to extend from not owner]:', async () => {
        let rewardsPoolAddress = await LMCFactoryInstance.rewardsPools(0);
        let newEndBlock = endBlock + 10;

        await expect(
          LMCFactoryInstance.connect(test2Account).extendRewardPool(newEndBlock, rewardPerBlock, rewardsPoolAddress)
        ).to.be.revertedWith('onlyOwner:: The caller is not the owner');
      });
    });

    describe('Set LockSchemes', async function () {
      beforeEach(async () => {
        for (let i = 0; i < rewardTokensAddresses.length; i++) {
          await rewardTokensInstances[i].transfer(LMCFactoryInstance.address, amountToTransfer);
        }

        await LMCFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          rewardTokensAddresses[0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );
      });

      it('[Should set LockSchemes properly]:', async () => {
        const percentageCalculator: PercentageCalculator = (await deployContract(
          testAccount,
          PercentageCalculatorArtifact
        )) as PercentageCalculator;

        libraries = {
          PercentageCalculator: percentageCalculator.address,
        };

        const lmcAddress = await LMCFactoryInstance.rewardsPools(0);

        lmcInstance = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);

        let lockScheme = [];

        let LockSchemeInstance: LockScheme = (await deployContract(testAccount, LockSchemeArtifact, [
          libraries,
          lockBlock,
          rampUpBlock,
          bonusPercet,
          lmcInstance.address,
          virtualBlocksTime,
        ])) as LockScheme;

        lockScheme.push(LockSchemeInstance.address);

        await LMCFactoryInstance.setLockSchemesToLMC(lockScheme, lmcInstance.address);
        let isLockSchemeSet = await lmcInstance.lockSchemesExist(LockSchemeInstance.address);
        let lockSchemeaddress = await lmcInstance.lockSchemes(0);

        expect(lockSchemeaddress.toLowerCase()).to.equal(LockSchemeInstance.address.toLowerCase());
        expect(isLockSchemeSet).to.true;
      });

      it('[Should not set the same lock scheme twice]:', async () => {
        const percentageCalculator: PercentageCalculator = (await deployContract(
          testAccount,
          PercentageCalculatorArtifact
        )) as PercentageCalculator;

        libraries = {
          PercentageCalculator: percentageCalculator.address,
        };

        const lmcAddress = await LMCFactoryInstance.rewardsPools(0);

        lmcInstance = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);

        let lockScheme = [];

        let LockSchemeInstance: LockScheme = (await deployContract(testAccount, LockSchemeArtifact, [
          libraries,
          lockBlock,
          rampUpBlock,
          bonusPercet,
          lmcInstance.address,
          virtualBlocksTime,
        ])) as LockScheme;

        lockScheme.push(LockSchemeInstance.address);

        await LMCFactoryInstance.setLockSchemesToLMC(lockScheme, lmcInstance.address);
        await LMCFactoryInstance.setLockSchemesToLMC(lockScheme, lmcInstance.address);
        let isLockSchemeSet = await lmcInstance.lockSchemesExist(LockSchemeInstance.address);
        let lockSchemeaddress = await lmcInstance.lockSchemes(0);

        expect(lockSchemeaddress.toLowerCase()).to.equal(LockSchemeInstance.address.toLowerCase());
        expect(isLockSchemeSet).to.true;
        await expect(lmcInstance.lockSchemes(1)).to.be.reverted('Not exist');
      });

      it('[Should be able to add more LockSchemes]:', async () => {
        const percentageCalculator: PercentageCalculator = (await deployContract(
          testAccount,
          PercentageCalculatorArtifact
        )) as PercentageCalculator;

        const lmcAddress = await LMCFactoryInstance.rewardsPools(0);

        lmcInstance = await ethers.getContractAt(LMCArtifact.abi, lmcAddress);

        let lockScheme = [];
        let lockSchemeSecond = [];

        let LockSchemeInstance: LockScheme = (await deployContract(testAccount, LockSchemeArtifact, [
          libraries,
          lockBlock,
          rampUpBlock,
          bonusPercet,
          lmcInstance.address,
          virtualBlocksTime,
        ])) as LockScheme;

        let LockSchemeInstanceSecond: LockScheme = (await deployContract(testAccount, LockSchemeArtifact, [
          libraries,
          lockBlock,
          rampUpBlock,
          bonusPercet,
          lmcInstance.address,
          virtualBlocksTime,
        ])) as LockScheme;

        lockScheme.push(LockSchemeInstance.address);
        lockSchemeSecond.push(LockSchemeInstanceSecond.address);

        await LMCFactoryInstance.setLockSchemesToLMC(lockScheme, lmcInstance.address);

        let isFirstLockSchemeSet = await lmcInstance.lockSchemesExist(LockSchemeInstance.address);
        let firstLockSchemeaddress = await lmcInstance.lockSchemes(0);

        await LMCFactoryInstance.setLockSchemesToLMC(lockSchemeSecond, lmcInstance.address);

        let isSecondLockSchemeSet = await lmcInstance.lockSchemesExist(LockSchemeInstanceSecond.address);
        let secondLockSchemeaddress = await lmcInstance.lockSchemes(1);

        expect(firstLockSchemeaddress.toLowerCase()).to.equal(LockSchemeInstance.address.toLowerCase());
        expect(isFirstLockSchemeSet).to.true;
        expect(secondLockSchemeaddress.toLowerCase()).to.equal(LockSchemeInstanceSecond.address.toLowerCase());
        expect(isSecondLockSchemeSet).to.true;
      });
    });
  });
});
