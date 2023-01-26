import { Provider } from '@ethersproject/abstract-provider';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, network } from 'hardhat';
import { ERC20Faucet, RewardsPoolBaseInfinite } from '../typechain';
import { timeTravel } from './utils';

let snapshotId: string;
let signers: SignerWithAddress[];
let stakers: SignerWithAddress[];
let provider: Provider;
let stakingToken: ERC20Faucet;
let rewards: ERC20Faucet[] = [];
let rewardsPoolBaseInfinite: RewardsPoolBaseInfinite;
let rewardToken: ERC20Faucet;

interface ItComesWith {
  //   config: {
  //     stakingToken?: string;
  //     rewardsTokens?: string[];
  //     stakeLimit?: BigNumber;
  //     contractStakeLimit?: BigNumber;
  //     name?: string;
  //   };
  start: {
    epochDuration?: BigNumber | number;
    startTimeStamp?: BigNumber | number;
    rewardTokensAmount?: BigNumber[];
  };
}

let itComesWithConfig: Required<ItComesWith> = {
  start: {
    epochDuration: 3600 * 24 * 5,
    rewardTokensAmount: [ethers.utils.parseEther('10000')],
  },
};

const itComesWith = async (func: () => Promise<void>, { start } = itComesWithConfig) => {
  {
    const { epochDuration, rewardTokensAmount, startTimeStamp } = start;
    for (let i = 0; i < rewardTokensAmount!.length; i++) {
      const amount = ethers.utils.parseEther('10');
      await rewards[i].faucet(rewardsPoolBaseInfinite.address, amount);
    }

    if (startTimeStamp) {
      await rewardsPoolBaseInfinite['start(uint256,uint256)'](epochDuration!, startTimeStamp);
    } else {
      await rewardsPoolBaseInfinite['start(uint256)'](epochDuration!);
    }
  }
};

describe('RewardsPoolBaseInfinite', () => {
  before(async () => {
    signers = await ethers.getSigners();
    stakers = signers.slice(5);
    provider = signers[0].provider!;

    const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
    stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);

    for (let index = 1; index <= 3; index++) {
      const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
      rewards.push(reward);
    }

    // defaultConfig = {
    //   config: {
    //     stakingToken: stakingToken.address,
    //     rewardsTokens: [rewards[0].address],
    //     stakeLimit: ethers.constants.MaxUint256,
    //     contractStakeLimit: ethers.constants.MaxUint256,
    //     name: 'Test pool',
    //   },
    // };
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
      const RewardsPoolBaseInfinite = await ethers.getContractFactory('RewardsPoolBaseInfinite');
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

    // TODO: not sure if this is proper design
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

    it('Test excess rewards withdrawal bug #1', async () => {
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];
      const staker2 = stakers[1];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await timeTravel(3600 * 24 * 2);
      //  day 2 of 5 he deposits reward tokens for the next epoch
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await timeTravel(3600 * 24 * 5);
      // day 7 next epoch did start #2
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await timeTravel(3600 * 24 * 5);
      // day 12 yet another epoch #3
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await timeTravel(3600 * 24 * 5);
      // day 17 yet another epoch #4
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await stakingToken.faucet(staker2.address, amount);
      await stakingToken.connect(staker2).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker2).stake(amount);

      await timeTravel(3600 * 24 * 5);
      // day 22 next epoch did start #5
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      // console.log(
      //   'contract balance',
      //   ethers.utils.formatEther(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address))
      // );
      // console.log('staker before', ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)));
      await rewardsPoolBaseInfinite.connect(staker).exit();
      // console.log('staker after', ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)));

      // console.log('staker2 before', ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)));
      await rewardsPoolBaseInfinite.connect(staker2).exit();
      // console.log('staker2 after', ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)));
    });

    it('Test excess rewards withdrawal bug #2', async () => {
      let amount = ethers.utils.parseEther('10000');
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await rewardsPoolBaseInfinite['start(uint256)'](3600 * 24 * 5);

      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];
      const staker2 = stakers[1];
      const staker3 = stakers[2];
      const staker4 = stakers[3];

      await stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      await timeTravel(3600 * 24 * 2);
      //  day 2 of 5 he deposits reward tokens for the next epoch
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await timeTravel(3600 * 24 * 5);
      // day 7 next epoch did start #2
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await stakingToken.faucet(staker2.address, amount);
      await stakingToken.connect(staker2).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker2).stake(amount);

      await stakingToken.faucet(staker3.address, amount);
      await stakingToken.connect(staker3).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker3).stake(amount);

      await timeTravel(3600 * 24 * 5);
      // day 12 yet another epoch #3
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await stakingToken.faucet(staker4.address, amount);
      await stakingToken.connect(staker4).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker4).stake(amount);

      await timeTravel(3600 * 24 * 5);
      // day 17 yet another epoch #4
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await timeTravel(3600 * 24 * 5);
      // day 22 next epoch did start #5
      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      // console.log(
      //   'contract balance',
      //   ethers.utils.formatEther(await rewardToken.balanceOf(rewardsPoolBaseInfinite.address))
      // );
      // console.log('staker before', ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)));
      await rewardsPoolBaseInfinite.connect(staker).exit();
      // console.log('staker after', ethers.utils.formatEther(await rewardToken.balanceOf(staker.address)));

      // console.log('staker2 before', ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)));
      await rewardsPoolBaseInfinite.connect(staker2).exit();
      // console.log('staker2 after', ethers.utils.formatEther(await rewardToken.balanceOf(staker2.address)));

      // console.log('staker3 before', ethers.utils.formatEther(await rewardToken.balanceOf(staker3.address)));
      await rewardsPoolBaseInfinite.connect(staker3).exit();
      // console.log('staker3 after', ethers.utils.formatEther(await rewardToken.balanceOf(staker3.address)));

      // console.log('staker4 before', ethers.utils.formatEther(await rewardToken.balanceOf(staker4.address)));
      await rewardsPoolBaseInfinite.connect(staker4).exit();
      // console.log('staker4 after', ethers.utils.formatEther(await rewardToken.balanceOf(staker4.address)));
    });

    it('Test excess rewards withdrawal bug #2 should fail', async () => {
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

      await timeTravel(3600 * 24 * 2);

      await rewardToken.faucet(rewardsPoolBaseInfinite.address, amount);

      await timeTravel(3600 * 24 * 5);

      console.log(await rewardsPoolBaseInfinite.startTimestamp());
      console.log(await rewardsPoolBaseInfinite.endTimestamp());
      console.log(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000 + 3600 * 24 * 5));

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(rewardsPoolBaseInfinite.address, amount);
      await rewardsPoolBaseInfinite.connect(staker).stake(amount);

      console.log(await rewardToken.balanceOf(signers[0].address));
      await rewardsPoolBaseInfinite.withdrawExcessRewards(signers[0].address);
      console.log(await rewardToken.balanceOf(signers[0].address));
    });
  });
});
