import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, network } from 'hardhat';
import { ERC20Faucet, RewardsPoolbaseInfiniteTest } from '../typechain';
import { timeTravel } from './utils';

let snapshotId: string;
let signer: SignerWithAddress;
let signers: SignerWithAddress[];
let stakers: SignerWithAddress[];
let provider: any;
let stakingToken: ERC20Faucet;
let rewards: ERC20Faucet[] = [];
let rewardsPoolBaseInfinite: RewardsPoolbaseInfiniteTest;
let rewardToken: ERC20Faucet;

async function setupRewardsPoolParameters() {
  rewards = [];

  signers = await ethers.getSigners();
  stakers = signers.slice(5);

  const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
  stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);

  for (let index = 1; index <= 3; index++) {
    const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
    rewards.push(reward);
  }

  rewardToken = rewards[0];
  const RewardsPoolBaseInfinite = await ethers.getContractFactory('RewardsPoolbaseInfiniteTest');
  rewardsPoolBaseInfinite = await RewardsPoolBaseInfinite.deploy(
    stakingToken.address,
    [rewardToken.address],
    ethers.constants.MaxUint256,
    ethers.constants.MaxUint256,
    'Test pool'
  );
}

describe('RewardsPoolBaseInfinite', () => {
  before(async () => {
    signers = await ethers.getSigners();
    stakers = signers.slice(1, 5);
    signer = signers[0];
    provider = signers[0].provider!;
  });

  beforeEach(async () => {
    snapshotId = await network.provider.send('evm_snapshot');
  });

  afterEach(async () => {
    await network.provider.send('evm_revert', [snapshotId]);
  });

  describe('1 reward token, no limits', async function () {
    beforeEach(async () => await setupRewardsPoolParameters());

    it('Should extend a campaign when it needs to be extended', async () => {
      for (let decimals = 0; decimals <= 18; decimals++) {
        const rewardToken = await (
          await ethers.getContractFactory('ERC20Faucet')
        ).deploy('Test token', 'TEST', decimals);

        const rewardsPoolBaseInfinite = await (
          await ethers.getContractFactory('RewardsPoolbaseInfiniteTest')
        ).deploy(
          stakingToken.address,
          [rewardToken.address],
          ethers.constants.MaxUint256,
          ethers.constants.MaxUint256,
          'Test Pool'
        );

        expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

        const minimalAmount = decimals > 10 ? BigNumber.from(10).pow(decimals - 10) : BigNumber.from(2);

        await rewardToken.faucet(rewardsPoolBaseInfinite.address, minimalAmount.sub(1));
        expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

        await rewardToken.faucet(rewardsPoolBaseInfinite.address, 1);
        expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.true;
      }
    });

    it('Should have initialized pool properly', async () => {
      expect(await rewardsPoolBaseInfinite.stakingToken()).to.be.eq(stakingToken.address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(0)).to.be.eq(rewards[0].address);
      expect(await rewardsPoolBaseInfinite.stakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.contractStakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(0)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.name()).to.be.eq('Test pool');
    });

    it('Should be able to start the contract', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      const tx = await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const receipt = await tx.wait(1);
      const blockTimeStamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        amount.sub(amount.mul(300).div(10000))
      );
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(blockTimeStamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(blockTimeStamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.true;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        amount
          .sub(amount.mul(300).div(10000))
          .mul(ethers.utils.parseEther('1'))
          .div(3600 * 24 * 5)
      );
    });

    it('Should be able to start the contract at a certain timestamp', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      const now = Math.round(Date.now() / 1000);
      const startTimestamp = now + 3600 * 2;
      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, startTimestamp);

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        amount.sub(amount.mul(300).div(10000))
      );
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(startTimestamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(startTimestamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        amount
          .sub(amount.mul(300).div(10000))
          .mul(ethers.utils.parseEther('1'))
          .div(3600 * 24 * 5)
      );
    });

    it('Cannot start the pool twice', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.not.be.eq(0);

      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600)).to.be.revertedWith(
        'RewardsPoolBase: already started'
      );
    });

    it('Should not start without funds send to the contract', async () => {
      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5)).to.be.revertedWith(
        'RewardsPoolBase: no rewards for this token'
      );
    });

    it('Should be able to stake & unstake', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).exit();

      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should be able to stake & withdraw deposited funds', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).withdraw(amount);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should not be able to stake before pool start', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to stake before pool start at timestamp', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, Math.floor(Date.now() / 1000 + 3600));

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await timeTravel(3600);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to withdraw more then deposited', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);

      await expect(rewardsPoolBaseInfinite.connect(staker).withdraw(amount.add(1))).to.be.revertedWith(
        'RewardsPoolBase: not enough funds to withdraw'
      );
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
    });

    it('Should not be able to call onlyOwner functions', async () => {
      await expect(rewardsPoolBaseInfinite.connect(signers[1])['start(uint256)'](3600)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          ['start(uint256,uint256)'](3600, Math.round(Date.now() / 1000 + 1800))
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          .withdrawTokens(ethers.constants.AddressZero, ethers.constants.AddressZero)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should be able to withdraw accidentially send funds', async function () {
      const amount = ethers.utils.parseEther('10000');
      await rewards[2].faucet(stakers[0].address, amount);
      await rewards[2].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);

      expect(await rewards[2].balanceOf(stakers[0].address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[2].address));
      expect(await rewards[2].balanceOf(stakers[0].address)).to.be.eq(amount);
    });

    it('Should not be able to withdraw staking tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      await stakingToken.faucet(stakers[0].address, amount);

      await stakingToken.connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, stakingToken.address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw staking token'
      );
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
    });

    it('Should not be able to call the extend method', async function () {
      await expect(rewardsPoolBaseInfinite.extend(3600, [0])).to.be.revertedWith(
        'RewardsPoolBase: not implemented on infinite pools'
      );
    });

    it('Should not be able to call the cancel method', async function () {
      await expect(rewardsPoolBaseInfinite.cancel()).to.be.revertedWith(
        'RewardsPoolBase: not implemented on infinite pools'
      );
    });

    it('Should not be able to withdraw staking tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      await rewards[0].faucet(stakers[0].address, amount);

      await rewards[0].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await rewards[0].balanceOf(stakers[0].address)).to.be.eq(0);
      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[0].address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw reward token'
      );
      expect(await rewards[0].balanceOf(stakers[0].address)).to.be.eq(0);
    });

    it.only('Should be able to stake after 1 epoch with no stakers have passed', async () => {
      const staker = stakers[0];

      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await timeTravel(3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Test calculations with 2 stakers #1', async () => {
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const staker = stakers[0];
      const staker2 = stakers[1];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await timeTravel(3600 * 24 * 2);
      //  day 2 of 5 he deposits reward tokens for the next epoch
      //  Staker 1: 4k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);

      // day 7 next epoch did start #2
      //  Staker 1: 14k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 12 yet another epoch #3
      //  Staker 1: 24k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 17 yet another epoch #4
      //  Staker 1: 34k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await stakingToken.faucet(staker2.address, amount);
      await stakingToken.connect(staker2).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker2).stake(amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 22 next epoch did start #5
      //  Staker 1: 39k rewards
      //  Staker 2: 5k rewards
      //   Pool 6k rewards

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('48500'));
      expect(await rewardToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await rewardToken.balanceOf(staker2.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.connect(staker).exit();
      await rewardsPoolBaseInfinite.connect(staker2).exit();

      expect(
        parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(5820, 0.5);
      expect(parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)))).to.be.closeTo(37830, 1);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)))).to.be.closeTo(
        4850,
        0.5
      );
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(ethers.utils.parseEther('10000'));
    });
    it('Should have the correct tokens length', async () => {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getUserTokensOwedLength(staker.address)).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.getUserRewardDebtLength(staker.address)).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
    });

    it('Should have the correct campaign count', async () => {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(1);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(2);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(3);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(4);
    });

    it('Should be able to get available balance', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('0'));

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('10000'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(0)).sub(amount))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
    });

    it('Should not be able to withdraw assigned rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);

      expect(await rewardToken.balanceOf(signer.address)).to.be.eq(0);
      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(0);
      expect(await rewardToken.balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(0);
    });

    it('Can withdraw accidentally send funds', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10000'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10000'));

      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(await rewards[1].balanceOf(signer.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.withdrawTokens(signer.address, rewards[1].address);
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(signer.address)).to.be.eq(ethers.utils.parseEther('10000'));

      await rewardsPoolBaseInfinite.withdrawTokens(signer.address, rewards[2].address);
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(ethers.utils.parseEther('10000'));
    });

    it('Cannot be extended with 0 rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      const signerBalanceBefore = await rewardToken.balanceOf(signer.address);

      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewardToken.balanceOf(signer.address)).to.be.gt(signerBalanceBefore);
      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });

    it('Cannot be extended with < epoch time rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.lt(3600 * 24 * 5 * 2);
      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });
  });

  describe('1 reward token, same as staking token', async function () {
    let stakingToken: ERC20Faucet;
    let rewards: ERC20Faucet[] = [];
    let rewardsPoolBaseInfinite: RewardsPoolbaseInfiniteTest;
    let rewardToken: ERC20Faucet;

    before(async () => {
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);

      for (let index = 1; index <= 3; index++) {
        const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
        rewards.push(reward);
      }

      rewardToken = stakingToken;

      const RewardsPoolBaseInfinite = await ethers.getContractFactory('RewardsPoolbaseInfiniteTest');
      rewardsPoolBaseInfinite = await RewardsPoolBaseInfinite.deploy(
        stakingToken.address,
        [rewardToken.address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    it('Should have initialized pool properly', async () => {
      expect(await rewardsPoolBaseInfinite.stakingToken()).to.be.eq(stakingToken.address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(0)).to.be.eq(rewardToken.address);
      expect(await rewardsPoolBaseInfinite.stakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.contractStakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(0)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.name()).to.be.eq('Test pool');
    });

    it('Should be able to start the contract', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      const tx = await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const receipt = await tx.wait(1);
      const blockTimeStamp = (await provider.getBlock(receipt.blockNumber)).timestamp;

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount.mul(97).div(100));
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(blockTimeStamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(blockTimeStamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.true;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        amount
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
    });

    it('Should be able to start the contract at a certain timestamp', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      const now = Math.round(Date.now() / 1000);
      const startTimestamp = now + 3600 * 2;
      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, startTimestamp);

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount.mul(97).div(100));
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(startTimestamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(startTimestamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        amount
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
    });

    it('Cannot start the pool twice', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.not.be.eq(0);

      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600)).to.be.revertedWith(
        'RewardsPoolBase: already started'
      );
    });

    it('Should not start without funds send to the contract', async () => {
      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5)).to.be.revertedWith(
        'RewardsPoolBase: no rewards for this token'
      );
    });

    it('Should be able to stake & unstake', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10009.7')
      );
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).exit();

      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address))
        .to.be.gt(0)
        .and.lt(ethers.utils.parseEther('10000'));
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address))
        .to.be.gt(amount)
        .and.lt(ethers.utils.parseEther('10001'));
    });

    it('Should be able to stake & withdraw deposited funds', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10009.7')
      );
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).withdraw(amount);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('9.7'));
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should not be able to stake before pool start', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to stake before pool start at timestamp', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, Math.floor(Date.now() / 1000 + 3600));

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await timeTravel(3600);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to withdraw more then deposited', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10009.7')
      );

      expect(rewardsPoolBaseInfinite.connect(staker).withdraw(amount.add(1))).to.be.revertedWith(
        'RewardsPoolBase: not enough funds to withdraw'
      );
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10009.7')
      );
    });

    it('Should not be able to call onlyOwner functions', async () => {
      await expect(rewardsPoolBaseInfinite.connect(signers[1])['start(uint256)'](3600)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          ['start(uint256,uint256)'](3600, Math.round(Date.now() / 1000 + 1800))
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          .withdrawTokens(ethers.constants.AddressZero, ethers.constants.AddressZero)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should be able to withdraw accidentially send funds', async function () {
      const amount = ethers.utils.parseEther('10000');
      await rewards[2].faucet(stakers[0].address, amount);
      await rewards[2].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);

      expect(await rewards[2].balanceOf(stakers[0].address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[2].address));
      expect(await rewards[2].balanceOf(stakers[0].address)).to.be.eq(amount);
    });

    it('Should not be able to withdraw staking tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      await stakingToken.faucet(stakers[0].address, amount);

      await stakingToken.connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, stakingToken.address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw staking token'
      );
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
    });

    it('Should not be able to withdraw reward tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(stakers[0].address, amount);

      await rewardToken.connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await rewardToken.balanceOf(stakers[0].address)).to.be.eq(0);

      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewardToken.address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw staking token'
      );
      expect(await rewardToken.balanceOf(stakers[0].address)).to.be.eq(0);
    });

    it('Test calculations with 2 stakers #1', async () => {
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const staker = stakers[0];
      const staker2 = stakers[1];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await timeTravel(3600 * 24 * 2);
      //  day 2 of 5 he deposits reward tokens for the next epoch
      //  Staker 1: 4k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);

      // day 7 next epoch did start #2
      //  Staker 1: 14k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 12 yet another epoch #3
      //  Staker 1: 24k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 17 yet another epoch #4
      //  Staker 1: 34k rewards
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await stakingToken.faucet(staker2.address, amount);
      await stakingToken.connect(staker2).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker2).stake(amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 22 next epoch did start #5
      //  Staker 1: 39k rewards
      //  Staker 2: 5k rewards
      //   Pool 6k rewards

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('68500'));
      expect(await rewardToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await rewardToken.balanceOf(staker2.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.connect(staker).exit();
      await rewardsPoolBaseInfinite.connect(staker2).exit();

      expect(
        parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(5820, 0.5);
      expect(parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)))).to.be.closeTo(47830, 1);
      expect(parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)))).to.be.closeTo(
        14850,
        0.5
      );
    });
    it('Should have the correct tokens length', async () => {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getUserTokensOwedLength(staker.address)).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.getUserRewardDebtLength(staker.address)).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
    });

    it('Should have the correct campaign count', async () => {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(1);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(2);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(3);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(4);
    });

    it('Should be able to get available balance', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('0'));

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('10000'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(0)).sub(amount))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
    });

    it('Should not be able to withdraw assigned rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);

      expect(await rewardToken.balanceOf(signer.address)).to.be.eq(0);
      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(0);
      expect(await rewardToken.balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(0);
    });

    it('Can withdraw accidentally send funds', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10000'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10000'));

      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(await rewards[1].balanceOf(signer.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.withdrawTokens(signer.address, rewards[1].address);
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(signer.address)).to.be.eq(ethers.utils.parseEther('10000'));

      await rewardsPoolBaseInfinite.withdrawTokens(signer.address, rewards[2].address);
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(ethers.utils.parseEther('10000'));
    });

    it('Cannot be extended with 0 rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      const signerBalanceBefore = await rewardToken.balanceOf(signer.address);

      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewardToken.balanceOf(signer.address)).to.be.gt(signerBalanceBefore);
      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });

    it('Cannot be extended with < epoch time rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.lt(3600 * 24 * 5 * 2);
      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });
  });

  describe('2 reward tokens, no limits', async function () {
    let stakingToken: ERC20Faucet;
    let rewards: ERC20Faucet[] = [];
    let rewardsPoolBaseInfinite: RewardsPoolbaseInfiniteTest;

    before(async () => {
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);

      for (let index = 1; index <= 3; index++) {
        const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
        rewards.push(reward);
      }

      const RewardsPoolBaseInfinite = await ethers.getContractFactory('RewardsPoolbaseInfiniteTest');
      rewardsPoolBaseInfinite = await RewardsPoolBaseInfinite.deploy(
        stakingToken.address,
        [rewards[0].address, rewards[1].address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    it('Should have initialized pool properly', async () => {
      expect(await rewardsPoolBaseInfinite.stakingToken()).to.be.eq(stakingToken.address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(0)).to.be.eq(rewards[0].address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(1)).to.be.eq(rewards[1].address);
      expect(await rewardsPoolBaseInfinite.stakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.contractStakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(0)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(1)).to.be.eq(0);

      expect(await rewardsPoolBaseInfinite.name()).to.be.eq('Test pool');
    });

    it('Should be able to start the contract', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));

      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      const tx = await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const receipt = await tx.wait(1);
      const blockTimeStamp = (await provider.getBlock(receipt.blockNumber)).timestamp;

      expect(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10').mul(97).div(100)
      );
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('5').mul(97).div(100)
      );
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(blockTimeStamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(blockTimeStamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(2);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.true;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        ethers.utils
          .parseEther('10')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(1)).to.be.eq(
        ethers.utils
          .parseEther('5')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
    });

    it('Should be able to start the contract at a certain timestamp', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      const now = Math.round(Date.now() / 1000);
      const startTimestamp = now + 3600 * 2;
      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, startTimestamp);

      expect(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10').mul(97).div(100)
      );
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('5').mul(97).div(100)
      );
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(startTimestamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(startTimestamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(2);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        ethers.utils
          .parseEther('10')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(1)).to.be.eq(
        ethers.utils
          .parseEther('5')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
    });

    it('Cannot start the pool twice', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.not.be.eq(0);

      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600)).to.be.revertedWith(
        'RewardsPoolBase: already started'
      );
    });

    it('Should not start without funds send to the contract', async () => {
      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5)).to.be.revertedWith(
        'RewardsPoolBase: no rewards for this token'
      );
    });

    it('Should be able to stake & unstake', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).exit();

      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should be able to stake & withdraw deposited funds', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).withdraw(amount);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should not be able to stake before pool start', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to stake before pool start at timestamp', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, Math.floor(Date.now() / 1000 + 3600));

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await timeTravel(3600);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to withdraw more then deposited', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);

      expect(rewardsPoolBaseInfinite.connect(staker).withdraw(amount.add(1))).to.be.revertedWith(
        'RewardsPoolBase: not enough funds to withdraw'
      );
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
    });

    it('Should not be able to call onlyOwner functions', async () => {
      await expect(rewardsPoolBaseInfinite.connect(signers[1])['start(uint256)'](3600)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          ['start(uint256,uint256)'](3600, Math.round(Date.now() / 1000 + 1800))
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          .withdrawTokens(ethers.constants.AddressZero, ethers.constants.AddressZero)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should be able to withdraw accidentially send funds', async function () {
      const amount = ethers.utils.parseEther('10000');
      await rewards[2].faucet(stakers[0].address, amount);
      await rewards[2].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);

      expect(await rewards[2].balanceOf(stakers[0].address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[2].address));
      expect(await rewards[2].balanceOf(stakers[0].address)).to.be.eq(amount);
    });

    it('Should not be able to withdraw staking tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      await stakingToken.faucet(stakers[0].address, amount);

      await stakingToken.connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, stakingToken.address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw staking token'
      );
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
    });

    it('Should not be able to withdraw reward tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      for (let index = 0; index < 2; index++) {
        await rewards[index].faucet(stakers[0].address, amount);
        await rewards[index].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
        expect(await rewards[index].balanceOf(stakers[0].address)).to.be.eq(0);

        await expect(
          rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[index].address)
        ).to.be.revertedWith('RewardsPoolBase: cannot withdraw reward token');

        expect(await rewards[index].balanceOf(stakers[0].address)).to.be.eq(0);
      }
    });

    it('Test calculations with 2 stakers #1', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      amount = ethers.utils.parseEther('5');
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const staker = stakers[0];
      const staker2 = stakers[1];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await timeTravel(3600 * 24 * 2);
      //  day 2 of 5 he deposits reward tokens for the next epoch
      //  Staker 1: 4k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));

      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);

      // day 7 next epoch did start #2
      //  Staker 1: 14k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 12 yet another epoch #3
      //  Staker 1: 24k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 17 yet another epoch #4
      //  Staker 1: 34k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));

      await stakingToken.faucet(staker2.address, amount);
      await stakingToken.connect(staker2).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker2).stake(amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 22 next epoch did start #5
      //  Staker 1: 39k rewards
      //  Staker 2: 5k rewards
      //   Pool 6k rewards

      expect(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('48.5'));
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('24.25'));

      expect(await rewards[0].balanceOf(staker.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await rewards[0].balanceOf(staker2.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(staker2.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.connect(staker).exit();
      await rewardsPoolBaseInfinite.connect(staker2).exit();

      expect(
        parseFloat(ethers.utils.formatEther(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(5.82, 0.005);
      expect(
        parseFloat(ethers.utils.formatEther(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(2.91, 0.005);
      expect(parseFloat(ethers.utils.formatEther(await rewards[0].balanceOf(staker.address)))).to.be.closeTo(
        37.83,
        0.001
      );
      expect(parseFloat(ethers.utils.formatEther(await rewards[1].balanceOf(staker.address)))).to.be.closeTo(
        18.915,
        0.001
      );

      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(ethers.utils.parseEther('5'));
      expect(parseFloat(ethers.utils.formatEther(await rewards[0].balanceOf(staker2.address)))).to.be.closeTo(
        4.85,
        0.005
      );
      expect(parseFloat(ethers.utils.formatEther(await rewards[1].balanceOf(staker2.address)))).to.be.closeTo(
        2.425,
        0.005
      );
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(ethers.utils.parseEther('5'));
    });
    it('Should have the correct tokens length', async () => {
      const staker = stakers[0];
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      let amount = ethers.utils.parseEther('10000');

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getUserTokensOwedLength(staker.address)).to.be.eq(2);
      expect(await rewardsPoolBaseInfinite.getUserRewardDebtLength(staker.address)).to.be.eq(2);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(2);
    });

    it('Should have the correct campaign count', async () => {
      const staker = stakers[0];
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      let amount = ethers.utils.parseEther('10000');

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(1);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(2);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(3);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(4);
    });

    it('Should be able to get available balance', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('0'));
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.eq(ethers.utils.parseEther('0'));

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('10'));
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.eq(ethers.utils.parseEther('5'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      //   TODO: check if this is calculation error
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(0)).sub(ethers.utils.parseEther('10')))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(1)).sub(ethers.utils.parseEther('5')))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
    });

    it('Should not be able to withdraw assigned rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);

      expect(await rewards[0].balanceOf(signer.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(signer.address)).to.be.eq(0);
      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.eq(0);

      expect(await rewards[0].balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewards[1].balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
    });

    it('Can withdraw accidentally send funds', async function () {
      const staker = stakers[0];
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      let amount = ethers.utils.parseEther('10000');
      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10000'));

      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.withdrawTokens(signer.address, rewards[2].address);
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(ethers.utils.parseEther('10000'));
    });

    it('Cannot be extended with 0 rewards', async function () {
      const staker = stakers[0];

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      let amount = ethers.utils.parseEther('10000');

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      const signerBalanceBeforeReward0 = await rewards[0].balanceOf(signer.address);
      const signerBalanceBeforeReward1 = await rewards[1].balanceOf(signer.address);

      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewards[0].balanceOf(signer.address)).to.be.gt(signerBalanceBeforeReward0);
      expect(await rewards[1].balanceOf(signer.address)).to.be.gt(signerBalanceBeforeReward1);
      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });

    it('Cannot be extended with < epoch time rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.lt(3600 * 24 * 5 * 2);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.lt(3600 * 24 * 5 * 2);

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.connect(staker).exit();

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });
  });

  describe('3 reward tokens, no limits', async function () {
    let stakingToken: ERC20Faucet;
    let rewards: ERC20Faucet[] = [];
    let rewardsPoolBaseInfinite: RewardsPoolbaseInfiniteTest;

    before(async () => {
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);

      for (let index = 1; index <= 3; index++) {
        const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
        rewards.push(reward);
      }

      const RewardsPoolBaseInfinite = await ethers.getContractFactory('RewardsPoolbaseInfiniteTest');
      rewardsPoolBaseInfinite = await RewardsPoolBaseInfinite.deploy(
        stakingToken.address,
        [rewards[0].address, rewards[1].address, rewards[2].address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    it('Should have initialized pool properly', async () => {
      expect(await rewardsPoolBaseInfinite.stakingToken()).to.be.eq(stakingToken.address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(0)).to.be.eq(rewards[0].address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(1)).to.be.eq(rewards[1].address);
      expect(await rewardsPoolBaseInfinite.rewardsTokens(2)).to.be.eq(rewards[2].address);

      expect(await rewardsPoolBaseInfinite.stakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.contractStakeLimit()).to.be.eq(ethers.constants.MaxUint256);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(0)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(1)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.accumulatedRewardMultiplier(2)).to.be.eq(0);

      expect(await rewardsPoolBaseInfinite.name()).to.be.eq('Test pool');
    });

    it('Should be able to start the contract', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      const tx = await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const receipt = await tx.wait(1);
      const blockTimeStamp = (await provider.getBlock(receipt.blockNumber)).timestamp;

      expect(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10').mul(97).div(100)
      );
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('5').mul(97).div(100)
      );
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('20').mul(97).div(100)
      );
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(blockTimeStamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(blockTimeStamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(3);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.true;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        ethers.utils
          .parseEther('10')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(1)).to.be.eq(
        ethers.utils
          .parseEther('5')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(2)).to.be.eq(
        ethers.utils
          .parseEther('20')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
    });

    it('Should be able to start the contract at a certain timestamp', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      const now = Math.round(Date.now() / 1000);
      const startTimestamp = now + 3600 * 2;
      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, startTimestamp);

      expect(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('10').mul(97).div(100)
      );
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(
        ethers.utils.parseEther('5').mul(97).div(100)
      );
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(startTimestamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(startTimestamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(3);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(
        ethers.utils
          .parseEther('10')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(1)).to.be.eq(
        ethers.utils
          .parseEther('5')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(2)).to.be.eq(
        ethers.utils
          .parseEther('20')
          .mul(97)
          .mul(ethers.utils.parseEther('1'))
          .div(100)
          .div(3600 * 24 * 5)
      );
    });

    it('Cannot start the pool twice', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.not.be.eq(0);

      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600)).to.be.revertedWith(
        'RewardsPoolBase: already started'
      );
    });

    it('Should not start without funds send to the contract', async () => {
      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5)).to.be.revertedWith(
        'RewardsPoolBase: no rewards for this token'
      );
    });

    it('Should be able to stake & unstake', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      const amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).exit();

      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should be able to stake & withdraw deposited funds', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);

      await rewardsPoolBaseInfinite.connect(staker).withdraw(amount);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should not be able to stake before pool start', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      const amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to stake before pool start at timestamp', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      const amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, Math.floor(Date.now() / 1000 + 3600));

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBase: staking is not started'
      );

      await timeTravel(3600);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
    });

    it('Should not be able to withdraw more then deposited', async () => {
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);

      expect(rewardsPoolBaseInfinite.connect(staker).withdraw(amount.add(1))).to.be.revertedWith(
        'RewardsPoolBase: not enough funds to withdraw'
      );
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
    });

    it('Should not be able to call onlyOwner functions', async () => {
      await expect(rewardsPoolBaseInfinite.connect(signers[1])['start(uint256)'](3600)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          ['start(uint256,uint256)'](3600, Math.round(Date.now() / 1000 + 1800))
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(
        rewardsPoolBaseInfinite
          .connect(signers[1])
          .withdrawTokens(ethers.constants.AddressZero, ethers.constants.AddressZero)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should be able to withdraw accidentially send funds', async function () {
      const amount = ethers.utils.parseEther('10000');
      const er20Faucet = await (await ethers.getContractFactory('ERC20Faucet')).deploy('Test token', 'TEST', 18);
      await er20Faucet.faucet(stakers[0].address, amount);
      await er20Faucet.connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);

      expect(await er20Faucet.balanceOf(stakers[0].address)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, er20Faucet.address));
      expect(await er20Faucet.balanceOf(stakers[0].address)).to.be.eq(amount);
    });

    it('Should not be able to withdraw staking tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      await stakingToken.faucet(stakers[0].address, amount);

      await stakingToken.connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, stakingToken.address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw staking token'
      );
      expect(await stakingToken.balanceOf(stakers[0].address)).to.be.eq(0);
    });

    it('Should not be able to withdraw reward tokens', async function () {
      const amount = ethers.utils.parseEther('10000');
      for (let index = 0; index < 3; index++) {
        await rewards[index].faucet(stakers[0].address, amount);
        await rewards[index].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
        expect(await rewards[index].balanceOf(stakers[0].address)).to.be.eq(0);

        await expect(
          rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[index].address)
        ).to.be.revertedWith('RewardsPoolBase: cannot withdraw reward token');

        expect(await rewards[index].balanceOf(stakers[0].address)).to.be.eq(0);
      }
    });

    it('Test calculations with 3 stakers #1', async () => {
      let amount = ethers.utils.parseEther('10000');
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      const staker = stakers[0];
      const staker2 = stakers[1];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await timeTravel(3600 * 24 * 2);
      //  day 2 of 5 he deposits reward tokens for the next epoch
      //  Staker 1: 4k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);

      // day 7 next epoch did start #2
      //  Staker 1: 14k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 12 yet another epoch #3
      //  Staker 1: 24k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 17 yet another epoch #4
      //  Staker 1: 34k rewards
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await stakingToken.faucet(staker2.address, amount);
      await stakingToken.connect(staker2).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker2).stake(amount);
      await timeTravel(3600 * 24 * 3);

      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      await timeTravel(3600 * 24 * 2);
      // day 22 next epoch did start #5
      //  Staker 1: 39k rewards
      //  Staker 2: 5k rewards
      //   Pool 6k rewards

      expect(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('48.5'));
      expect(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('24.25'));
      expect(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('97'));

      expect(await rewards[0].balanceOf(staker.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(staker.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await rewards[0].balanceOf(staker2.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(staker2.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(staker2.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.connect(staker).exit();
      await rewardsPoolBaseInfinite.connect(staker2).exit();

      expect(
        parseFloat(ethers.utils.formatEther(await rewards[0].balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(5.82, 0.005);
      expect(
        parseFloat(ethers.utils.formatEther(await rewards[1].balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(2.91, 0.005);
      expect(
        parseFloat(ethers.utils.formatEther(await rewards[2].balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(11.64, 0.005);
      expect(parseFloat(ethers.utils.formatEther(await rewards[0].balanceOf(staker.address)))).to.be.closeTo(
        37.83,
        0.001
      );
      expect(parseFloat(ethers.utils.formatEther(await rewards[1].balanceOf(staker.address)))).to.be.closeTo(
        18.915,
        0.001
      );
      expect(parseFloat(ethers.utils.formatEther(await rewards[2].balanceOf(staker.address)))).to.be.closeTo(
        75.66,
        0.005
      );

      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(parseFloat(ethers.utils.formatEther(await rewards[0].balanceOf(staker2.address)))).to.be.closeTo(
        4.85,
        0.005
      );
      expect(parseFloat(ethers.utils.formatEther(await rewards[1].balanceOf(staker2.address)))).to.be.closeTo(
        2.425,
        0.005
      );
      expect(parseFloat(ethers.utils.formatEther(await rewards[2].balanceOf(staker2.address)))).to.be.closeTo(
        9.7,
        0.005
      );

      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(ethers.utils.parseEther('10000'));
    });
    it('Should have the correct tokens length', async () => {
      const staker = stakers[0];
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      let amount = ethers.utils.parseEther('10000');

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getUserTokensOwedLength(staker.address)).to.be.eq(3);
      expect(await rewardsPoolBaseInfinite.getUserRewardDebtLength(staker.address)).to.be.eq(3);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(3);
    });

    it('Should have the correct campaign count', async () => {
      const staker = stakers[0];
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      let amount = ethers.utils.parseEther('10000');

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(1);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(2);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(3);

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.getPreviousCampaignsCount()).to.be.eq(4);
    });

    it('Should be able to get available balance', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('0'));

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(ethers.utils.parseEther('10'));
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.eq(ethers.utils.parseEther('5'));
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(2)).to.be.eq(ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(2))
        .to.be.lt(3600 * 24 * 5)
        .and.gte(0);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      //   TODO: check if this is calculation error
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(2))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(0)).sub(ethers.utils.parseEther('10')))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(1)).sub(ethers.utils.parseEther('5')))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect((await rewardsPoolBaseInfinite.getAvailableBalance(2)).sub(ethers.utils.parseEther('20')))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
    });

    it('Should not be able to withdraw assigned rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(2))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);

      expect(await rewards[0].balanceOf(signer.address)).to.be.eq(0);
      expect(await rewards[1].balanceOf(signer.address)).to.be.eq(0);
      expect(await rewards[2].balanceOf(signer.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.eq(0);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(2)).to.be.eq(0);

      expect(await rewards[0].balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewards[1].balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
      expect(await rewards[2].balanceOf(signer.address))
        .to.be.lt(3600 * 24 * 5 * 2)
        .and.gte(0);
    });

    it('Can withdraw accidentally send funds', async function () {
      const erc20 = await (await ethers.getContractFactory('ERC20Faucet')).deploy('Test token', 'TEST', 18);
      const staker = stakers[0];
      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));

      let amount = ethers.utils.parseEther('10000');
      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await erc20.faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10000'));

      expect(await erc20.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(await erc20.balanceOf(signer.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.withdrawTokens(signer.address, erc20.address);
      expect(await erc20.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(0);
      expect(await erc20.balanceOf(signer.address)).to.be.eq(ethers.utils.parseEther('10000'));
    });

    it('Cannot be extended with 0 rewards', async function () {
      const staker = stakers[0];

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('10'));
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('5'));
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, ethers.utils.parseEther('20'));
      let amount = ethers.utils.parseEther('10000');

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      const signerBalanceBeforeReward0 = await rewards[0].balanceOf(signer.address);
      const signerBalanceBeforeReward1 = await rewards[1].balanceOf(signer.address);
      const signerBalanceBeforeReward2 = await rewards[2].balanceOf(signer.address);

      await rewardsPoolBaseInfinite.withdrawExcessRewards(signer.address);
      expect(await rewards[0].balanceOf(signer.address)).to.be.gt(signerBalanceBeforeReward0);
      expect(await rewards[1].balanceOf(signer.address)).to.be.gt(signerBalanceBeforeReward1);
      expect(await rewards[2].balanceOf(signer.address)).to.be.gt(signerBalanceBeforeReward2);
      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });

    it('Cannot be extended with < epoch time rewards', async function () {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');

      await rewards[0].faucet(rewardsPoolBaseInfinite.address, amount);
      await rewards[1].faucet(rewardsPoolBaseInfinite.address, amount);
      await rewards[2].faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      expect(await rewardsPoolBaseInfinite.getAvailableBalance(0)).to.be.lt(3600 * 24 * 5 * 2);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(1)).to.be.lt(3600 * 24 * 5 * 2);
      expect(await rewardsPoolBaseInfinite.getAvailableBalance(2)).to.be.lt(3600 * 24 * 5 * 2);

      expect(await rewardsPoolBaseInfinite.canBeExtended()).to.be.false;

      const endTimestamp = await rewardsPoolBaseInfinite.endTimestamp();
      await timeTravel(3600 * 24 * 5);
      await rewardsPoolBaseInfinite.updateRewardMultipliers();
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(endTimestamp);
    });
  });
});
