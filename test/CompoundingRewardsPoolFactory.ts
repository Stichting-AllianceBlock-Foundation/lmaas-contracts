import { BigNumber, Contract } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import CompoundingRewardsPoolStakerArtifact from '../artifacts/contracts/V2/CompoundingRewardsPoolStaker.sol/CompoundingRewardsPoolStaker.json';
import CompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/CompoundingRewardsPool.sol/CompoundingRewardsPool.json';
import CompoundingRewardsPoolFactoryArtifact from '../artifacts/contracts/V2/factories/CompoundingRewardsPoolFactory.sol/CompoundingRewardsPoolFactory.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import RewardsPoolBaseArtifact from '../artifacts/contracts/RewardsPoolBase.sol/RewardsPoolBase.json';
import { CompoundingRewardsPoolFactory } from '../typechain-types/CompoundingRewardsPoolFactory';
import { TestERC20 } from '../typechain-types/TestERC20';

describe.only('CompoundingRewardsPoolFactory', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  let CompoundingRewardsPoolFactoryInstance: CompoundingRewardsPoolFactory;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let externalRewardsTokenInstance: TestERC20;
  let externalRewardsTokenAddress: string;
  let endBlock: number;

  const duration = 60 * 24 * 60 * 60; // 60 days in seconds
  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const contractStakeLimit = amount;
  const amountToTransfer = ethers.utils.parseEther('10000');
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens

  let startTimestmap: number;
  let endTimestamp: number;

  const virtualBlocksTime = 10; // 10s == 10000ms
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestmap = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestmap + oneMinute * 2;
    endBlock = Math.trunc(endTimestamp / virtualBlocksTime);
  };

  beforeEach(async () => {
    externalRewardsTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [
      ethers.utils.parseEther('300000'),
    ])) as TestERC20;
    externalRewardsTokenAddress = externalRewardsTokenInstance.address;

    await setupRewardsPoolParameters();
    CompoundingRewardsPoolFactoryInstance = (await deployContract(
      testAccount,
      CompoundingRewardsPoolFactoryArtifact
    )) as CompoundingRewardsPoolFactory;
  });

  it('[Should deploy valid rewards pool factory contract]:', async () => {
    expect(CompoundingRewardsPoolFactoryInstance.address).to.true;
  });

  describe('Deploying CompoundingStaker and CompoundingRewardsPoolFactory', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [
        ethers.utils.parseEther('300000'),
      ])) as TestERC20;
      stakingTokenAddress = stakingTokenInstance.address;
    });

    it('[Should deploy base rewards pool successfully]:', async () => {
      await stakingTokenInstance.mint(CompoundingRewardsPoolFactoryInstance.address, amount);

      await CompoundingRewardsPoolFactoryInstance.deploy(
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        bOne,
        standardStakingAmount,
        20,
        standardStakingAmount,
        contractStakeLimit
      );

      const firstStakerContract = await CompoundingRewardsPoolFactoryInstance.rewardsPools(0);
      const StakerContract = await ethers.getContractAt(CompoundingRewardsPoolStakerArtifact.abi, firstStakerContract);
      const stakingToken = await StakerContract.stakingToken();
      const rewardPool = await StakerContract.rewardPool();
      const rewardsPoolContract = await ethers.getContractAt(CompoundingRewardsPoolArtifact.abi, rewardPool);
      const staker = await rewardsPoolContract.staker();

      expect(stakingTokenAddress.toLowerCase()).to.equal(stakingToken.toLowerCase());
      expect(firstStakerContract);
      expect(staker).to.equal(firstStakerContract);
    });

    it('[Should fail on deploying not from owner]:', async () => {
      await expect(
        CompoundingRewardsPoolFactoryInstance.connect(test2Account).deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          bOne,
          stakeLimit,
          5,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.reverted('not owner');
    });

    it('[Should fail on deploying with zero address as staking token]:', async () => {
      await expect(
        CompoundingRewardsPoolFactoryInstance.deploy(
          ethers.constants.AddressZero,
          startTimestmap,
          endTimestamp,
          bOne,
          stakeLimit,
          5,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith("CompoundingRewardsPoolFactory::deploy: Staking token address can't be zero address");
    });

    it('[Should fail if the reward amount is not greater than zero]:', async () => {
      await expect(
        CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          0,
          standardStakingAmount,
          20,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('CompoundingRewardsPoolFactory::deploy: Reward per block must be more than 0');
    });

    it('[Should fail on zero stake limit]:', async () => {
      await expect(
        CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          bOne,
          0,
          20,
          standardStakingAmount,
          virtualBlocksTime
        )
      ).to.be.revertedWith('CompoundingRewardsPoolFactory::deploy: Stake limit must be more than 0');
    });

    it('[Should fail on zero throttle rounds or cap]:', async () => {
      await expect(
        CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          bOne,
          contractStakeLimit,
          20,
          0,
          virtualBlocksTime
        )
      ).to.be.revertedWith('CompoundingRewardsPoolFactory::deploy: Throttle round blocks must be more than 0');

      await expect(
        CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          bOne,
          contractStakeLimit,
          20,
          0,
          virtualBlocksTime
        )
      ).to.be.revertedWith('CompoundingRewardsPoolFactory::deploy: Throttle round cap must be more than 0');
    });

    it('[Should fail if not enough reward is sent]:', async () => {
      await stakingTokenInstance.mint(CompoundingRewardsPoolFactoryInstance.address, 1);
      await expect(
        CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          bOne,
          contractStakeLimit,
          20,
          standardStakingAmount,
          virtualBlocksTime
        )
      ).to.be.revertedWith('SafeERC20: low-level call failed');
    });

    describe('Whitelisting', async function () {
      let transferer: Contract;
      let receiver: Contract;

      beforeEach(async () => {
        await stakingTokenInstance.mint(CompoundingRewardsPoolFactoryInstance.address, amount);
        await CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          bOne,
          contractStakeLimit,
          20,
          standardStakingAmount,
          virtualBlocksTime
        );

        await CompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp + 10,
          bOne,
          contractStakeLimit,
          20,
          standardStakingAmount,
          virtualBlocksTime
        );

        const transfererAddress = await CompoundingRewardsPoolFactoryInstance.rewardsPools(0);
        const receiverAddress = await CompoundingRewardsPoolFactoryInstance.rewardsPools(1);
        transferer = await ethers.getContractAt(CompoundingRewardsPoolStakerArtifact.abi, transfererAddress);
        receiver = await ethers.getContractAt(CompoundingRewardsPoolStakerArtifact.abi, receiverAddress);
      });

      it('[Should fail transfer if receiver not whitelisted]:', async () => {
        await expect(transferer.exitAndTransfer(receiver.address)).to.be.revertedWith(
          'exitAndTransfer::receiver is not whitelisted'
        );
      });

      it('[Should successfully exit and transfer if receiver whitelisted]:', async () => {
        const transfererSharesBefore = await transferer.totalShares();
        const receiverSharesBefore = await receiver.totalShares();

        await CompoundingRewardsPoolFactoryInstance.enableReceivers(transferer.address, [receiver.address]);
        await transferer.exitAndTransfer(receiver.address);

        const transfererSharesAfter = await transferer.totalShares();
        const receiverSharesAfter = await receiver.totalShares();

        expect(transfererSharesBefore).to.equal(receiverSharesAfter);
        expect(receiverSharesBefore).to.equal(transfererSharesAfter);
      });

      it('[Should fail whitelisting if called with wrong params]:', async () => {
        await expect(
          CompoundingRewardsPoolFactoryInstance.enableReceivers(ethers.constants.AddressZero, [receiver.address])
        ).to.be.revertedWith('enableReceivers::Transferer cannot be 0');

        await expect(
          CompoundingRewardsPoolFactoryInstance.enableReceivers(transferer.address, [ethers.constants.AddressZero])
        ).to.be.revertedWith('enableReceivers::Receiver cannot be 0');
      });

      it('[Should fail whitelisting if not called by the owner]:', async () => {
        await expect(
          CompoundingRewardsPoolFactoryInstance.connect(test1Account).enableReceivers(transferer.address, [
            receiver.address,
          ])
        ).to.be.revertedWith('onlyOwner:: The caller is not the owner');
      });
    });
  });
});
