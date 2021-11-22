import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { RewardsPoolFactory } from '../typechain-types/RewardsPoolFactory';
import { RewardsPoolBase } from '../typechain-types/RewardsPoolBase';
import { timeTravel } from './utils';

describe('RewardsPoolFactory', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;
  let carolAccount: SignerWithAddress;

  let RewardsPoolFactoryInstance: RewardsPoolFactory;
  let stakingTokenInstance: TestERC20;
  let lpContractInstance: TestERC20;

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
    [aliceAccount, bobAccount, carolAccount] = await ethers.getSigners();

    await setupRewardsPoolParameters();
    const RewardsPoolFactory = await ethers.getContractFactory('RewardsPoolFactory');
    RewardsPoolFactoryInstance = (await RewardsPoolFactory.deploy()) as RewardsPoolFactory;
  });

  describe('Deploying RewardsPoolBase', async function () {
    let stakingTokenAddress: string;

    beforeEach(async () => {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      stakingTokenInstance = (await TestERC20.deploy('300000')) as TestERC20;
      stakingTokenAddress = stakingTokenInstance.address;
    });

    it('Should deploy base rewards pool successfully', async () => {
      for (let i = 0; i < rewardTokensAddresses.length; i++) {
        await rewardTokensInstances[i].transfer(RewardsPoolFactoryInstance.address, amountToTransfer);
      }
      await RewardsPoolFactoryInstance.deploy(
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        rewardTokensAddresses,
        rewardPerBlock,
        stakeLimit,
        contractStakeLimit,
        virtualBlocksTime
      );

      const firstRewardsPool = await RewardsPoolFactoryInstance.rewardsPools(0);

      const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
      const RewardsPoolContract = (await RewardsPoolBase.attach(firstRewardsPool)) as RewardsPoolBase;

      const stakingToken = await RewardsPoolContract.stakingToken();

      expect(stakingTokenAddress.toLowerCase()).to.equal(
        stakingToken.toLowerCase(),
        'The saved staking token was not the same as the inputted one'
      );
    });

    it('Should deploy the rewards pool contract with the correct data', async () => {
      for (let i = 0; i < rewardTokensAddresses.length; i++) {
        await rewardTokensInstances[i].transfer(RewardsPoolFactoryInstance.address, amountToTransfer);
      }
      await RewardsPoolFactoryInstance.deploy(
        stakingTokenAddress,
        startTimestmap,
        endTimestamp,
        rewardTokensAddresses,
        rewardPerBlock,
        stakeLimit,
        contractStakeLimit,
        virtualBlocksTime
      );
      let rewardsPoolLength = await RewardsPoolFactoryInstance.getRewardsPoolNumber();
      let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));

      // check if correctly stored in staking contract
      const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
      const RewardsPoolContract = (await RewardsPoolBase.attach(rewardsPoolAddress)) as RewardsPoolBase;

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

      const virtualBlockTime = await RewardsPoolContract.getBlockTime();
      expect(virtualBlockTime).to.equal(virtualBlocksTime, 'The virtual block time saved was incorrect');
    });

    it('Should fail on deploying not from owner', async () => {
      await expect(
        RewardsPoolFactoryInstance.connect(bobAccount).deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should fail on deploying with zero address as staking token', async () => {
      await expect(
        RewardsPoolFactoryInstance.deploy(
          ethers.constants.AddressZero,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith("RewardsPoolFactory::deploy: Staking token address can't be zero address");
    });

    it('Should fail on deploying with empty token and reward arrays', async () => {
      const errorString = 'RewardsPoolFactory::deploy: RewardsTokens array could not be empty';
      const errorStringMatchingSizes =
        'RewardsPoolFactory::deploy: RewardsTokens and RewardPerBlock should have a matching sizes';
      await expect(
        RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          [],
          rewardPerBlock,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorString);
      await expect(
        RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          [],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorStringMatchingSizes);
    });

    it('Should fail if the reward amount is not greater than zero', async () => {
      const errorString = 'RewardsPoolFactory::deploy: Reward token address could not be invalid';
      await expect(
        RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          [ethers.constants.AddressZero],
          rewardPerBlock,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorString);
    });

    it('Should fail if the reward token amount is invalid address', async () => {
      const errorString = 'RewardsPoolFactory::deploy: Reward per block must be greater than zero';
      await expect(
        RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          [0],
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith(errorString);
    });

    it('Should fail on deploying zero stake limit', async () => {
      await expect(
        RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          0,
          contractStakeLimit,
          virtualBlocksTime
        )
      ).to.be.revertedWith('RewardsPoolFactory::deploy: Stake limit must be more than 0');
    });

    it('Should fail on deploying with zero contract stake limit', async () => {
      await expect(
        RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          0,
          virtualBlocksTime
        )
      ).to.be.revertedWith('Constructor:: Contract Stake limit needs to be more than 0');
    });

    describe('Extending Rewards', async function () {
      beforeEach(async () => {
        for (let i = 0; i < rewardTokensAddresses.length; i++) {
          await rewardTokensInstances[i].transfer(RewardsPoolFactoryInstance.address, amountToTransfer);
        }
        await RewardsPoolFactoryInstance.deploy(
          stakingTokenAddress,
          startTimestmap,
          endTimestamp,
          rewardTokensAddresses,
          rewardPerBlock,
          stakeLimit,
          contractStakeLimit,
          virtualBlocksTime
        );
      });

      const calculateRewardsAmount = async (startTime: number, endTime: number, rewardsPerBlock: BigNumber) => {
        let rewardsPeriod = endTimestamp - startTime;
        let rewardsBlockPeriod = Math.trunc(rewardsPeriod / virtualBlocksTime);
        let rewardsAmount = rewardsPerBlock.mul(rewardsBlockPeriod);
        return rewardsAmount;
      };

      it('Should extend the rewards pool successfully with the same rate', async () => {
        let rewardsPoolLength = await RewardsPoolFactoryInstance.getRewardsPoolNumber();
        let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));

        const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
        const RewardsPoolContract = (await RewardsPoolBase.attach(rewardsPoolAddress)) as RewardsPoolBase;

        const rewardTokenInstance = rewardTokensInstances[0];
        let rewardsBalanceInitial = await rewardTokenInstance.balanceOf(RewardsPoolContract.address);

        await timeTravel(100);
        let initialEndTimestamp = await RewardsPoolContract.endTimestamp();
        let newEndTimestamp = initialEndTimestamp.add(oneMinute);
        let extentionInBlocks = Math.trunc(newEndTimestamp.sub(initialEndTimestamp).div(virtualBlocksTime).toNumber());
        for (let i = 0; i < rewardTokensCount; i++) {
          // let amount = await RewardsPoolFactoryInstance.calculateRewardsAmount(currentBlock.number,newEndBlock,rewardPerBlock[0])
          let amount = rewardPerBlock[i].mul(extentionInBlocks);
          await rewardTokensInstances[i].mint(RewardsPoolFactoryInstance.address, amountToTransfer);
        }
        await RewardsPoolFactoryInstance.extendRewardPool(newEndTimestamp, rewardPerBlock, rewardsPoolAddress);
        let te = await RewardsPoolFactoryInstance.rewardsAmount();

        let rewardsBalanceFinal = await rewardTokenInstance.balanceOf(RewardsPoolContract.address);
        let finalEndTime = await RewardsPoolContract.endTimestamp();
        let finalRewardPerBlock = await RewardsPoolContract.rewardPerBlock(0);
        let amountToTransfer1 = rewardPerBlock[0].mul(extentionInBlocks);

        expect(finalEndTime).to.equal(newEndTimestamp, 'The endtime is different');
        expect(finalRewardPerBlock).to.equal(rewardPerBlock[0], 'The rewards amount is not correct');
        expect(rewardsBalanceFinal).to.equal(
          rewardsBalanceInitial.add(amountToTransfer1),
          'The transfered amount is not correct'
        );
      });

      it('Should extend the rewards pool successfully with the half of the rate', async () => {
        let rewardsPoolLength = await RewardsPoolFactoryInstance.getRewardsPoolNumber();
        let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));

        const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
        const RewardsPoolContract = (await RewardsPoolBase.attach(rewardsPoolAddress)) as RewardsPoolBase;

        const rewardTokenInstance = rewardTokensInstances[0];
        let rewardsBalanceInitial = await rewardTokenInstance.balanceOf(RewardsPoolContract.address);

        await timeTravel(110);

        let initialEndTimestamp = await RewardsPoolContract.endTimestamp();
        let newEndTimestamp = initialEndTimestamp.add(oneMinute);

        let newRewardPerBlock = [];
        for (let i = 0; i < rewardTokensCount; i++) {
          let newSingleReward = rewardPerBlock[i].div(2);
          newRewardPerBlock.push(newSingleReward);
        }
        await RewardsPoolFactoryInstance.extendRewardPool(newEndTimestamp, newRewardPerBlock, rewardsPoolAddress);

        let rewardsBalanceFinal = await rewardTokenInstance.balanceOf(RewardsPoolContract.address);
        let finalEndTime = await RewardsPoolContract.endTimestamp();
        let finalRewardPerBlock = await RewardsPoolContract.rewardPerBlock(0);

        expect(finalEndTime).to.equal(newEndTimestamp, 'The endblock is different');
        expect(finalRewardPerBlock).to.equal(newRewardPerBlock[0], 'The rewards amount is not correct');
        expect(rewardsBalanceFinal).to.equal(rewardsBalanceInitial, 'The transfered amount is not correct');
      });

      it('Should extend the rewards pool successfully with the of the lower rate and return some money', async () => {
        let rewardsPoolLength = await RewardsPoolFactoryInstance.getRewardsPoolNumber();
        let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));

        const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
        const RewardsPoolContract = (await RewardsPoolBase.attach(rewardsPoolAddress)) as RewardsPoolBase;

        const rewardTokenInstance = rewardTokensInstances[0];
        let rewardsBalanceInitial = await rewardTokenInstance.balanceOf(RewardsPoolContract.address);
        let factoryBalanceInitial = await rewardTokenInstance.balanceOf(RewardsPoolFactoryInstance.address);

        await timeTravel(110);
        let initialEndTimestamp = await RewardsPoolContract.endTimestamp();
        const currentBlock = await ethers.provider.getBlock('latest');
        let newEndTimestamp = initialEndTimestamp.add(oneMinute);
        let amountToTransfer = [];
        let newRewardPerBlock = [];
        for (let i = 0; i < rewardTokensCount; i++) {
          let newSingleReward = rewardPerBlock[i].div(5);
          newRewardPerBlock.push(newSingleReward);
          let currentRemainingReward = await calculateRewardsAmount(
            currentBlock.timestamp,
            endTimestamp,
            rewardPerBlock[i]
          );
          let newRemainingReward = await calculateRewardsAmount(
            currentBlock.timestamp,
            newEndTimestamp.toNumber(),
            newSingleReward
          );
          amountToTransfer.push(currentRemainingReward.sub(newRemainingReward));
        }
        await RewardsPoolFactoryInstance.extendRewardPool(newEndTimestamp, newRewardPerBlock, rewardsPoolAddress);
        let rewardsBalanceFinal = await rewardTokenInstance.balanceOf(RewardsPoolContract.address);
        let factoryBalanceFinal = await rewardTokenInstance.balanceOf(RewardsPoolFactoryInstance.address);
        let finalEndTime = await RewardsPoolContract.endTimestamp();
        let finalRewardPerBlock = await RewardsPoolContract.rewardPerBlock(0);

        expect(finalEndTime).to.equal(newEndTimestamp, 'The endblock is different');
        expect(finalRewardPerBlock).to.equal(newRewardPerBlock[0], 'The rewards amount is not correct');
        expect(rewardsBalanceFinal).to.equal(
          rewardsBalanceInitial.sub(amountToTransfer[0]),
          'The transfered amount is not correct'
        );
        expect(factoryBalanceFinal).to.equal(
          factoryBalanceInitial.add(amountToTransfer[0]),
          'The amount is not transferred to the factory'
        );
      });

      it('Should fail trying to extend from not owner', async () => {
        let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(0);
        let newEndBlock = endBlock + 10;
        await expect(
          RewardsPoolFactoryInstance.connect(bobAccount.address).extendRewardPool(
            newEndBlock,
            rewardPerBlock,
            rewardsPoolAddress
          )
        ).to.be.revertedWith('onlyOwner:: The caller is not the owner');
      });

      describe('Withdrawing rewards', async function () {
        beforeEach(async () => {
          let rewardsPoolLength = await RewardsPoolFactoryInstance.getRewardsPoolNumber();
          let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));

          const TestERC20 = await ethers.getContractFactory('TestERC20');
          lpContractInstance = (await TestERC20.deploy(amount)) as TestERC20;

          await lpContractInstance.mint(rewardsPoolAddress, '100000000000');
          timeTravel(60 * 60);
        });

        it('Should withdraw the lp rewards', async () => {
          let rewardsPoolLength = await RewardsPoolFactoryInstance.getRewardsPoolNumber();
          let rewardsPoolAddress = await RewardsPoolFactoryInstance.rewardsPools(rewardsPoolLength.sub(1));
          let lptokenAddress = lpContractInstance.address;

          let contractInitialBalance = await lpContractInstance.balanceOf(rewardsPoolAddress);

          await RewardsPoolFactoryInstance.withdrawLPRewards(rewardsPoolAddress, carolAccount.address, lptokenAddress);

          let userBalanceFinal = await lpContractInstance.balanceOf(carolAccount.address);
          let contractFinalBalance = await lpContractInstance.balanceOf(rewardsPoolAddress);
          expect(contractInitialBalance).to.equal(userBalanceFinal, 'The balance of the user was not updated');
          expect(contractFinalBalance).to.equal(0, 'The balance of the contract was not updated');
        });

        it('Should not withdtaw if the caller is not the owner ', async () => {
          let lptokenAddress = lpContractInstance.address;

          await expect(
            RewardsPoolFactoryInstance.connect(bobAccount.address).withdrawLPRewards(
              stakingTokenAddress,
              carolAccount.address,
              lptokenAddress
            )
          ).to.be.revertedWith('onlyOwner:: The caller is not the owner');
        });

        it('Should not withdtaw if the staking rewards is not present', async () => {
          let lptokenAddress = lpContractInstance.address;

          await expect(
            RewardsPoolFactoryInstance.withdrawLPRewards(bobAccount.address, carolAccount.address, lptokenAddress)
          ).to.be.revertedWith('');
        });

        it('Should withdraw leftover rewards', async () => {
          let initialContractBalance = await lpContractInstance.balanceOf(RewardsPoolFactoryInstance.address);
          let initialUserBalance = await lpContractInstance.balanceOf(aliceAccount.address);

          await RewardsPoolFactoryInstance.withdrawRewardsLeftovers(lpContractInstance.address);

          let finalUserBalance = await lpContractInstance.balanceOf(aliceAccount.address);
          let finalContractBalance = await lpContractInstance.balanceOf(RewardsPoolFactoryInstance.address);

          expect(finalContractBalance).to.equal(0, 'Contract balance was not updated properly');
          expect(finalUserBalance).to.equal(
            initialUserBalance.add(initialContractBalance),
            'User balance was not updated properly'
          );
        });
      });
    });
  });
});
