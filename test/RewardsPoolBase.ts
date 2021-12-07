import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { RewardsPoolBase } from '../typechain-types/RewardsPoolBase';
import { deployERC20, getTime, timeTravel, timeTravelTo } from './utils';

describe.only('RewardsPoolBase', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;
  let carolAccount: SignerWithAddress;

  let RewardsPoolBaseInstance: RewardsPoolBase;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerBlock: BigNumber[];

  let startTimestamp: number;
  let endTimestamp: number;
  const virtualBlockTime: number = 10; //10s == 10000ms
  const oneMinute: number = 60; // 1 minute
  const poolLength = oneMinute * 60; // 1 hour

  const rewardTokensCount = 5; // 5 rewards tokens for tests
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = ethers.utils.parseEther('10'); // 10 tokens

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerBlock = [];

    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = await deployERC20(amount);

      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
      let parsedReward = await ethers.utils.parseEther(`${i + 1}`);
      rewardPerBlock.push(parsedReward);
    }

    startTimestamp = (await getTime()) + oneMinute;
    endTimestamp = startTimestamp + poolLength;
  };

  beforeEach(async () => {
    [aliceAccount, bobAccount, carolAccount] = await ethers.getSigners();

    stakingTokenInstance = await deployERC20(amount);

    await stakingTokenInstance.mint(aliceAccount.address, amount);
    await stakingTokenInstance.mint(bobAccount.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    RewardsPoolBaseInstance = (await RewardsPoolBase.deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      virtualBlockTime
    )) as RewardsPoolBase;

    // Send the required amount of tokens to the contract
    for (let i = 0; i < rewardTokensCount; i++) {
      await rewardTokensInstances[i].mint(
        RewardsPoolBaseInstance.address,
        rewardPerBlock[i].mul((endTimestamp - startTimestamp) / virtualBlockTime)
      );
    }

    await RewardsPoolBaseInstance.start(startTimestamp, endTimestamp, rewardPerBlock);
  });

  it('Should deploy the RewardsPoolBase properly', async () => {
    const savedStakingTokenAddress = await RewardsPoolBaseInstance.stakingToken();

    expect(savedStakingTokenAddress).to.equal(
      stakingTokenInstance.address,
      'The saved address of the staking token was incorrect'
    );

    for (let i = 0; i < rewardTokensAddresses.length; i++) {
      const tokenAddress = await RewardsPoolBaseInstance.rewardsTokens(i);
      expect(tokenAddress).to.equal(
        rewardTokensAddresses[i],
        `The saved address of the reward token ${i} was incorrect`
      );

      const rewardPerBlock = await RewardsPoolBaseInstance.rewardPerBlock(i);
      expect(rewardPerBlock).to.equal(ethers.utils.parseEther(`${i + 1}`), 'The saved reward per block is incorrect');

      const accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(i);
      expect(accumulatedMultiplier).to.equal(0, 'The saved accumulatedMultiplier is incorrect');
    }

    const totalStaked = await RewardsPoolBaseInstance.totalStaked();
    expect(totalStaked).to.equal(0, 'There was something staked already');

    const savedStartTime = await RewardsPoolBaseInstance.startTimestamp();
    expect(savedStartTime).to.equal(startTimestamp, 'The start timestamp saved was incorrect');

    const savedEndTime = await RewardsPoolBaseInstance.endTimestamp();
    expect(savedEndTime).to.equal(endTimestamp, 'The end timestamp saved was incorrect');
  });

  //This is covered from the factory
  it('Should fail to deploy RewardsPoolBase with zero staking token address', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(
        ethers.constants.AddressZero,
        rewardTokensAddresses,
        stakeLimit,
        contractStakeLimit,
        virtualBlockTime
      )
    ).to.be.revertedWith('Constructor::Invalid staking token address');
  });

  it('Should fail to deploy RewardsPoolBase with empty rewards token addresses array', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(stakingTokenAddress, [], stakeLimit, contractStakeLimit, virtualBlockTime)
    ).to.be.revertedWith('Constructor::Rewards tokens array should not be empty');
  });

  it('Should fail to start RewardsPoolBase with empty rewards per block array', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    const instance = (await RewardsPoolBase.deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      virtualBlockTime
    )) as RewardsPoolBase;

    await expect(instance.start(startTimestamp, endTimestamp, [])).to.be.revertedWith(
      'Constructor::Rewards per block and rewards tokens must be with the same length.'
    );
  });

  it('Should fail to start RewardsPoolBase if the start timestamp is not in the future', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    RewardsPoolBaseInstance = (await RewardsPoolBase.deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      virtualBlockTime
    )) as RewardsPoolBase;

    await expect(RewardsPoolBaseInstance.start(0, endTimestamp, rewardPerBlock)).to.be.revertedWith(
      'start::The start & end timestamp must be in the future.'
    );
  });

  it('Should fail to deploy RewardsPoolBase if the end timestamp is not in the future', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    RewardsPoolBaseInstance = (await RewardsPoolBase.deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      virtualBlockTime
    )) as RewardsPoolBase;

    await expect(RewardsPoolBaseInstance.start(startTimestamp, 0, rewardPerBlock)).to.be.revertedWith(
      'start::The start & end timestamp must be in the future.'
    );
  });

  it('Should fail to deploy RewardsPoolBase with 0 staking limit', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(stakingTokenAddress, rewardTokensAddresses, 0, contractStakeLimit, virtualBlockTime)
    ).to.be.revertedWith('Constructor::Stake limit and contract stake limit needs to be more than 0');
  });
  it('Should fail to deploy RewardsPoolBase with 0 contract staking limit', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(stakingTokenAddress, rewardTokensAddresses, stakeLimit, 0, virtualBlockTime)
    ).to.be.revertedWith('Constructor::Stake limit and contract stake limit needs to be more than 0');
  });

  describe('Staking', function () {
    it('Should not stake before staking start', async () => {
      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);
      await expect(RewardsPoolBaseInstance.stake(standardStakingAmount)).to.be.revertedWith(
        'Stake::Staking has not started or is finished'
      );
    });

    describe('Inside bounds', function () {
      beforeEach(async () => {
        await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);
        await stakingTokenInstance.connect(bobAccount).approve(RewardsPoolBaseInstance.address, standardStakingAmount);

        //timetraveling 70 seconds from now  in order to start the campaign
        await timeTravel(70);
      });

      it('Should successfully stake and accumulate reward', async () => {
        await RewardsPoolBaseInstance.stake(standardStakingAmount);

        const blockNumber = Math.floor((await ethers.provider.getBlock('latest')).timestamp / virtualBlockTime);

        const totalStakedAmount = await RewardsPoolBaseInstance.totalStaked();
        const userInfo = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
        const userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);
        const userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);

        expect(totalStakedAmount).to.equal(standardStakingAmount, 'The stake was not successful');
        expect(userInfo.amountStaked).to.equal(standardStakingAmount, "User's staked amount is not correct");
        expect(userInfo.firstStakedBlockNumber).to.equal(blockNumber, "User's first block is not correct");
        expect(userRewardDebt).to.equal(0, "User's reward debt is not correct");
        expect(userOwedToken).to.equal(0, "User's reward debt is not correct");

        //simulate mining of one block after staking
        await timeTravel(10);

        const accumulatedReward = await RewardsPoolBaseInstance.getUserAccumulatedReward(aliceAccount.address, 0);
        expect(accumulatedReward).to.equal(bOne, 'The reward accrued was not 1 token');
      });

      it('Should accumulate reward and update multipliers', async () => {
        await timeTravel(10);

        await RewardsPoolBaseInstance.stake(standardStakingAmount);

        await timeTravel(10);
        await RewardsPoolBaseInstance.connect(bobAccount).stake(standardStakingAmount);

        await timeTravel(10);

        const totalStake = standardStakingAmount.add(standardStakingAmount);

        let accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);
        let expectedMultiplier = bOne.mul(2).div(totalStake.div(bOne));

        expect(accumulatedMultiplier).to.equal(expectedMultiplier, 'The accumulated multiplier was incorrect');

        await timeTravel(10);

        const accumulatedRewardAlice = await RewardsPoolBaseInstance.getUserAccumulatedReward(aliceAccount.address, 0);
        expect(accumulatedRewardAlice).to.equal(bOne.add(bOne), 'The reward accrued was not 2 token');

        const accumulatedRewardBob = await RewardsPoolBaseInstance.getUserAccumulatedReward(bobAccount.address, 0);
        expect(accumulatedRewardBob).to.equal(bOne, 'The reward accrued was not 1 token');

        await timeTravel(10);

        await RewardsPoolBaseInstance.updateRewardMultipliers();
        expectedMultiplier = bOne.mul(5).div(totalStake.div(bOne));

        accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);

        expect(accumulatedMultiplier).to.equal(expectedMultiplier, 'The accumulated multiplier was incorrect');
      });

      it('Should fail if amount to stake is not greater than zero', async () => {
        await expect(RewardsPoolBaseInstance.stake(0)).to.be.revertedWith('Stake::Cannot stake 0');
      });

      it('Should fail if amount to stake is more than limit', async () => {
        await expect(RewardsPoolBaseInstance.stake(stakeLimit.mul(2))).to.be.revertedWith(
          'onlyUnderStakeLimit::Stake limit reached'
        );
      });

      it('Should fail if amount to stake is more than the contract limit', async () => {
        await expect(RewardsPoolBaseInstance.stake(contractStakeLimit.mul(2))).to.be.revertedWith(
          'onlyUnderStakeLimit::Stake limit reached'
        );
      });
    });

    it('Should not after staking end', async () => {
      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);

      await timeTravel(70000);

      await expect(RewardsPoolBaseInstance.stake(standardStakingAmount)).to.be.revertedWith(
        'Stake::Staking has not started or is finished'
      );
    });
  });

  describe('Rewards', function () {
    beforeEach(async () => {
      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);
      await stakingTokenInstance.connect(bobAccount).approve(RewardsPoolBaseInstance.address, standardStakingAmount);

      await timeTravel(70);

      await RewardsPoolBaseInstance.stake(standardStakingAmount);
    });

    it('Should claim the rewards successfully', async () => {
      await timeTravel(10);

      const userInitialBalance = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      await RewardsPoolBaseInstance.claim();

      const userFinalBalance = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userRewardsAfterClaiming = await RewardsPoolBaseInstance.getUserAccumulatedReward(aliceAccount.address, 0);
      const userTokensOwed = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);

      expect(userFinalBalance.gt(userInitialBalance)).to.equal(
        true,
        'Rewards claim was not successful, user final balance was not increased'
      );
      expect(userRewardsAfterClaiming).to.equal(0, 'There are rewards left');
      expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
    });

    it('Should withdraw the stake succesfully', async () => {
      await timeTravel(10);

      const userInitialBalance = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoInitial = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
      const initialTotalStkaedAmount = await RewardsPoolBaseInstance.totalStaked();

      await RewardsPoolBaseInstance.withdraw(bOne);

      const userFinalBalance = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoFinal = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
      const finalTotalStkaedAmount = await RewardsPoolBaseInstance.totalStaked();

      expect(userFinalBalance).to.equal(userInitialBalance.add(bOne), 'Withdraw was not successfull');
      expect(userInfoFinal.amountStaked).to.equal(
        userInfoInitial.amountStaked.sub(bOne),
        'User staked amount is not updated properly'
      );
      expect(finalTotalStkaedAmount).to.equal(
        initialTotalStkaedAmount.sub(bOne),
        'Contract total staked amount is not updated properly'
      );
    });

    it('Should exit successfully from the RewardsPool', async () => {
      await timeTravel(10);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoInitial = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
      const initialTotalStakedAmount = await RewardsPoolBaseInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userRewards = await RewardsPoolBaseInstance.getUserAccumulatedReward(aliceAccount.address, 0);

      await RewardsPoolBaseInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userTokensOwed = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
      const userInfoFinal = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
      const finalTotalStkaedAmount = await RewardsPoolBaseInstance.totalStaked();

      expect(userFinalBalanceRewards.gt(userInitialBalanceRewards)).to.equal(
        true,
        "Rewards claim was not successful, user's final balance was not increased"
      );
      expect(userFinalBalanceRewards).to.equal(
        userInitialBalanceRewards.add(userRewards),
        "Rewards claim was not successful, users' final balance was not correct"
      );
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
    });

    it('Should fail withdrawing if the amount to withraw is not greater than zero', async () => {
      expect(RewardsPoolBaseInstance.withdraw(0)).to.be.revertedWith('Withdraw::Cannot withdraw 0');
    });

    async function extend() {
      await timeTravel(10);

      let newRewardsPerBlock = [];

      let startTime = (await getTime()) + 20000;
      const newEndTimestamp = BigNumber.from(startTime + poolLength);

      const mintPromises = [];

      for (let i = 0; i < rewardTokensCount; i++) {
        let parsedReward = await ethers.utils.parseEther(`${(i + 1) * 2}`);
        const availableBalance = await RewardsPoolBaseInstance.getAvailableBalance(i, startTime);

        // Send the required reward tokens to the RewardsPool
        mintPromises.push(
          rewardTokensInstances[i].mint(
            RewardsPoolBaseInstance.address,
            parsedReward.mul(Math.floor(poolLength / virtualBlockTime)).sub(availableBalance)
          )
        );

        newRewardsPerBlock.push(parsedReward);
      }

      await Promise.all(mintPromises);

      await timeTravelTo(startTime);

      await RewardsPoolBaseInstance.extend(newEndTimestamp, newRewardsPerBlock);

      let endTimestamp = await RewardsPoolBaseInstance.endTimestamp();

      expect(endTimestamp).to.equal(newEndTimestamp, 'Extending the end block was not successfull');

      for (let i = 0; i < rewardTokensCount; i++) {
        let rewardPerBlock = await RewardsPoolBaseInstance.rewardPerBlock(i);
        expect(rewardPerBlock).to.equal(newRewardsPerBlock[i], 'Extending the reward per block was not successfull');
      }
    }

    it('Should extend correctly', async () => {
      await extend();
    });

    it('Should extend correctly when pool is already done', async () => {
      await timeTravel(poolLength * 2);
      await extend();
    });

    it('Should extend correctly multiple times', async () => {
      await extend();

      await timeTravel(poolLength / 2);
      await extend();

      await timeTravel(poolLength / 2);
      await extend();

      await timeTravel(poolLength / 2);
      await extend();

      // Wait for pool to end
      await timeTravel(poolLength * 2);

      for (let i = 0; i < rewardTokensCount; i++) {
        expect(await RewardsPoolBaseInstance.getAvailableBalance(i, await getTime())).to.equal(0);
      }
    });

    it('Should fail extending if there are not enough rewards', async () => {
      await timeTravel(10);

      let currentEndTimestamp = await RewardsPoolBaseInstance.endTimestamp();
      let newRewardsPerBlock = [];

      const newEndTimestamp = currentEndTimestamp.add(poolLength);
      let currentTime = await getTime();

      for (let i = 0; i < rewardTokensCount; i++) {
        let parsedReward = await ethers.utils.parseEther(`${(i + 1) * 2}`);
        const availableBalance = await RewardsPoolBaseInstance.getAvailableBalance(i, await getTime());

        // Send 50% less then the required reward tokens to the RewardsPool
        await rewardTokensInstances[i].mint(
          RewardsPoolBaseInstance.address,
          parsedReward.mul(newEndTimestamp.sub(currentTime).div(virtualBlockTime)).sub(availableBalance).div(2)
        );

        newRewardsPerBlock.push(parsedReward);
      }

      await expect(RewardsPoolBaseInstance.extend(newEndTimestamp, newRewardsPerBlock)).to.be.revertedWith(
        'Extend:: Not enough rewards in the pool to extend'
      );
    });

    it('Should send back rewards when extending if there are more than enough rewards', async () => {
      await timeTravel(10);

      let currentEndTimestamp = await RewardsPoolBaseInstance.endTimestamp();
      let newRewardsPerBlock = [];

      const newEndTimestamp = currentEndTimestamp.add(poolLength);

      for (let i = 0; i < rewardTokensCount; i++) {
        let parsedReward = await ethers.utils.parseEther(`${(i + 1) * 0.1}`);
        newRewardsPerBlock.push(parsedReward);
      }

      const beforeBalances = [];
      for (let i = 0; i < rewardTokensCount; i++) {
        beforeBalances.push(await rewardTokensInstances[i].balanceOf(aliceAccount.address));
      }

      await RewardsPoolBaseInstance.extend(newEndTimestamp, newRewardsPerBlock);

      for (let i = 0; i < rewardTokensCount; i++) {
        const afterBalance = await rewardTokensInstances[i].balanceOf(aliceAccount.address);
        expect(afterBalance.gt(beforeBalances[i])).to.equal(true, 'Extending the reward per block was not successfull');
      }
    });

    it('Should fail extending the rewards pool if the end block is not in the future', async () => {
      await expect(RewardsPoolBaseInstance.extend(0, rewardPerBlock)).to.be.revertedWith(
        'Extend::End block must be in the future'
      );
    });

    it('Should fail extending the rewards pool if the end block is not greater than the previous', async () => {
      let currentEndBlock = await RewardsPoolBaseInstance.endTimestamp();
      let newEndBlock = currentEndBlock.sub(1);

      await expect(RewardsPoolBaseInstance.extend(newEndBlock, rewardPerBlock)).to.be.revertedWith(
        'Extend::End block must be in the future and after current'
      );
    });

    it('Should fail extending the rewards pool if the rewards per block arrays is with different length', async () => {
      let currentEndBlock = await RewardsPoolBaseInstance.endTimestamp();
      let newRewardsPerBlock = [];

      const newEndBlock = currentEndBlock.add(20);

      for (let i = 0; i <= rewardTokensCount; i++) {
        let parsedReward = await ethers.utils.parseEther(`${i + 2}`);
        newRewardsPerBlock.push(parsedReward);
      }

      await expect(RewardsPoolBaseInstance.extend(newEndBlock, newRewardsPerBlock)).to.be.revertedWith(
        'Extend::Rewards amounts length is less than expected'
      );
    });

    it('Should fail extending the rewards pool the caller is not the factory', async () => {
      let newEndTime = endTimestamp + 10;

      await expect(RewardsPoolBaseInstance.connect(bobAccount).extend(newEndTime, rewardPerBlock)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
  });

  describe('Get available balance', async function () {
    it('Should return 0 when done', async () => {
      await timeTravel(poolLength * 2);

      for (let i = 0; i < rewardTokensCount; i++) {
        expect(await RewardsPoolBaseInstance.getAvailableBalance(i, await getTime())).to.equal(0);
      }
    });
  });

  describe('Withdrawing LP rewards', async function () {
    it('Should not withdtaw if the caller is not the factory contract', async () => {
      const lpContractInstance = await deployERC20(amount);
      await lpContractInstance.mint(RewardsPoolBaseInstance.address, '100000000000');

      await expect(
        RewardsPoolBaseInstance.connect(bobAccount).withdrawLPRewards(carolAccount.address, lpContractInstance.address)
      ).to.be.revertedWith('');
    });

    it('Should revert if the token to withdraw is part of the rewards', async () => {
      await expect(
        RewardsPoolBaseInstance.withdrawLPRewards(carolAccount.address, rewardTokensAddresses[0])
      ).to.be.revertedWith('');
    });
  });

  describe('Helper Methods Tests', async function () {
    it('Should return true if staking has started', async () => {
      await timeTravel(70);

      let hasStakingStarted = await RewardsPoolBaseInstance.hasStakingStarted();
      expect(hasStakingStarted).to.equal(true, 'Staking is not started');
    });

    it("Should return false if staking hasn't started", async () => {
      let hasStakingStarted = await RewardsPoolBaseInstance.hasStakingStarted();
      expect(hasStakingStarted).to.equal(false, 'Staking has started');
    });

    it('Should return the tokens owed  and reward debt length for a valid user ', async () => {
      await timeTravel(70);

      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);
      await RewardsPoolBaseInstance.stake(standardStakingAmount);

      let tokensOwedLength = await RewardsPoolBaseInstance.getUserTokensOwedLength(aliceAccount.address);
      let rewardDebtLength = await RewardsPoolBaseInstance.getUserRewardDebtLength(aliceAccount.address);

      expect(tokensOwedLength).to.equal(
        rewardTokensCount,
        'The tokens owed lenght must the the same as the rewards tokens'
      );
      expect(rewardDebtLength).to.equal(
        rewardTokensCount,
        'The tokens owed lenght must the the same as the rewards tokens'
      );
    });

    it('Should revert if the token to withdraw is part of the rewards', async () => {
      await expect(
        RewardsPoolBaseInstance.withdrawLPRewards(carolAccount.address, rewardTokensAddresses[0])
      ).to.be.revertedWith('');
    });
  });
});
