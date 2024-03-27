import { BigNumber } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import NuklaiStakingPoolArtifact from '../artifacts/contracts/V2/NuklaiStakingPool.sol/NuklaiStakingPool.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { TestERC20 } from '../typechain/TestERC20';
import { NuklaiStakingPool } from '../typechain/NuklaiStakingPool';
import { getTime, timeTravel } from './utils';

describe.only('NuklaiStakingPool', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  let NuklaiStakingPoolInstance: NuklaiStakingPool;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let externalRewardsTokenInstance: TestERC20;
  let externalRewardsTokenAddress: string;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerSecond: BigNumber[];

  let throttleRoundSeconds = 100;
  let throttleRoundCap = ethers.utils.parseEther('1');

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

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerSecond = [];
    for (let i = 0; i < rewardTokensCount; i++) {
      const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

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

  const stake = async (_throttleRoundSeconds: number, _throttleRoundCap: BigNumber) => {
    NuklaiStakingPoolInstance = (await deployContract(testAccount, NuklaiStakingPoolArtifact, [
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      _throttleRoundSeconds,
      _throttleRoundCap,
      contractStakeLimit,
      'TestCampaign',
    ])) as NuklaiStakingPool;

    const reward = rewardPerSecond[0].mul(endTimestamp - startTimestamp);
    await rewardTokensInstances[0].mint(NuklaiStakingPoolInstance.address, reward);

    await NuklaiStakingPoolInstance.start(startTimestamp, endTimestamp, rewardPerSecond);

    await stakingTokenInstance.approve(NuklaiStakingPoolInstance.address, standardStakingAmount);
    await stakingTokenInstance
      .connect(test2Account)
      .approve(NuklaiStakingPoolInstance.address, standardStakingAmount);

    await timeTravel(70);
    await NuklaiStakingPoolInstance.stake(standardStakingAmount);
  };

  describe('Interaction Mechanics', async function () {
    beforeEach(async () => {
      stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
      await stakingTokenInstance.mint(testAccount.address, amount);
      await stakingTokenInstance.mint(test2Account.address, amount);

      stakingTokenAddress = stakingTokenInstance.address;

      externalRewardsTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
      await externalRewardsTokenInstance.mint(trasury.address, amount);

      externalRewardsTokenAddress = externalRewardsTokenInstance.address;

      await setupRewardsPoolParameters();

      await stake(throttleRoundSeconds, throttleRoundCap);
    });

    it('[Should not claim or withdraw]:', async () => {
      await expect(NuklaiStakingPoolInstance.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );

      await expect(NuklaiStakingPoolInstance.withdraw(bOne)).revertedWith(
        'OnlyExitFeature::cannot withdraw from this contract. Only exit.'
      );
    });

    it('[Should not allow extending]:', async () => {
      await expect(NuklaiStakingPoolInstance.extend(0, [])).to.be.revertedWith(
        'NuklaiStakingPool: cannot extend this pool.'
      );
    });

    it('[Should not exit when disabled]:', async () => {
      await expect(NuklaiStakingPoolInstance.exit()).to.be.revertedWith(
        'NuklaiStakingPool: exit is disabled'
      );
    });

    // it('[Should not exit before end of campaign]:', async () => {
    //   await expect(NuklaiStakingPoolInstance.exit()).to.be.revertedWith(
    //     'onlyUnlocked::cannot perform this action until the end of the lock'
    //   );
    // });

    it('[Should burn all tokens successfully]:', async () => {
      await NuklaiStakingPoolInstance.setExitEnabled(true);

      await timeTravel(140);

      const balanceBefore = await stakingTokenInstance.balanceOf(NuklaiStakingPoolInstance.address);

      await NuklaiStakingPoolInstance.burnAllTokens();

      const balanceAfter = await stakingTokenInstance.balanceOf(NuklaiStakingPoolInstance.address);

      expect(balanceBefore).to.equal(standardStakingAmount);
      expect(balanceAfter).to.equal(0);
    });

    it('[Should request exit successfully]:', async () => {
      await NuklaiStakingPoolInstance.setExitEnabled(true);

      await timeTravel(140);

      const userInitialBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoInitial = await NuklaiStakingPoolInstance.userInfo(testAccount.address);
      const initialTotalStakedAmount = await NuklaiStakingPoolInstance.totalStaked();
      const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userRewards = await NuklaiStakingPoolInstance.getUserAccumulatedReward(
        testAccount.address,
        0,
        await getTime()
      );

      await NuklaiStakingPoolInstance.exit();

      const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(testAccount.address);
      const userTokensOwed = await NuklaiStakingPoolInstance.getUserOwedTokens(testAccount.address, 0);
      const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(testAccount.address);
      const userInfoFinal = await NuklaiStakingPoolInstance.userInfo(testAccount.address);
      const finalTotalStkaedAmount = await NuklaiStakingPoolInstance.totalStaked();
      const finalRewardDebt = await NuklaiStakingPoolInstance.getUserRewardDebt(testAccount.address, 0);

      expect(userFinalBalanceRewards).to.equal(userInitialBalanceRewards);
      expect(userTokensOwed).to.equal(0);
      expect(finalRewardDebt).to.equal(0);
      expect(userFinalBalanceStaking).to.equal(userInitialBalanceStaking);
      expect(userInfoFinal.amountStaked).to.equal(0);
      expect(finalTotalStkaedAmount).to.equal(initialTotalStakedAmount);

      const userExitInfo = await NuklaiStakingPoolInstance.exitInfo(testAccount.address);
      const pendingReward = await NuklaiStakingPoolInstance.getPendingReward(0);
      expect(userInfoInitial.amountStaked).to.equal(userExitInfo.exitStake);
      expect(userRewards).to.equal(pendingReward);
    });
  });
});
