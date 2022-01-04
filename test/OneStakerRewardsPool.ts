import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { getTime, timeTravel } from './utils';
import { CompoundingRewardsPool } from '../typechain-types/CompoundingRewardsPool';

describe('OneStakerRewardsPool', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;
  let staker: SignerWithAddress;

  let OneStakerRewardsPoolInstance: CompoundingRewardsPool;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerSecond: BigNumber[];

  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = ethers.constants.MaxUint256;
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = ethers.utils.parseEther('10'); // 10 tokens

  let startTimestamp: number;
  let endTimestamp: number;
  const oneMinute = 60;

  const name = 'ABC';

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerSecond = [];
    for (let i = 0; i < rewardTokensCount; i++) {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      const tknInst = (await TestERC20.deploy(amount)) as TestERC20;

      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
      let parsedReward = await ethers.utils.parseEther(`${i + 1}`);
      rewardPerSecond.push(parsedReward);
    }

    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestamp = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestamp + oneMinute * 2;
  };

  beforeEach(async () => {
    [aliceAccount, bobAccount] = await ethers.getSigners();
    staker = aliceAccount;

    const TestERC20 = await ethers.getContractFactory('TestERC20');
    stakingTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;
    await stakingTokenInstance.mint(aliceAccount.address, amount);
    await stakingTokenInstance.mint(bobAccount.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    const CompoundingRewardsPoolInstance = await ethers.getContractFactory('CompoundingRewardsPool');
    OneStakerRewardsPoolInstance = (await CompoundingRewardsPoolInstance.deploy(
      stakingTokenAddress,
      rewardTokensAddresses,
      staker.address,
      startTimestamp,
      endTimestamp,
      name
    )) as CompoundingRewardsPool;

    await rewardTokensInstances[0].mint(OneStakerRewardsPoolInstance.address, amount);

    await OneStakerRewardsPoolInstance.start(startTimestamp, endTimestamp, rewardPerSecond);
  });

  it('Should deploy the OneStakerRewardsPool properly', async () => {
    const stakerAddress = await OneStakerRewardsPoolInstance.staker();

    expect(stakerAddress).to.equal(staker.address, 'The saved staker address');
  });

  describe('Staking', function () {
    beforeEach(async () => {
      await stakingTokenInstance.approve(OneStakerRewardsPoolInstance.address, standardStakingAmount);
      await stakingTokenInstance
        .connect(bobAccount)
        .approve(OneStakerRewardsPoolInstance.address, standardStakingAmount);
      const currentBlock = await ethers.provider.getBlock('latest');
      const blocksDelta = startTimestamp - currentBlock.number;

      await timeTravel(70);
    });

    it('Should successfully stake and accumulate reward', async () => {
      await OneStakerRewardsPoolInstance.connect(staker).stake(standardStakingAmount);

      const currentTime = await getTime();

      const totalStakedAmount = await OneStakerRewardsPoolInstance.totalStaked();
      const userInfo = await OneStakerRewardsPoolInstance.userInfo(aliceAccount.address);
      const userRewardDebt = await OneStakerRewardsPoolInstance.getUserRewardDebt(aliceAccount.address, 0);
      const userOwedToken = await OneStakerRewardsPoolInstance.getUserOwedTokens(aliceAccount.address, 0);

      expect(totalStakedAmount).to.equal(standardStakingAmount, 'The stake was not successful');
      expect(userInfo.amountStaked).to.equal(standardStakingAmount, "User's staked amount is not correct");
      expect(userInfo.firstStakedTimestamp).to.equal(currentTime, "User's first block is not correct");
      expect(userRewardDebt).to.equal(0, "User's reward debt is not correct");
      expect(userOwedToken).to.equal(0, "User's reward debt is not correct");

      await timeTravel(10);

      const accumulatedReward = await OneStakerRewardsPoolInstance.getUserAccumulatedReward(
        staker.address,
        0,
        await getTime()
      );
      expect(accumulatedReward).to.equal(bOne.mul(10), 'The reward accrued was not 1 token');
    });

    it('Should fail if amount to stake is not greater than zero', async () => {
      await expect(OneStakerRewardsPoolInstance.connect(bobAccount).stake(standardStakingAmount)).to.be.revertedWith(
        'onlyStaker::incorrect staker'
      );
    });
  });
});
