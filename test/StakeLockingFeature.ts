import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from 'ethers';

import { TestERC20 } from '../typechain/TestERC20';
import { StakeLockingRewardsPoolMock } from '../typechain/StakeLockingRewardsPoolMock';
import { StakeLockingFeature } from '../typechain/StakeLockingFeature';
import { getTime, timeTravel } from './utils';

describe('StakeLockingFeature', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;

  let StakeLockingFeatureInstance: StakeLockingRewardsPoolMock;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerSecond: BigNumber[];

  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
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

    const currentTimestamp = await getTime();
    startTimestamp = currentTimestamp + oneMinute;
    endTimestamp = startTimestamp + oneMinute * 2;
  };

  beforeEach(async () => {
    [aliceAccount, bobAccount] = await ethers.getSigners();

    const TestERC20 = await ethers.getContractFactory('TestERC20');
    stakingTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;
    await stakingTokenInstance.mint(aliceAccount.address, amount);
    await stakingTokenInstance.mint(bobAccount.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    const StakeLockingRewardsPoolMock = await ethers.getContractFactory('StakeLockingRewardsPoolMock');
    StakeLockingFeatureInstance = (await StakeLockingRewardsPoolMock.deploy(
      stakingTokenAddress,
      startTimestamp,
      endTimestamp,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      name
    )) as StakeLockingRewardsPoolMock;

    await rewardTokensInstances[0].mint(StakeLockingFeatureInstance.address, amount);

    await StakeLockingFeatureInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

    await stakingTokenInstance.approve(StakeLockingFeatureInstance.address, standardStakingAmount);
    await stakingTokenInstance.connect(bobAccount).approve(StakeLockingFeatureInstance.address, standardStakingAmount);

    await timeTravel(70);
    await StakeLockingFeatureInstance.stake(standardStakingAmount);
  });

  it('Should not claim or withdraw', async () => {
    await expect(StakeLockingFeatureInstance.claim()).to.be.revertedWith(
      'OnlyExitFeature::cannot claim from this contract. Only exit.'
    );
    await expect(StakeLockingFeatureInstance.withdraw(bOne)).to.be.revertedWith(
      'OnlyExitFeature::cannot withdraw from this contract. Only exit.'
    );
  });

  it('Should not exit before end of campaign', async () => {
    await expect(StakeLockingFeatureInstance.exit()).to.be.revertedWith(
      'onlyUnlocked::cannot perform this action until the end of the lock'
    );
  });

  it('Should exit successfully from the RewardsPool', async () => {
    await timeTravel(140);

    const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
    const userInfoInitial = await StakeLockingFeatureInstance.userInfo(aliceAccount.address);
    const initialTotalStakedAmount = await StakeLockingFeatureInstance.totalStaked();
    const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);

    await StakeLockingFeatureInstance.exit();

    const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
    const userTokensOwed = await StakeLockingFeatureInstance.getUserOwedTokens(aliceAccount.address, 0);
    const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
    const userInfoFinal = await StakeLockingFeatureInstance.userInfo(aliceAccount.address);
    const finalTotalStkaedAmount = await StakeLockingFeatureInstance.totalStaked();

    expect(userFinalBalanceRewards.gt(userInitialBalanceRewards), 'Rewards claim was not successful');
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
});
