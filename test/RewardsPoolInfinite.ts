import { Provider } from '@ethersproject/abstract-provider';
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
let provider: Provider;
let stakingToken: ERC20Faucet;
let rewards: ERC20Faucet[] = [];
let rewardsPoolBaseInfinite: RewardsPoolbaseInfiniteTest;
let rewardToken: ERC20Faucet;

describe('RewardsPoolBaseInfinite', () => {
  before(async () => {
    signers = await ethers.getSigners();
    stakers = signers.slice(1, 5);
    signer = signers[0];
    provider = signers[0].provider!;

    const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
    stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);

    for (let index = 1; index <= 3; index++) {
      const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
      rewards.push(reward);
    }
  });

  beforeEach(async () => {
    snapshotId = await network.provider.send('evm_snapshot');
  });

  afterEach(async () => {
    await network.provider.send('evm_revert', [snapshotId]);
  });

  describe('1 reward token, no limits', async function () {
    before(async () => {
      rewardToken = rewards[0];
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
      const blockTimeStamp = (await provider.getBlock(receipt.blockNumber)).timestamp;

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(blockTimeStamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(blockTimeStamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.true;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(amount.div(3600 * 24 * 5));
    });

    it('Should be able to start the contract at a certain timestamp', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      const now = Math.round(Date.now() / 1000);
      const startTimestamp = now + 3600 * 2;
      await rewardsPoolBaseInfinite['start(uint256,uint256)'](3600 * 24 * 5, startTimestamp);

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.be.eq(startTimestamp);
      expect(await rewardsPoolBaseInfinite.endTimestamp()).to.be.eq(startTimestamp + 3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.getRewardTokensCount()).to.be.eq(1);
      expect(await rewardsPoolBaseInfinite.epochDuration()).to.be.eq(3600 * 24 * 5);
      expect(await rewardsPoolBaseInfinite.hasStakingStarted()).to.be.false;
      expect(await rewardsPoolBaseInfinite.rewardPerSecond(0)).to.be.eq(amount.div(3600 * 24 * 5));
    });

    it('Cannot start the pool twice', async () => {
      const amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      expect(await rewardsPoolBaseInfinite.startTimestamp()).to.not.be.eq(0);

      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600)).to.be.revertedWith(
        'RewardsPoolBaseInfinite: already started'
      );
    });

    it('Should not start without funds send to the contract', async () => {
      await expect(rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5)).to.be.revertedWith(
        'RewardsPoolBaseInfinite: no rewards for this token'
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

    it('Should be able to stake & claim stake', async () => {
      const staker = stakers[0];
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);
      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(amount);
      expect(await rewardsPoolBaseInfinite.balanceOf(staker.address)).to.be.eq(amount);
      console.log('rewards per second', await rewardsPoolBaseInfinite.rewardPerSecond(0));
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);
      await timeTravel(3600 * 24 * 5);

      const signer2 = (await ethers.getSigners())[1];
      await stakingToken.faucet(signer2.address, amount);
      await stakingToken.connect(signer2).approve(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite.connect(signer2).stake(amount);
      await rewardsPoolBaseInfinite.claim();
    });

    it('Should not be able to stake before pool start', async () => {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);

      await expect(rewardsPoolBaseInfinite.connect(staker).stake(amount)).to.be.revertedWith(
        'RewardsPoolBaseInfinite: staking is not started'
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
        'RewardsPoolBaseInfinite: staking is not started'
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

      expect(rewardsPoolBaseInfinite.connect(staker).withdraw(amount.add(1))).to.be.revertedWith(
        'RewardsPoolBaseInfinite: not enough funds to withdraw'
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
      await rewards[0].faucet(stakers[0].address, amount);

      await rewards[0].connect(stakers[0]).transfer(rewardsPoolBaseInfinite.address, amount);
      expect(await rewards[0].balanceOf(stakers[0].address)).to.be.eq(0);
      await expect(rewardsPoolBaseInfinite.withdrawTokens(stakers[0].address, rewards[0].address)).to.be.revertedWith(
        'RewardsPoolBase: cannot withdraw reward token'
      );
      expect(await rewards[0].balanceOf(stakers[0].address)).to.be.eq(0);
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

      expect(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)).to.be.eq(ethers.utils.parseEther('50000'));
      expect(await rewardToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await rewardToken.balanceOf(staker2.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker2.address)).to.be.eq(0);

      await rewardsPoolBaseInfinite.connect(staker).exit();
      await rewardsPoolBaseInfinite.connect(staker2).exit();

      expect(
        parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address)))
      ).to.be.closeTo(6000, 0.5);
      expect(parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)))).to.be.closeTo(39000, 1);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(ethers.utils.parseEther('10000'));
      expect(parseFloat(ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)))).to.be.closeTo(
        5000,
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

    it.only('Should be able to get available balance', async function () {
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

    it.only('Should not be able to withdraw assigned rewards', async function () {
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

    // TODO: check if it can be extended with 0 rewards
    // TODO: check if it can be extended with < epoch time rewards
    it.only('Can be extended', async function () {
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
  });
});
