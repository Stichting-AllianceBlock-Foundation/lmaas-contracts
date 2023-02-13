import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

import { TestERC20 } from '../typechain/TestERC20';
import { RewardsPoolBase } from '../typechain/RewardsPoolBase';
import { deployERC20, getTime, timeTravel, timeTravelTo } from './utils';

describe('RewardsPoolBase', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;
  let carolAccount: SignerWithAddress;

  let RewardsPoolBaseInstance: RewardsPoolBase;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerSecond: BigNumber[];

  let startTimestamp: number;
  let endTimestamp: number;
  const accuracy = ethers.utils.parseEther('1');
  const oneMinute: number = 60; // 1 minute
  const poolLength = oneMinute * 60; // 1 hour

  const rewardTokensCount = 5; // 5 rewards tokens for tests
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = amount;

  const name = 'ABC';

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerSecond = [];

    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = i === 0 ? stakingTokenInstance : await deployERC20(amount);
      let decimals = 18;
      if (i === 1) {
        await tknInst.setDecimals(6);
        decimals = 6;
      }
      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
      let parsedReward = ethers.utils.parseUnits(`${i + 1}`, decimals).mul(accuracy);
      rewardPerSecond.push(parsedReward);
    }

    startTimestamp = (await getTime()) + oneMinute;
    endTimestamp = startTimestamp + poolLength;
  };

  async function createPool() {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    const instance = (await RewardsPoolBase.deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      name
    )) as RewardsPoolBase;

    // Send the required amount of tokens to the contract
    for (let i = 0; i < rewardTokensCount; i++) {
      await rewardTokensInstances[i].mint(
        instance.address,
        rewardPerSecond[i].mul(endTimestamp - startTimestamp).div(accuracy)
      );
    }

    return instance;
  }

  async function extend() {
    let newRewardsPerSecond: BigNumber[] = [];

    const mintPromises = [];

    for (let i = 0; i < rewardTokensCount; i++) {
      const rewardTokenDecimals = await rewardTokensInstances[i].decimals();
      let parsedReward = await ethers.utils.parseUnits(`${(i + 1) * 2}`, rewardTokenDecimals);

      // Send the required reward tokens to the RewardsPool
      mintPromises.push(rewardTokensInstances[i].mint(RewardsPoolBaseInstance.address, parsedReward.mul(poolLength)));

      newRewardsPerSecond.push(parsedReward.mul(accuracy));
    }

    await Promise.all(mintPromises);

    await RewardsPoolBaseInstance.extend(poolLength, newRewardsPerSecond);
  }

  beforeEach(async () => {
    [aliceAccount, bobAccount, carolAccount] = await ethers.getSigners();

    stakingTokenInstance = await deployERC20(amount);

    await stakingTokenInstance.mint(aliceAccount.address, amount);
    await stakingTokenInstance.mint(bobAccount.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    RewardsPoolBaseInstance = await createPool();

    await RewardsPoolBaseInstance.start(startTimestamp, endTimestamp, rewardPerSecond);
  });

  it('[Should deploy the RewardsPoolBase properly]:', async () => {
    const savedStakingTokenAddress = await RewardsPoolBaseInstance.stakingToken();

    expect(savedStakingTokenAddress).to.equal(
      stakingTokenInstance.address,
      'The saved address of the staking token was incorrect'
    );

    for (let i = 0; i < rewardTokensAddresses.length; i++) {
      const rewardTokenDecimals = await rewardTokensInstances[i].decimals();
      const tokenAddress = await RewardsPoolBaseInstance.rewardsTokens(i);
      expect(tokenAddress).to.equal(
        rewardTokensAddresses[i],
        `The saved address of the reward token ${i} was incorrect`
      );

      const rewardPerSecond = await RewardsPoolBaseInstance.rewardPerSecond(i);
      expect(rewardPerSecond).to.equal(
        ethers.utils.parseUnits(`${i + 1}`, rewardTokenDecimals).mul(accuracy),
        'The saved reward per second is incorrect'
      );

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
  it('[Should fail to deploy RewardsPoolBase with zero staking token address]:', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(ethers.constants.AddressZero, rewardTokensAddresses, stakeLimit, contractStakeLimit, name)
    ).to.be.revertedWith('RewardsPoolBase: invalid staking token');
  });

  it('[Should fail to deploy RewardsPoolBase with empty rewards token addresses array]:', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(stakingTokenAddress, [], stakeLimit, contractStakeLimit, name)
    ).to.be.revertedWith('RewardsPoolBase: empty rewardsTokens');
  });

  it('[Should fail to deploy RewardsPoolBase with duplicate rewards token addresses array]:', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(
        stakingTokenAddress,
        [rewardTokensAddresses[0], rewardTokensAddresses[0]],
        stakeLimit,
        contractStakeLimit,
        name
      )
    ).to.be.revertedWith('RewardsPoolBase: duplicate rewards token');
  });

  it('[Should fail to deploy RewardsPoolBase with 0 staking limit]:', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(stakingTokenAddress, rewardTokensAddresses, 0, contractStakeLimit, name)
    ).to.be.revertedWith('RewardsPoolBase: invalid stake limit');
  });

  it('[Should fail to deploy RewardsPoolBase with 0 contract staking limit]:', async () => {
    const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
    await expect(
      RewardsPoolBase.deploy(stakingTokenAddress, rewardTokensAddresses, stakeLimit, 0, name)
    ).to.be.revertedWith('RewardsPoolBase: invalid stake limit');
  });

  describe('Start', function () {
    it('[Should fail with empty rewards per second array]:', async () => {
      const instance = await createPool();

      await expect(instance.start(startTimestamp, endTimestamp, [])).to.be.revertedWith(
        'RewardsPoolBase: invalid rewardPerSecond'
      );
    });

    it('[Should fail with shorter rewards per second array]:', async () => {
      const instance = await createPool();

      await expect(instance.start(startTimestamp, endTimestamp, rewardPerSecond.slice(1))).to.be.revertedWith(
        'RewardsPoolBase: invalid rewardPerSecond'
      );
    });

    it('[Should fail with longer rewards per second array]:', async () => {
      const instance = await createPool();

      await expect(
        instance.start(startTimestamp, endTimestamp, [...rewardPerSecond, BigNumber.from(1)])
      ).to.be.revertedWith('RewardsPoolBase: invalid rewardPerSecond');
    });

    it('[Should fail if the start timestamp is not in the future]:', async () => {
      const instance = await createPool();

      await expect(instance.start(0, endTimestamp, rewardPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: invalid start or end'
      );
    });

    it('[Should fail if already started]:', async () => {
      const instance = await createPool();

      await instance.start(startTimestamp, endTimestamp, rewardPerSecond);

      await expect(instance.start(startTimestamp, endTimestamp, rewardPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: already started'
      );
    });

    it('[Should fail if the end timestamp is not in the future]:', async () => {
      const instance = await createPool();

      await expect(instance.start(startTimestamp, 0, rewardPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: invalid start or end'
      );
    });

    it('[Should fail if the end timestamp is not bigger then start timestamp]:', async () => {
      const instance = await createPool();

      await expect(instance.start(startTimestamp, startTimestamp - 1, rewardPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: invalid start or end'
      );
    });

    it('[Should fail if not enough rewards]:', async () => {
      const instance = await createPool();

      await expect(
        instance.start(
          startTimestamp,
          endTimestamp,
          rewardPerSecond.map((r) => r.add(accuracy))
        )
      ).to.be.revertedWith('RewardsPoolBase: not enough rewards');
    });
  });

  describe('Cancel', function () {
    it('[Should cancel when campaign is not started]:', async () => {
      const instance = await createPool();

      await instance.cancel();

      expect(await instance.startTimestamp()).to.equal(0);
    });

    it('[Should cancel when campaign is  started]:', async () => {
      const instance = await createPool();

      await instance.start(startTimestamp, endTimestamp, rewardPerSecond);

      await instance.cancel();

      expect(await instance.startTimestamp()).to.equal(0);
    });

    it('[Should successfully cancel and restart the campaign from zero]:', async () => {
      const instance = await createPool();

      await instance.start(startTimestamp, endTimestamp, rewardPerSecond);

      // we travel 60 seconds in the future
      await timeTravel(60);

      await stakingTokenInstance.approve(instance.address, ethers.constants.MaxUint256);

      // #1 - 1800 seconds passed
      await timeTravel(1800);
      await instance.stake(standardStakingAmount);

      // #2 - 600 seconds passed
      await timeTravel(600);
      await instance.stake(standardStakingAmount);

      // #3 - 600 seconds passed
      await timeTravel(600);
      await instance.exit();

      // #4 - 600 seconds passed cancel the current campaign and start a new one
      await timeTravel(600);
      await instance.cancel();

      startTimestamp = (await getTime()) + oneMinute;
      endTimestamp = startTimestamp + poolLength;

      // Send the required amount of tokens to the contract
      for (let i = 0; i < rewardTokensCount; i++) {
        await rewardTokensInstances[i].mint(instance.address, rewardPerSecond[i].mul(endTimestamp - startTimestamp));
      }

      await instance.start(startTimestamp, endTimestamp, rewardPerSecond);

      // #5 we travel 60 seconds in the future
      await timeTravel(60);
      await instance.stake(standardStakingAmount);

      // #6 we travel 600 seconds in the future
      await timeTravel(600);
      await instance.stake(standardStakingAmount);

      // #7 we travel 2900 seconds in the future
      await timeTravel(2900);
      await instance.stake(standardStakingAmount);

      // #8 we travel 100 seconds in the future and we exit the pool
      await timeTravel(100);
      const userOwedToken = await instance.getUserOwedTokens(aliceAccount.address, 0);
      await instance.exit();

      // we confirm he should get the same amount of tokens if the campaign is cancel all the way through
      expect(userOwedToken).to.gte(ethers.utils.parseEther('3500')).and.lte(ethers.utils.parseEther('3600'));
    });
  });

  describe('Staking', function () {
    it('[Should not stake before staking start]:', async () => {
      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);
      await expect(RewardsPoolBaseInstance.stake(standardStakingAmount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started or is finished or no extension taking in place'
      );
    });

    it('[Should cancel before staking start]:', async () => {
      await RewardsPoolBaseInstance.cancel();
      expect(await RewardsPoolBaseInstance.startTimestamp()).to.equal(0, 'The start timestamp was not reset');
    });

    it('[Should cancel after staking start and give rewards back to owner]:', async () => {
      await timeTravel(70);

      //here
      const ownerInitialBalance = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      await RewardsPoolBaseInstance.cancel();
      const ownerAfterBalance = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      expect(ownerAfterBalance).gt(ownerInitialBalance);
    });

    it('[Should be able to restart after cancel]:', async () => {
      await RewardsPoolBaseInstance.cancel();

      // Send the required amount of tokens to the contract
      for (let i = 0; i < rewardTokensCount; i++) {
        await rewardTokensInstances[i].mint(
          RewardsPoolBaseInstance.address,
          rewardPerSecond[i].mul(endTimestamp - startTimestamp)
        );
      }

      await RewardsPoolBaseInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

      expect(await RewardsPoolBaseInstance.startTimestamp()).to.equal(startTimestamp, 'Was not able to restart');
    });

    describe('Inside bounds', function () {
      beforeEach(async () => {
        await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);
        await stakingTokenInstance.connect(bobAccount).approve(RewardsPoolBaseInstance.address, standardStakingAmount);

        // timetraveling 60 seconds from now in order to start the campaign
        await timeTravel(60);
      });

      it('[Should successfully stake and accumulate rewards even if the pool already is half time]:', async () => {
        // before recalculation
        // 3600s = 1 hour
        // 3600 rewards through 1 hour
        // 1 rward per second

        // after recalculation
        // 1800s = 30 minutes
        // 3600 rewards through 30 minutes
        // 2 rward per second

        await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, ethers.constants.MaxUint256);
        const rewardPerSecond = ethers.utils.parseEther('2'); // 2 rewardPerSecond

        // #1 - 1800 seconds passed
        await timeTravel(1800);
        await RewardsPoolBaseInstance.stake(standardStakingAmount);
        let currentStakedAmount = ethers.utils.parseEther('0');
        let totalStakedAmount = ethers.utils.parseEther('5');

        let userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);
        let accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);
        let userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);

        expect(accumulatedMultiplier).to.equal(0);
        expect(userOwedToken).to.equal(0);
        expect(userRewardDebt).to.equal(0);

        let totalStaked = await RewardsPoolBaseInstance.totalStaked();
        expect(totalStaked).to.equal(ethers.utils.parseEther('5'));

        // #2 - 600 seconds passed
        await timeTravel(600);
        await RewardsPoolBaseInstance.stake(standardStakingAmount);
        currentStakedAmount = ethers.utils.parseEther('5');
        totalStakedAmount = ethers.utils.parseEther('10');

        userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);
        accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);

        let currentMultiplier = rewardPerSecond.mul(600).mul(ethers.utils.parseEther('1')).div(totalStaked);

        expect(accumulatedMultiplier)
          .to.gte(currentMultiplier)
          .and.to.lte(currentMultiplier.add(ethers.utils.parseEther('10')));
        expect(userOwedToken)
          .to.gte(currentMultiplier.mul(currentStakedAmount).div(ethers.utils.parseEther('1')).sub(userRewardDebt))
          .and.lte(
            currentMultiplier
              .mul(currentStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('30'))
          );

        userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);

        expect(userRewardDebt)
          .to.gte(currentMultiplier.mul(totalStakedAmount).div(ethers.utils.parseEther('1')))
          .and.to.lte(
            currentMultiplier
              .mul(totalStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('100'))
          );

        totalStaked = await RewardsPoolBaseInstance.totalStaked();
        expect(totalStaked).to.equal(totalStakedAmount);

        // #3 - 600 seconds passed
        await timeTravel(600);
        await RewardsPoolBaseInstance.stake(standardStakingAmount);
        currentStakedAmount = ethers.utils.parseEther('10');
        totalStakedAmount = ethers.utils.parseEther('15');

        userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);
        accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);

        currentMultiplier = rewardPerSecond
          .mul(600)
          .mul(ethers.utils.parseEther('1'))
          .div(totalStaked)
          .add(currentMultiplier);
        expect(accumulatedMultiplier)
          .to.gte(currentMultiplier)
          .and.to.lte(currentMultiplier.add(ethers.utils.parseEther('10')));
        expect(userOwedToken)
          .to.gte(currentMultiplier.mul(currentStakedAmount).div(ethers.utils.parseEther('1')).sub(userRewardDebt))
          .and.lte(
            currentMultiplier
              .mul(currentStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('30'))
          );

        userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);

        expect(userRewardDebt)
          .to.gte(currentMultiplier.mul(totalStakedAmount).div(ethers.utils.parseEther('1')))
          .and.to.lte(
            currentMultiplier
              .mul(totalStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('100'))
          );

        totalStaked = await RewardsPoolBaseInstance.totalStaked();
        expect(totalStaked).to.equal(totalStakedAmount);

        // #4 - 500 seconds passed
        await timeTravel(500);
        await RewardsPoolBaseInstance.stake(standardStakingAmount);
        currentStakedAmount = ethers.utils.parseEther('15');
        totalStakedAmount = ethers.utils.parseEther('20');

        userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);
        accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);

        currentMultiplier = rewardPerSecond
          .mul(500)
          .mul(ethers.utils.parseEther('1'))
          .div(totalStaked)
          .add(currentMultiplier);
        expect(accumulatedMultiplier)
          .to.gte(currentMultiplier)
          .and.to.lte(currentMultiplier.add(ethers.utils.parseEther('10')));
        expect(userOwedToken)
          .to.gte(currentMultiplier.mul(currentStakedAmount).div(ethers.utils.parseEther('1')).sub(userRewardDebt))
          .and.lte(
            currentMultiplier
              .mul(currentStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('30'))
          );

        userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);

        expect(userRewardDebt)
          .to.gte(currentMultiplier.mul(totalStakedAmount).div(ethers.utils.parseEther('1')))
          .and.to.lte(
            currentMultiplier
              .mul(totalStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('100'))
          );

        totalStaked = await RewardsPoolBaseInstance.totalStaked();
        expect(totalStaked).to.equal(totalStakedAmount);

        // #5 - 100 seconds passed
        await timeTravel(100);
        await RewardsPoolBaseInstance.claim();
        currentStakedAmount = ethers.utils.parseEther('15');
        totalStakedAmount = ethers.utils.parseEther('20');

        userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);
        accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(0);

        currentMultiplier = rewardPerSecond
          .mul(100)
          .mul(ethers.utils.parseEther('1'))
          .div(totalStaked)
          .add(currentMultiplier);
        expect(accumulatedMultiplier)
          .to.gte(currentMultiplier)
          .and.to.lte(currentMultiplier.add(ethers.utils.parseEther('10')));
        expect(userOwedToken).eq(0);

        userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);

        expect(userRewardDebt)
          .to.gte(currentMultiplier.mul(totalStakedAmount).div(ethers.utils.parseEther('1')))
          .and.to.lte(
            currentMultiplier
              .mul(totalStakedAmount)
              .div(ethers.utils.parseEther('1'))
              .add(ethers.utils.parseEther('100'))
          );

        totalStaked = await RewardsPoolBaseInstance.totalStaked();
        expect(totalStaked).to.equal(totalStakedAmount);
      });

      it('[Should successfully stake and accumulate reward]:', async () => {
        await RewardsPoolBaseInstance.stake(standardStakingAmount);
        const stakeTime = await getTime();

        const totalStakedAmount = await RewardsPoolBaseInstance.totalStaked();
        const userInfo = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
        const userRewardDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, 0);
        const userOwedToken = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);

        expect(totalStakedAmount).to.equal(standardStakingAmount, 'The stake was not successful');
        expect(userInfo.amountStaked).to.equal(standardStakingAmount, "User's staked amount is not correct");
        expect(userInfo.firstStakedTimestamp).to.equal(stakeTime, "User's first timestamp is not correct");
        expect(userRewardDebt).to.equal(0, "User's reward debt is not correct");
        expect(userOwedToken).to.equal(0, "User's reward debt is not correct");

        // before recalculation
        // 3600s = 1 hour
        // 3600 rewards through 1 hour
        // 1 rward per second

        // after recalculation
        // 1800s = 30 minutes
        // 3600 rewards through 30 minutes
        // 2 rward per second

        // TODO: check if this can be fixed
        const corrections = [0, 0, 0, -1, -1];
        for (let i = 0; i < rewardPerSecond.length; i++) {
          const currentRewardPerSecond = await RewardsPoolBaseInstance.rewardPerSecond(i);
          const accumulatedReward = await RewardsPoolBaseInstance.getUserAccumulatedReward(
            aliceAccount.address,
            i,
            stakeTime + oneMinute
          );

          expect(accumulatedReward).to.equal(
            currentRewardPerSecond.mul(oneMinute).div(accuracy).add(corrections[i]),
            'The reward accrued was not 1 token'
          );
        }
      });

      it.only('[Should accumulate reward and update multipliers]:', async () => {
        await timeTravelTo(startTimestamp + oneMinute);

        await RewardsPoolBaseInstance.stake(standardStakingAmount);

        await timeTravelTo(startTimestamp + oneMinute * 2);

        await RewardsPoolBaseInstance.connect(bobAccount).stake(standardStakingAmount);

        const stakingTokenDecimals = await stakingTokenInstance.decimals();
        for (let i = 0; i < rewardPerSecond.length; i++) {
          const rewardTokenDecimals = await rewardTokensInstances[i].decimals();

          const currentRewardPerSecond = await RewardsPoolBaseInstance.rewardPerSecond(i);
          const accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(i);
          const rewardMultiplierPerMinute = currentRewardPerSecond
            .mul(oneMinute)
            .mul(ethers.utils.parseUnits('1', stakingTokenDecimals))
            .div(ethers.utils.parseUnits('1', rewardTokenDecimals));

          // at the time of update (when bob staked) there has only been one minute staked with standardStakingAmount
          expect(accumulatedMultiplier).to.equal(
            rewardMultiplierPerMinute.div(standardStakingAmount),
            'The accumulated multiplier was incorrect'
          );
        }

        // TODO: check if this can be fixed
        let corrections = [-2, 0, -6, -3, -5];
        for (let i = 0; i < rewardPerSecond.length; i++) {
          const currentRewardPerSecond = await RewardsPoolBaseInstance.rewardPerSecond(i);
          const accumulatedRewardAlice = await RewardsPoolBaseInstance.getUserAccumulatedReward(
            aliceAccount.address,
            i,
            startTimestamp + oneMinute * 3
          );
          const totalReward = currentRewardPerSecond.mul(oneMinute * 2);
          // use 3/4 here because alice staked the full first period and half of the second period (-1/4)
          expect(accumulatedRewardAlice).to.eq(
            // TODO: check if this can be fixed
            totalReward.mul(3).div(4).div(accuracy).add(corrections[i]),
            'The reward accrued was not correct'
          );
        }

        // TODO: check if this can be fixed
        corrections = [0, 0, -2, -2, -3];
        for (let i = 0; i < rewardPerSecond.length; i++) {
          const currentRewardPerSecond = await RewardsPoolBaseInstance.rewardPerSecond(i);
          const accumulatedRewardBob = await RewardsPoolBaseInstance.getUserAccumulatedReward(
            bobAccount.address,
            i,
            startTimestamp + oneMinute * 3
          );
          const totalReward = currentRewardPerSecond.mul(oneMinute * 2);

          // use 1/4 here because bob didn't stake the first period (-2/4) and half of the second period (-1/4)
          expect(accumulatedRewardBob).to.equal(
            // TODO: check if this can be fixed
            totalReward.mul(1).div(4).div(accuracy).add(corrections[i]),
            'The reward accrued was not correct'
          );
        }

        await timeTravelTo(startTimestamp + oneMinute * 3);
        await RewardsPoolBaseInstance.updateRewardMultipliers();

        for (let i = 0; i < rewardPerSecond.length; i++) {
          const rewardTokenDecimals = await rewardTokensInstances[i].decimals();

          const currentRewardPerSecond = await RewardsPoolBaseInstance.rewardPerSecond(i);
          const accumulatedMultiplier = await RewardsPoolBaseInstance.accumulatedRewardMultiplier(i);
          const rewardMultiplierPerMinute = currentRewardPerSecond
            .mul(oneMinute)
            .mul(ethers.utils.parseUnits('1', stakingTokenDecimals))
            .div(ethers.utils.parseUnits('1', rewardTokenDecimals));

          // at the time of update (now) there has been one minute staked with standardStakingAmount and one minute staked with standardStakingAmount * 2
          expect(accumulatedMultiplier).to.equal(
            rewardMultiplierPerMinute
              .div(standardStakingAmount)
              .add(rewardMultiplierPerMinute.div(standardStakingAmount.mul(2))),
            'The accumulated multiplier was incorrect'
          );
        }
      });

      it('[Should fail if amount to stake is not greater than zero]:', async () => {
        await expect(RewardsPoolBaseInstance.stake(0)).to.be.revertedWith('RewardsPoolBase: cannot stake 0');
      });

      it('[Should fail if amount to stake is more than limit]:', async () => {
        await expect(RewardsPoolBaseInstance.stake(stakeLimit.mul(2))).to.be.revertedWith(
          'RewardsPoolBase: stake limit reached'
        );
      });

      it('[Should fail if amount to stake is more than the contract limit]:', async () => {
        await expect(RewardsPoolBaseInstance.stake(contractStakeLimit.mul(2))).to.be.revertedWith(
          'RewardsPoolBase: stake limit reached'
        );
      });
    });

    it('[Should not after staking end if there is no extension taking in place]:', async () => {
      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, standardStakingAmount);

      await timeTravel(70000);

      await expect(RewardsPoolBaseInstance.stake(standardStakingAmount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started or is finished or no extension taking in place'
      );
    });
  });

  describe('Rewards', function () {
    beforeEach(async () => {
      await stakingTokenInstance.approve(RewardsPoolBaseInstance.address, amount);

      await timeTravel(70);

      await RewardsPoolBaseInstance.stake(standardStakingAmount);
    });

    it('[Should claim the rewards successfully]:', async () => {
      await timeTravel(10);

      const userInitialBalance = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      await RewardsPoolBaseInstance.claim();

      const userFinalBalance = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
      const userRewardsAfterClaiming = await RewardsPoolBaseInstance.getUserAccumulatedReward(
        aliceAccount.address,
        0,
        await getTime()
      );
      const userTokensOwed = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, 0);

      expect(userFinalBalance.gt(userInitialBalance)).to.equal(
        true,
        'Rewards claim was not successful, user final balance was not increased'
      );
      expect(userRewardsAfterClaiming).to.equal(0, 'There are rewards left');
      expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
    });

    it('[Should withdraw the stake succesfully]:', async () => {
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

    it('[Should exit successfully from the RewardsPool]:', async () => {
      await timeTravel(10);

      const exitTime = (await getTime()) + oneMinute;

      const userInfoBeforeExit = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
      const totalStakedBeforeExit = await RewardsPoolBaseInstance.totalStaked();

      const rewardBalanceBeforeExit: BigNumber[] = [];
      const rewardsBeforeExit: BigNumber[] = [];

      for (let i = 0; i < rewardTokensCount; i++) {
        rewardBalanceBeforeExit.push(await rewardTokensInstances[i].balanceOf(aliceAccount.address));
        rewardsBeforeExit.push(
          await RewardsPoolBaseInstance.getUserAccumulatedReward(aliceAccount.address, i, exitTime)
        );
      }

      await timeTravelTo(exitTime);

      await RewardsPoolBaseInstance.exit();

      for (let i = 0; i < rewardTokensCount; i++) {
        const rewardBalanceAfterExit = await rewardTokensInstances[i].balanceOf(aliceAccount.address);
        const userTokensOwed = await RewardsPoolBaseInstance.getUserOwedTokens(aliceAccount.address, i);

        expect(rewardBalanceAfterExit).to.equal(
          rewardBalanceBeforeExit[i]
            .add(rewardsBeforeExit[i])
            .add(rewardTokensInstances[i] === stakingTokenInstance ? userInfoBeforeExit.amountStaked : 0),
          "Rewards claim was not successful, users' final balance was not correct"
        );

        expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
      }

      const userInfoAfterExit = await RewardsPoolBaseInstance.userInfo(aliceAccount.address);
      const totalStakedAfterExit = await RewardsPoolBaseInstance.totalStaked();

      expect(userInfoAfterExit.amountStaked).to.equal(
        userInfoBeforeExit.amountStaked.sub(standardStakingAmount),
        'User staked amount is not updated properly'
      );

      expect(totalStakedAfterExit).to.equal(
        totalStakedBeforeExit.sub(standardStakingAmount),
        'Contract total staked amount is not updated properly'
      );
    });

    it('[Should fail withdrawing if the amount to withraw is not greater than zero]:', async () => {
      expect(RewardsPoolBaseInstance.withdraw(0)).to.be.revertedWith('RewardsPoolBase: cannot withdraw 0');
    });

    it('[Should extend correctly if the pool is not done and extend with updateRewardMultipliers]:', async () => {
      await extend();
      const extensionDuration = await RewardsPoolBaseInstance.extensionDuration();
      await timeTravel(poolLength + 1000);

      await RewardsPoolBaseInstance.updateRewardMultipliers();
      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();

      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);
      expect(extensionDuration).to.equal(poolLength);
    });

    it('[Should extend correctly if the pool is not done and extend with withdraw]:', async () => {
      await extend();
      const extensionDuration = await RewardsPoolBaseInstance.extensionDuration();
      await timeTravel(poolLength + 1000);

      await RewardsPoolBaseInstance.withdraw(bOne);
      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();

      for (let i = 0; i < rewardTokensCount; i++) {
        const userDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, i);
        expect(userDebt).to.be.gt(0);
      }

      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);
      expect(extensionDuration).to.equal(poolLength);
    });

    it('[Should extend correctly if the pool is not done and extend with claim]:', async () => {
      await extend();
      const extensionDuration = await RewardsPoolBaseInstance.extensionDuration();
      await timeTravel(poolLength + 1000);

      await RewardsPoolBaseInstance.claim();
      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();

      for (let i = 0; i < rewardTokensCount; i++) {
        const userDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, i);
        expect(userDebt).to.be.gt(0);
      }

      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);
      expect(extensionDuration).to.equal(poolLength);
    });

    it('[Should extend correctly if the pool is not done and extend with stake]:', async () => {
      await extend();
      const extensionDuration = await RewardsPoolBaseInstance.extensionDuration();
      await timeTravel(poolLength + 1000);

      await RewardsPoolBaseInstance.stake(standardStakingAmount);
      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();

      for (let i = 0; i < rewardTokensCount; i++) {
        const userDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, i);
        expect(userDebt).to.be.gt(0);
      }

      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);
      expect(extensionDuration).to.equal(poolLength);
    });

    it('[Should extend correctly when pool is already done]:', async () => {
      await timeTravel(poolLength + 1000);

      await extend();
      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);
    });

    it('[Should extend correctly when pool is already done and also do a claim ]:', async () => {
      await timeTravel(poolLength * 2);

      await extend();
      const extendTime = await getTime();

      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
      expect(startTimestamp).to.equal(extendTime);
      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);

      await RewardsPoolBaseInstance.claim();
      for (let i = 0; i < rewardTokensCount; i++) {
        const userDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, i);
        expect(userDebt).to.be.gt(0);
      }
    });

    it('[Should extend correctly when pool is already done and also do a withdraw ]:', async () => {
      await timeTravel(poolLength * 2);

      await extend();
      const extendTime = await getTime();

      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
      expect(startTimestamp).to.equal(extendTime);
      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);

      await RewardsPoolBaseInstance.withdraw(bOne);
      for (let i = 0; i < rewardTokensCount; i++) {
        const userDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, i);
        expect(userDebt).to.be.gt(0);
      }
    });

    it('[Should extend correctly when pool is already done and also do a stake]:', async () => {
      await timeTravel(poolLength * 2);

      await extend();
      const extendTime = await getTime();

      const startTimestamp = await RewardsPoolBaseInstance.startTimestamp();
      const endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
      expect(startTimestamp).to.equal(extendTime);
      expect(endTimestamp.sub(startTimestamp)).to.equal(poolLength);

      await RewardsPoolBaseInstance.stake(standardStakingAmount);
      for (let i = 0; i < rewardTokensCount; i++) {
        const userDebt = await RewardsPoolBaseInstance.getUserRewardDebt(aliceAccount.address, i);
        expect(userDebt).to.be.gt(0);
      }
    });

    it('[Should extend correctly multiple times with updateRewardMultipliers]:', async () => {
      let oldEndTimestamp, extensionDuration, endTimestamp;

      for (let i = 0; i < 3; i++) {
        oldEndTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        await extend();
        await timeTravel(poolLength + 1000);

        extensionDuration = await (await RewardsPoolBaseInstance.extensionDuration()).toNumber();
        await RewardsPoolBaseInstance.updateRewardMultipliers();
        endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        expect(endTimestamp).to.equal(oldEndTimestamp.add(extensionDuration));
      }
    });

    it('[Should extend correctly multiple times with claim]:', async () => {
      let oldEndTimestamp, extensionDuration, endTimestamp;

      for (let i = 0; i < 3; i++) {
        oldEndTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        await extend();
        await timeTravel(poolLength + 1000);

        extensionDuration = await (await RewardsPoolBaseInstance.extensionDuration()).toNumber();
        await RewardsPoolBaseInstance.claim();
        endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        expect(endTimestamp).to.equal(oldEndTimestamp.add(extensionDuration));
      }
    });

    it('[Should extend correctly multiple times with withdraw]:', async () => {
      let oldEndTimestamp, extensionDuration, endTimestamp;

      for (let i = 0; i < 3; i++) {
        oldEndTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        await extend();
        await timeTravel(poolLength + 1000);

        extensionDuration = await (await RewardsPoolBaseInstance.extensionDuration()).toNumber();
        await RewardsPoolBaseInstance.withdraw(bOne);
        endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        expect(endTimestamp).to.equal(oldEndTimestamp.add(extensionDuration));
      }
    });

    it('[Should extend correctly multiple times with stake]:', async () => {
      let oldEndTimestamp, extensionDuration, endTimestamp;

      for (let i = 0; i < 3; i++) {
        oldEndTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        await extend();
        await timeTravel(poolLength + 1000);

        extensionDuration = await (await RewardsPoolBaseInstance.extensionDuration()).toNumber();
        await RewardsPoolBaseInstance.stake(standardStakingAmount);
        endTimestamp = await RewardsPoolBaseInstance.endTimestamp();
        expect(endTimestamp).to.equal(oldEndTimestamp.add(extensionDuration));
      }
    });

    it('[Should fail with stake if the extension duration is over]:', async () => {
      await extend();
      await timeTravel(poolLength * 3);

      expect(RewardsPoolBaseInstance.stake(standardStakingAmount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started or is finished or no extension taking in place'
      );
    });

    it('[Should fail if try to extend again if a extension is taking in place]:', async () => {
      await extend();
      expect(RewardsPoolBaseInstance.extend(1, [1])).to.be.revertedWith(
        'RewardsPoolBase: there is already an extension'
      );
    });

    it('[Should fail extending if there are not enough rewards]:', async () => {
      let newRewardsPerSecond = [];

      for (let i = 0; i < rewardTokensCount; i++) {
        let parsedReward = await ethers.utils.parseEther(`${(i + 1) * 2}`);

        // Send 50% less then the required reward tokens to the RewardsPool
        await rewardTokensInstances[i].mint(RewardsPoolBaseInstance.address, parsedReward.mul(poolLength).div(2));

        newRewardsPerSecond.push(parsedReward.mul(accuracy));
      }

      await expect(RewardsPoolBaseInstance.extend(poolLength, newRewardsPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: not enough rewards to extend'
      );
    });

    it('[Should fail extending the rewards pool if the end timestamp is not in the future]:', async () => {
      await expect(RewardsPoolBaseInstance.extend(0, rewardPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: duration must be greater than 0'
      );
    });

    it('[Should fail extending the rewards pool if the rewards per second arrays is with different length]:', async () => {
      let newRewardsPerSecond = [];

      for (let i = 0; i <= rewardTokensCount; i++) {
        let parsedReward = await ethers.utils.parseEther(`${i + 2}`);
        newRewardsPerSecond.push(parsedReward);
      }

      await expect(RewardsPoolBaseInstance.extend(poolLength, newRewardsPerSecond)).to.be.revertedWith(
        'RewardsPoolBase: invalid rewardPerSecond'
      );
    });

    it('[Should fail extending the rewards pool the caller is not the owner]:', async () => {
      let newEndTime = endTimestamp + 10;

      await expect(RewardsPoolBaseInstance.connect(bobAccount).extend(newEndTime, rewardPerSecond)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('[Should fail cancelling extension when there is no extension]:', async () => {
      await expect(RewardsPoolBaseInstance.cancelExtension()).to.be.revertedWith(
        'RewardsPoolBase: there is no extension scheduled'
      );
    });

    it('[Should fail cancelling extension when it has already started]:', async () => {
      await extend();
      await timeTravel(poolLength + 1000);

      await expect(RewardsPoolBaseInstance.cancelExtension()).to.be.revertedWith(
        'RewardsPoolBase: cannot cancel extension after it has started'
      );
    });

    it('[Should cancel extension]:', async () => {
      await extend();

      await RewardsPoolBaseInstance.cancelExtension();

      expect(await RewardsPoolBaseInstance.extensionDuration()).to.equal(0);
    });
  });

  describe('Get available balance', async function () {
    it('[Should return 0 right after being created]:', async () => {
      const RewardsPoolBase = await ethers.getContractFactory('RewardsPoolBase');
      const instance = (await RewardsPoolBase.deploy(
        stakingTokenAddress,
        rewardTokensAddresses,
        stakeLimit,
        contractStakeLimit,
        name
      )) as RewardsPoolBase;

      for (let i = 0; i < rewardTokensCount; i++) {
        expect(await instance.getAvailableBalance(i)).to.equal(0);
      }
    });

    it('[Should return 0 when done]:', async () => {
      await timeTravel(poolLength * 2);

      for (let i = 0; i < rewardTokensCount; i++) {
        expect(await RewardsPoolBaseInstance.getAvailableBalance(i)).to.equal(0);
      }
    });
  });

  describe('Withdrawing LP rewards', async function () {
    it('[Should not withdtaw if the caller is not the owner of the contract]:', async () => {
      const lpContractInstance = await deployERC20(amount);
      await lpContractInstance.mint(RewardsPoolBaseInstance.address, '100000000000');

      await expect(
        RewardsPoolBaseInstance.connect(bobAccount).withdrawTokens(carolAccount.address, lpContractInstance.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Withdrawing excess rewards', async function () {
    it('[Should not withdraw if the caller is not the owner of the contract]:', async () => {
      const lpContractInstance = await deployERC20(amount);
      await lpContractInstance.mint(RewardsPoolBaseInstance.address, '100000000000');

      await expect(
        RewardsPoolBaseInstance.connect(bobAccount).withdrawExcessRewards(carolAccount.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('[Should withdraw excess rewards]:', async () => {
      const balanceBefore = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      await rewardTokensInstances[0].mint(RewardsPoolBaseInstance.address, '8000');

      await RewardsPoolBaseInstance.withdrawExcessRewards(aliceAccount.address);

      const balanceAfter = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      expect(balanceAfter.sub(balanceBefore)).to.equal('8000');
    });

    it('[Should withdraw excess rewards with extension]:', async () => {
      await extend();

      const balanceBefore = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      await rewardTokensInstances[0].mint(RewardsPoolBaseInstance.address, '8000');

      await RewardsPoolBaseInstance.withdrawExcessRewards(aliceAccount.address);

      const balanceAfter = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

      expect(balanceAfter.sub(balanceBefore)).to.equal('8000');
    });
  });

  describe('Helper Methods Tests', async function () {
    it('[Should return true if staking has started]:', async () => {
      await timeTravel(70);

      let hasStakingStarted = await RewardsPoolBaseInstance.hasStakingStarted();
      expect(hasStakingStarted).to.equal(true, 'Staking is not started');
    });

    it("[Should return false if staking hasn't started]:", async () => {
      let hasStakingStarted = await RewardsPoolBaseInstance.hasStakingStarted();
      expect(hasStakingStarted).to.equal(false, 'Staking has started');
    });

    it('[Should return the tokens owed and reward debt length for a valid user]:', async () => {
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

    it('[Should revert if the token to withdraw is part of the rewards]:', async () => {
      await expect(RewardsPoolBaseInstance.withdrawTokens(carolAccount.address, rewardTokensAddresses[0])).to.be
        .reverted;
    });
  });
});
