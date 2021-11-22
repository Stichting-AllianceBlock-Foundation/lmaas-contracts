import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { NonCompoundingRewardsPoolFactory } from '../typechain-types/NonCompoundingRewardsPoolFactory';
import { NonCompoundingRewardsPool } from '../typechain-types/NonCompoundingRewardsPool';
import { timeTravel } from './utils';

describe('NonCompoundingRewardsPoolFactory', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;

  let NonCompoundingRewardsPoolFactoryInstance: NonCompoundingRewardsPoolFactory;
  let stakingTokenInstance: TestERC20;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerBlock: BigNumber[];

  let startBlock: number;
  let endBlock: number;

  const duration = 60 * 24 * 60 * 60; // 60 days in seconds
  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const amountToTransfer = ethers.utils.parseEther('10000');
  const contractStakeLimit = ethers.utils.parseEther('10'); // 10 tokens

  let startTimestmap: number;
  let endTimestamp: number;
  const virtualBlocksTime = 10; // 10s == 10000ms
  const oneMinute = 60;

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerBlock = [];
    for (let i = 0; i < rewardTokensCount; i++) {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      const tknInst = (await TestERC20.deploy(amount)) as TestERC20;

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
  };

  beforeEach(async () => {
    [aliceAccount, bobAccount] = await ethers.getSigners();

    await setupRewardsPoolParameters();

    const NonCompoundingRewardsPoolFactory = await ethers.getContractFactory('NonCompoundingRewardsPoolFactory');
    NonCompoundingRewardsPoolFactoryInstance =
      (await NonCompoundingRewardsPoolFactory.deploy()) as NonCompoundingRewardsPoolFactory;
  });

  describe('Deploying NonCompoundingRewardsPool', async function () {
    let stakingTokenAddress: string;

    beforeEach(async () => {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      stakingTokenInstance = (await TestERC20.deploy('300000')) as TestERC20;
      stakingTokenAddress = stakingTokenInstance.address;
    });

    it('Should deploy base rewards pool successfully', async () => {
      for (let i = 0; i < rewardTokensAddresses.length; i++) {
        await rewardTokensInstances[i].transfer(NonCompoundingRewardsPoolFactoryInstance.address, amountToTransfer);
      }
      await NonCompoundingRewardsPoolFactoryInstance.deploy(
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        rewardTokensAddresses,
        rewardPerBlock,
        stakeLimit,
        10,
        stakeLimit,
        contractStakeLimit,
        virtualBlocksTime
      );

      const firstRewardsPool = await NonCompoundingRewardsPoolFactoryInstance.rewardsPools(0);

      const NonCompoundingRewardsPool = await ethers.getContractFactory('NonCompoundingRewardsPool');
      const RewardsPoolContract = (await NonCompoundingRewardsPool.attach(
        firstRewardsPool
      )) as NonCompoundingRewardsPool;
      const stakingToken = await RewardsPoolContract.stakingToken();

      expect(stakingTokenAddress.toLowerCase()).to.equal(
        stakingToken.toLowerCase(),
        'The saved staking token was not the same as the inputted one'
      );
    });

    it('Should deploy the rewards pool contract with the correct data', async () => {
      for (let i = 0; i < rewardTokensAddresses.length; i++) {
        await rewardTokensInstances[i].transfer(NonCompoundingRewardsPoolFactoryInstance.address, amountToTransfer);
      }

      await NonCompoundingRewardsPoolFactoryInstance.deploy(
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        rewardTokensAddresses,
        rewardPerBlock,
        stakeLimit,
        10,
        stakeLimit,
        contractStakeLimit,
        virtualBlocksTime
      );

      let rewardsPoolLength = await NonCompoundingRewardsPoolFactoryInstance.getRewardsPoolNumber();
      let rewardsPoolAddress = await NonCompoundingRewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));

      // check if correctly stored in staking contract
      const NonCompoundingRewardsPool = await ethers.getContractFactory('NonCompoundingRewardsPool');
      const RewardsPoolContract = (await NonCompoundingRewardsPool.attach(
        rewardsPoolAddress
      )) as NonCompoundingRewardsPool;

      for (let i = 0; i < rewardTokensAddresses.length; i++) {
        const tokenAddress = await RewardsPoolContract.rewardsTokens(i);
        expect(tokenAddress).to.equal(
          rewardTokensAddresses[i],
          `The saved address of the reward token ${i} was incorrect`
        );

        const rewardPerBlock = await RewardsPoolContract.rewardPerBlock(i);
        expect(rewardPerBlock).to.equal(
          ethers.utils.parseEther(`${i + 10}`),
          'The saved reward per block is incorrect'
        );

        const accumulatedMultiplier = await RewardsPoolContract.accumulatedRewardMultiplier(i);
        expect(accumulatedMultiplier).to.equal(0, 'The saved accumulatedMultiplier is incorrect');
      }

      const totalStaked = await RewardsPoolContract.totalStaked();
      expect(totalStaked).to.equal(0, 'There was something staked already');

      const savedStartBlock = await RewardsPoolContract.startBlock();
      expect(savedStartBlock).to.equal(startBlock, 'The start block saved was incorrect');

      const savedEndBlock = await RewardsPoolContract.endBlock();
      expect(savedEndBlock).to.equal(endBlock, 'The end block saved was incorrect');
    });

    it('Should fail on deploying not from owner', async () => {
      await expect(
        NonCompoundingRewardsPoolFactoryInstance.connect(bobAccount).deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should fail on deploying with zero address as staking token', async () => {
      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          ethers.constants.AddressZero,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith("NonCompoundingRewardsPoolFactory::deploy: Staking token address can't be zero address");
    });

    it('Should fail on deploying with empty token and reward arrays', async () => {
      const errorString = 'NonCompoundingRewardsPoolFactory::deploy: RewardsTokens array could not be empty';
      const errorStringMatchingSizes =
        'NonCompoundingRewardsPoolFactory::deploy: RewardsTokens and RewardPerBlock should have a matching sizes';
      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          [],
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorString);

      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          [],
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorStringMatchingSizes);
    });

    it('Should fail if the reward amount is not greater than zero', async () => {
      const errorString = 'NonCompoundingRewardsPoolFactory::deploy: Reward token address could not be invalid';

      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          [ethers.constants.AddressZero],
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorString);
    });

    it('Should fail if the reward token amount is invalid address', async () => {
      const errorString = 'NonCompoundingRewardsPoolFactory::deploy: Reward per block must be greater than zero';

      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          [0],
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorString);
    });

    it('Should fail on deploying with no stake limit', async () => {
      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          0,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('NonCompoundingRewardsPoolFactory::deploy: Stake limit must be more than 0');
    });

    it('Should fail on deploying with wrong throttle params', async () => {
      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          0,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('NonCompoundingRewardsPoolFactory::deploy: Throttle round blocks must be more than 0');

      await expect(
        NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          0,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('NonCompoundingRewardsPoolFactory::deploy: Throttle round cap must be more than 0');
    });

    describe('Whitelisting', async function () {
      let transferer: NonCompoundingRewardsPool;
      let receiver: NonCompoundingRewardsPool;
      let notEndedTransferer: NonCompoundingRewardsPool;
      let notEndedReceiver: NonCompoundingRewardsPool;

      beforeEach(async () => {
        for (let i = 0; i < rewardTokensAddresses.length; i++) {
          await rewardTokensInstances[i].transfer(NonCompoundingRewardsPoolFactoryInstance.address, amountToTransfer);
        }

        await NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );

        await NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp + oneMinute,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );

        await NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp + oneMinute,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );

        await NonCompoundingRewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp + oneMinute,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          10,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );

        const NonCompoundingRewardsPool = await ethers.getContractFactory('NonCompoundingRewardsPool');

        const transfererAddress = await NonCompoundingRewardsPoolFactoryInstance.rewardsPools(0);
        const receiverAddress = await NonCompoundingRewardsPoolFactoryInstance.rewardsPools(1);
        transferer = (await NonCompoundingRewardsPool.attach(transfererAddress)) as NonCompoundingRewardsPool;
        receiver = (await NonCompoundingRewardsPool.attach(receiverAddress)) as NonCompoundingRewardsPool;

        const notEndedTransfererrAddress = await NonCompoundingRewardsPoolFactoryInstance.rewardsPools(2);
        const notEndedReceiverAddress = await NonCompoundingRewardsPoolFactoryInstance.rewardsPools(3);
        notEndedTransferer = (await NonCompoundingRewardsPool.attach(
          notEndedTransfererrAddress
        )) as NonCompoundingRewardsPool;
        notEndedReceiver = (await NonCompoundingRewardsPool.attach(
          notEndedReceiverAddress
        )) as NonCompoundingRewardsPool;

        let currentBlock = await ethers.provider.getBlock('latest');

        const standardStakingAmount = ethers.utils.parseEther('5');
        await stakingTokenInstance.mint(aliceAccount.address, amountToTransfer);
        await stakingTokenInstance.approve(transferer.address, ethers.constants.MaxUint256);

        await timeTravel(70);

        await transferer.connect(aliceAccount.address).stake(standardStakingAmount);

        currentBlock = await ethers.provider.getBlock('latest');

        await timeTravel(70);
      });

      it('Should fail transfer if receiver not whitelisted', async () => {
        await timeTravel(70);

        await expect(transferer.exitAndTransfer(receiver.address)).to.be.revertedWith(
          'exitAndTransfer::receiver is not whitelisted'
        );
      });

      it('Should successfully exit and transfer if receiver whitelisted', async () => {
        const transfererStakesBefore = await transferer.totalStaked();
        const receiverStakesBefore = await receiver.totalStaked();
        await timeTravel(70);
        await NonCompoundingRewardsPoolFactoryInstance.enableReceivers(transferer.address, [receiver.address]);
        await transferer.connect(aliceAccount.address).exitAndTransfer(receiver.address);

        const transfererSharesAfter = await transferer.totalStaked();
        const receiverSharesAfter = await receiver.totalStaked();

        expect(transfererStakesBefore).to.equal(receiverSharesAfter, 'Shares were not tranferred correctly');
        expect(receiverStakesBefore).to.equal(transfererSharesAfter, 'Shares were cleared correctly');
      });

      it('Should fail whitelisting if called with wrong params', async () => {
        await expect(
          NonCompoundingRewardsPoolFactoryInstance.enableReceivers(ethers.constants.AddressZero, [receiver.address])
        ).to.be.revertedWith('enableReceivers::Transferer cannot be 0');

        await expect(
          NonCompoundingRewardsPoolFactoryInstance.enableReceivers(transferer.address, [ethers.constants.AddressZero])
        ).to.be.revertedWith('enableReceivers::Receiver cannot be 0');
      });

      it('Should fail whitelisting if not called by the owner', async () => {
        await expect(
          NonCompoundingRewardsPoolFactoryInstance.connect(bobAccount).enableReceivers(transferer.address, [
            receiver.address,
          ])
        ).to.be.revertedWith('onlyOwner:: The caller is not the owner');
      });

      it('Should fail to migrate if the campaign has not ended', async () => {
        await NonCompoundingRewardsPoolFactoryInstance.enableReceivers(notEndedTransferer.address, [
          notEndedReceiver.address,
        ]);

        await expect(notEndedTransferer.exitAndTransfer(notEndedReceiver.address)).to.be.revertedWith(
          'onlyUnlocked::cannot perform this action until the end of the lock'
        );
      });
    });
  });
});
