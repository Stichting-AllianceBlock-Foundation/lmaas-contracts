import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, utils, Wallet } from 'ethers';
import { ethers, network } from 'hardhat';
import { ERC20Faucet, NonCompoundingRewardsPoolInfinite } from '../typechain';
import { timeTravel } from './utils';

let signers: SignerWithAddress[];
let stakers: SignerWithAddress[];
let stakingToken: ERC20Faucet;
let rewards: ERC20Faucet[] = [];
let nonCompoundingRewardsPoolInfinite: NonCompoundingRewardsPoolInfinite;
let rewardToken: ERC20Faucet;
let snapshots: string[] = [];
let functionSlots: any[] = [];

const snapshot = async () => {
  const snapshotId = await network.provider.send('evm_snapshot');

  snapshots.push(snapshotId);
};

const revert = () => network.provider.send('evm_revert', [snapshots.pop()]);

let stake = async (_staker: number, _amount: number) => {
  const staker = stakers[_staker];
  const decimals = await stakingToken.decimals();

  const amount = ethers.utils.parseUnits(_amount.toString(), decimals);

  stakingToken.faucet(staker.address, amount);
  await stakingToken.connect(staker).approve(nonCompoundingRewardsPoolInfinite.address, amount);
  await nonCompoundingRewardsPoolInfinite.connect(staker).stake(amount);
};

let exit = async (_staker: number) => {
  const staker = stakers[_staker];

  await nonCompoundingRewardsPoolInfinite.connect(staker).exit();
};

let startPool = async (_config?: { epochTime?: number; rewardAmount?: BigNumber }) => {
  const decimals = await rewardToken.decimals();
  const config = { epochTime: 3600 * 24 * 5, rewardAmount: utils.parseUnits('10000', decimals), ..._config };

  await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, config.rewardAmount);
  await nonCompoundingRewardsPoolInfinite['start(uint256)'](config.epochTime);
};

let fundPool = async (_amount: number = 10000) => {
  const decimals = await rewardToken.decimals();
  const amount = ethers.utils.parseUnits(_amount.toString(), decimals);

  await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, amount);
};

let verifyBalances = async (
  expectedBalances: { reward: string; staking?: string }[],
  _config?: { rewardTolerance?: number; albFee?: number }
) => {
  const config = { rewardTolerance: 0.001, albFee: 0.03, ..._config };
  for (let index = 0; index < 4; index++) {
    const rewardDecimals = await rewardToken.decimals();
    const stakingDecimals = await stakingToken.decimals();
    await snapshot();
    const staker = stakers[index];
    const expectedBalance = expectedBalances[index];

    const rewardBalanceBefore = await rewardToken.balanceOf(staker.address);
    const stakingBalanceBefore = await stakingToken.balanceOf(staker.address);
    await exit(index);
    const rewardBalanceAfter = await rewardToken.balanceOf(staker.address);
    const stakingBalanceAfter = await stakingToken.balanceOf(staker.address);

    const expectedRewardBalance = parseFloat(expectedBalance.reward);
    expect(
      parseFloat(ethers.utils.formatUnits(rewardBalanceAfter.sub(rewardBalanceBefore), rewardDecimals))
    ).to.be.closeTo(expectedRewardBalance * (1 - config.albFee), expectedRewardBalance * config.rewardTolerance);

    if (expectedBalance.staking) {
      expect(stakingBalanceAfter.sub(stakingBalanceBefore)).to.be.eq(
        ethers.utils.parseUnits(expectedBalance.staking.toString(), stakingDecimals)
      );
    }

    await revert();
  }
};

const multipleRewardsHelpers = {
  startPool: async (_config?: { epochTime?: number; rewardAmount?: { [key: number]: BigNumber } }) => {
    const config = {
      epochTime: 3600 * 24 * 5,
      rewardAmount: { 0: utils.parseEther('10000'), 1: utils.parseEther('5000'), 2: utils.parseEther('20000') },
      ..._config,
    };

    const rewardEntries = Object.entries(config.rewardAmount);
    for (let i = 0; i < rewardEntries.length; i++) {
      const reward = rewards[rewardEntries[i][0] as any];

      await reward.faucet(nonCompoundingRewardsPoolInfinite.address, rewardEntries[i][1]);
    }

    await nonCompoundingRewardsPoolInfinite['start(uint256)'](config.epochTime);
  },

  fundPool: async (_amounts: { [key: number]: number } = [10000, 10000, 10000]) => {
    const rewardEntries = Object.entries(_amounts);

    for (let i = 0; i < rewardEntries.length; i++) {
      const _amount = _amounts[i];
      const rewardToken = rewards[i];
      const decimals = await rewardToken.decimals();
      const amount = ethers.utils.parseUnits(_amount.toString(), decimals);

      await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, amount);
    }
  },

  verifyBalances: async (
    expectedBalances: { rewards: string[]; staking?: string }[],
    config = { rewardTolerance: 0.001, albFee: 0.03 }
  ) => {
    for (let index = 0; index < expectedBalances.length; index++) {
      const stakingDecimals = await stakingToken.decimals();
      await snapshot();
      const staker = stakers[index];
      const expectedBalance = expectedBalances[index];

      let rewardBalanceBefore: BigNumber[] = [];

      for (let j = 0; j < expectedBalance.rewards.length; j++) {
        const rewardToken = rewards[j];
        const _rewardBalanceBefore = await rewardToken.balanceOf(staker.address);

        rewardBalanceBefore.push(_rewardBalanceBefore);
      }

      const stakingBalanceBefore = await stakingToken.balanceOf(staker.address);
      await exit(index);
      const stakingBalanceAfter = await stakingToken.balanceOf(staker.address);

      for (let j = 0; j < expectedBalance.rewards.length; j++) {
        const rewardToken = rewards[j];
        const rewardDecimals = await rewardToken.decimals();
        const rewardBalanceAfter = await rewardToken.balanceOf(staker.address);

        const expectedRewardBalance = parseFloat(expectedBalances[index].rewards[j]);
        expect(
          parseFloat(ethers.utils.formatUnits(rewardBalanceAfter.sub(rewardBalanceBefore[j]), rewardDecimals))
        ).to.be.closeTo(expectedRewardBalance * (1 - config.albFee), expectedRewardBalance * config.rewardTolerance);
      }

      if (expectedBalance.staking) {
        expect(stakingBalanceAfter.sub(stakingBalanceBefore)).to.be.eq(
          ethers.utils.parseUnits(expectedBalance.staking.toString(), stakingDecimals)
        );
      }

      await revert();
    }
  },
};

describe('RewardsPoolBaseInfinite', () => {
  before(async () => {
    signers = await ethers.getSigners();
    stakers = signers.slice(2, 8);

    const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
    stakingToken = await ERC20Faucet.deploy('test ALBT', 'ALBT', 18);
    for (let index = 1; index <= 3; index++) {
      const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, 18);
      rewards.push(reward);
    }
    fundPool = async (_amount: number = 10000) => {
      const amount = ethers.utils.parseEther(_amount.toString());

      await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, amount);
    };
  });
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
    const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
    nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
      stakingToken.address,
      [rewardToken.address],
      ethers.constants.MaxUint256,
      ethers.constants.MaxUint256,
      'Test pool'
    );
  }

  describe('1 reward token, no limits', async function () {
    beforeEach(async () => await setupRewardsPoolParameters());

    it('Should initialize correctly', async function () {
      await startPool();
      expect(await nonCompoundingRewardsPoolInfinite.epochCount()).to.be.eq(1);
    });

    it('Should be able to stake and withdraw', async function () {
      const staker = stakers[0];

      await startPool();
      await stake(0, 10000);

      await timeTravel(24 * 3600 * 5);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await nonCompoundingRewardsPoolInfinite.userStakedEpoch(staker.address));
      await exit(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(utils.parseEther('10000'));
    });

    it('Should update epochcount properly', async function () {
      await startPool();
      await stake(0, 10000);

      expect(await nonCompoundingRewardsPoolInfinite.epochCount()).to.be.eq(1);
      await stake(0, 10000);

      expect(await nonCompoundingRewardsPoolInfinite.epochCount()).to.be.eq(1);
      await timeTravel(3600 * 24 * 5);
      await stake(0, 10000);
      expect(await nonCompoundingRewardsPoolInfinite.epochCount()).to.be.eq(2);

      await timeTravel(3600 * 24 * 5);
      await stake(0, 10000);
      expect(await nonCompoundingRewardsPoolInfinite.epochCount()).to.be.eq(3);

      await timeTravel(3600 * 24 * 15);
      await exit(0);
      expect(await nonCompoundingRewardsPoolInfinite.epochCount()).to.be.eq(5);
    });

    it('Should be able to stake and withdraw', async function () {
      const staker = stakers[0];

      await startPool();
      await stake(0, 10000);

      await timeTravel(24 * 3600 * 5);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      await exit(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(utils.parseEther('10000'));
    });

    it('Should not be able to stake and withdraw in the same epoch', async function () {
      const staker = stakers[0];

      await startPool();
      await stake(0, 10000);

      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      await expect(nonCompoundingRewardsPoolInfinite.connect(staker).exit()).to.be.revertedWith(
        'exit::you can only exit at the end of the epoch'
      );

      await timeTravel(3600 * 24 * 5);
      await exit(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(utils.parseEther('10000'));
    });

    it('Should not be able to withdraw', async function () {
      await startPool();
      await stake(0, 10000);

      await expect(nonCompoundingRewardsPoolInfinite.withdraw(100)).to.be.revertedWith(
        'OnlyExitFeature::cannot withdraw from this contract. Only exit.'
      );
    });

    it('Should not be able to claim', async function () {
      await startPool();
      await stake(0, 10000);

      await expect(nonCompoundingRewardsPoolInfinite.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );
    });

    it('Should be able to withdraw stake out of dead pool', async function () {
      await startPool();

      const amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      await stake(0, 10000);

      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(nonCompoundingRewardsPoolInfinite.address)).to.be.eq(amount);
      expect(await nonCompoundingRewardsPoolInfinite.balanceOf(staker.address)).to.be.eq(amount);

      timeTravel(3600 * 24 * 5);

      await nonCompoundingRewardsPoolInfinite.connect(staker).exit();

      expect(await stakingToken.balanceOf(nonCompoundingRewardsPoolInfinite.address)).to.be.eq(0);
      expect(await nonCompoundingRewardsPoolInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });

    it('Should calculate rewards correctly', async function () {
      await startPool();
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 62.5
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 62.5 + 1.741623
      // Signer 1: 0.08708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 64.241623 + 1770.0681476
      // Signer 1: 0.08708 + 88.503407
      // Signer 2: 141.42844
      await stake(3, 25000);
      await fundPool(7500);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 1834.3097706 + 2186.195569 + 219.90868282260 = 4240.41402242
      // Signer 1: 88.590487 + 109.30977846 + 10.99543414 = 208.8956996
      // Signer 2: 141.42844 + 174.67702597 + 17.570703 = 333.67616897
      // Signer 3: 5465.48892276 + 549.7717 = 6015.26062276

      await verifyBalances([
        { reward: '4240.41402242', staking: '10000' },
        { reward: '208.8956996', staking: '500' },
        { reward: '333.67616897', staking: '799' },
        { reward: '6015.26062276', staking: '25000' },
      ]);

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 4240.41402242 + 1239.7035731 = 5480.11759552
      // Signer 1: 208.8956996 + 61.98517866 = 270.88087826
      // Signer 2: 333.67616897 + 99.05231549 = 432.72848446
      // Signer 3: 6015.26062276 +3099.25893275 = 9114.51955551
      await verifyBalances([
        { reward: '5480.11759552', staking: '10000' },
        { reward: '270.88087826', staking: '500' },
        { reward: '432.72848446', staking: '799' },
        { reward: '9114.51955551', staking: '25000' },
      ]);

      await stake(2, 399.75);
      await fundPool(17000);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 5480.11759552 + 599.953260593 + 2503.452787 = 8583.52364311
      // Signer 1: 270.88087826 + 29.997663 + 125.1726393 = 426.05118056
      // Signer 2: 432.72848446 + 71.91939711 + 300.1014028 = 804.74928437
      // Signer 3: 9114.51955551 + 1499.88315148 + 6258.6319672 = 16873.03467419

      await verifyBalances([
        { reward: '8583.52364311', staking: '10000' },
        { reward: '426.05118056', staking: '500' },
        { reward: '804.74928437', staking: '1198.75' },
        { reward: '16873.03467419', staking: '25000' },
      ]);
      await exit(3);
      await stake(3, 15000);
      await fundPool(3700);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 8583.52364311 + 2926.219 + 214.0181171 = 11723.76076021
      // Signer 1: 426.05118056 + 146.310992157 + 10.700906 = 583.06307872
      // Signer 2: 804.74928437 + 350.780603696 + 25.65542179 = 1181.18530986
      // Signer 3: 4389.32976471 + 321.02717563764 = 4710.35694035

      await verifyBalances([
        { reward: '11723.76076021', staking: '10000' },
        { reward: '583.06307872', staking: '500' },
        { reward: '1181.18530986', staking: '1198.75' },
        { reward: '4710.35694035', staking: '15000' },
      ]);
    });
  });

  describe('1 reward token, 2 decimals, no limits', async function () {
    before(async () => {
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      rewardToken = await ERC20Faucet.deploy(`Reward `, `TEST`, 2);

      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        [rewardToken.address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );

      functionSlots[0] = fundPool;
      fundPool = async (_amount: number = 10000) => {
        const amount = ethers.utils.parseUnits(_amount.toString(), 2);

        await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, amount);
      };
    });

    after(async () => {
      fundPool = functionSlots[0];
      functionSlots = [];
    });

    it('Should calculate rewards correctly', async function () {
      await startPool({ rewardAmount: BigNumber.from(10000) });
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 0.625
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 0.625 + 0.01741623
      // Signer 1: 0.0008708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 0.64241623 + 17.700681476
      // Signer 1: 0.0008708 + 0.88503407
      // Signer 2: 1.4142844
      await stake(3, 25000);
      await fundPool(75);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 18.343097706 + 21.86195569 + 2.1990868282260 = 42.4041402242
      // Signer 1: 0.88590487 + 1.0930977846 + 0.1099543414 = 2.088956996
      // Signer 2: 1.4142844 + 1.7467702597 + 0.17570703 = 3.3367616897
      // Signer 3: 54.6548892276 + 5.497717 = 60.1526062276
      console.log(await nonCompoundingRewardsPoolInfinite.rewardPerSecond(0));
      await verifyBalances(
        [
          { reward: '42.4041402242', staking: '10000' },
          { reward: '2.088956996', staking: '500' },
          { reward: '3.3367616897', staking: '799' },
          { reward: '60.1526062276', staking: '25000' },
        ],
        { rewardTolerance: 0.005 }
      );

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 42.4041402242 + 12.397035731 = 54.8011759552
      // Signer 1: 2.088956996 + 0.6198517866 = 2.7088087826
      // Signer 2: 3.3367616897 + 0.9905231549 = 4.3272848446
      // Signer 3: 60.1526062276 +30.9925893275 = 91.1451955551
      await verifyBalances(
        [
          { reward: '54.8011759552', staking: '10000' },
          { reward: '2.7088087826', staking: '500' },
          { reward: '4.3272848446', staking: '799' },
          { reward: '91.1451955551', staking: '25000' },
        ],
        { rewardTolerance: 0.005 }
      );

      await stake(2, 399.75);
      await fundPool(170);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 54.8011759552 + 5.99953260593 + 25.03452787 = 85.8352364311
      // Signer 1: 2.7088087826 + 0.29997663 + 1.251726393 = 4.2605118056
      // Signer 2: 4.3272848446 + 0.7191939711 + 3.001014028 = 8.0474928437
      // Signer 3: 91.1451955551 + 14.9988315148 + 62.586319672 = 168.7303467419

      await verifyBalances(
        [
          { reward: '85.8352364311', staking: '10000' },
          { reward: '4.2605118056', staking: '500' },
          { reward: '8.0474928437', staking: '1198.75' },
          { reward: '168.7303467419', staking: '25000' },
        ],
        { rewardTolerance: 0.005 }
      );
      await exit(3);
      await stake(3, 15000);
      await fundPool(37);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 85.8352364311 + 29.26219 + 2.140181171 = 117.2376076021
      // Signer 1: 4.2605118056 + 1.46310992157 + 0.10700906 = 5.8306307872
      // Signer 2: 8.0474928437 + 3.50780603696 + 0.2565542179 = 11.8118530986
      // Signer 3: 43.8932976471 + 3.2102717563764 = 47.1035694035

      await verifyBalances(
        [
          { reward: '117.2376076021', staking: '10000' },
          { reward: '5.8306307872', staking: '500' },
          { reward: '11.8118530986', staking: '1198.75' },
          { reward: '47.1035694035', staking: '15000' },
        ],
        { rewardTolerance: 0.005 }
      );
    });
  });

  describe('1 reward token, 6 decimals, no limits', async function () {
    before(async () => {
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      rewardToken = await ERC20Faucet.deploy(`Reward `, `TEST`, 6);

      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        [rewardToken.address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );

      functionSlots[0] = fundPool;
      fundPool = async (_amount: number = 10000) => {
        const amount = ethers.utils.parseUnits(_amount.toString(), 2);

        await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, amount);
      };
    });

    after(async () => {
      fundPool = functionSlots[0];
      functionSlots = [];
    });

    it.only('Should calculate rewards correctly', async function () {
      await startPool({ rewardAmount: utils.parseUnits('100', 6) });
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 0.625
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 0.625 + 0.01741623
      // Signer 1: 0.0008708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 0.64241623 + 17.700681476
      // Signer 1: 0.0008708 + 0.88503407
      // Signer 2: 1.4142844
      await stake(3, 25000);
      await fundPool(75);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 18.343097706 + 21.86195569 + 2.1990868282260 = 42.4041402242
      // Signer 1: 0.88590487 + 1.0930977846 + 0.1099543414 = 2.088956996
      // Signer 2: 1.4142844 + 1.7467702597 + 0.17570703 = 3.3367616897
      // Signer 3: 54.6548892276 + 5.497717 = 60.1526062276
      console.log(await nonCompoundingRewardsPoolInfinite.rewardPerSecond(0));
      await verifyBalances([
        { reward: '42.4041402242', staking: '10000' },
        { reward: '2.088956996', staking: '500' },
        { reward: '3.3367616897', staking: '799' },
        { reward: '60.1526062276', staking: '25000' },
      ]);

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 42.4041402242 + 12.397035731 = 54.8011759552
      // Signer 1: 2.088956996 + 0.6198517866 = 2.7088087826
      // Signer 2: 3.3367616897 + 0.9905231549 = 4.3272848446
      // Signer 3: 60.1526062276 +30.9925893275 = 91.1451955551
      await verifyBalances(
        [
          { reward: '54.8011759552', staking: '10000' },
          { reward: '2.7088087826', staking: '500' },
          { reward: '4.3272848446', staking: '799' },
          { reward: '91.1451955551', staking: '25000' },
        ],
        // TODO: remove
        { rewardTolerance: 0.1 }
      );

      await stake(2, 399.75);
      await fundPool(170);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 54.8011759552 + 5.99953260593 + 25.03452787 = 85.8352364311
      // Signer 1: 2.7088087826 + 0.29997663 + 1.251726393 = 4.2605118056
      // Signer 2: 4.3272848446 + 0.7191939711 + 3.001014028 = 8.0474928437
      // Signer 3: 91.1451955551 + 14.9988315148 + 62.586319672 = 168.7303467419

      await verifyBalances(
        [
          { reward: '85.8352364311', staking: '10000' },
          { reward: '4.2605118056', staking: '500' },
          { reward: '8.0474928437', staking: '1198.75' },
          { reward: '168.7303467419', staking: '25000' },
        ],
        // TODO: remove
        { rewardTolerance: 0.1 }
      );
      await exit(3);
      await stake(3, 15000);
      await fundPool(37);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 85.8352364311 + 29.26219 + 2.140181171 = 117.2376076021
      // Signer 1: 4.2605118056 + 1.46310992157 + 0.10700906 = 5.8306307872
      // Signer 2: 8.0474928437 + 3.50780603696 + 0.2565542179 = 11.8118530986
      // Signer 3: 43.8932976471 + 3.2102717563764 = 47.1035694035

      await verifyBalances([
        { reward: '117.2376076021', staking: '10000' },
        { reward: '5.8306307872', staking: '500' },
        { reward: '11.8118530986', staking: '1198.75' },
        { reward: '47.1035694035', staking: '15000' },
      ]);
    });
  });

  describe('1 reward token, same as staking token , no limits', async function () {
    before(async () => {
      rewardToken = stakingToken;
      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        [rewardToken.address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    it('Should calculate rewards correctly', async function () {
      await startPool();
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 62.5
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 62.5 + 1.741623
      // Signer 1: 0.08708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 64.241623 + 1770.0681476
      // Signer 1: 0.08708 + 88.503407
      // Signer 2: 141.42844
      await stake(3, 25000);
      await fundPool(7500);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 1834.3097706 + 2186.195569 + 219.90868282260 = 4240.41402242
      // Signer 1: 88.590487 + 109.30977846 + 10.99543414 = 208.8956996
      // Signer 2: 141.42844 + 174.67702597 + 17.570703 = 333.67616897
      // Signer 3: 5465.48892276 + 549.7717 = 6015.26062276

      await verifyBalances(
        [
          { reward: '14113.20160175' },
          { reward: '702.62882861' },
          { reward: '1122.6658839' },
          { reward: '30834.80280408' },
        ],
        { albFee: 0 }
      );

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 4240.41402242 + 1239.7035731 = 5480.11759552
      // Signer 1: 208.8956996 + 61.98517866 = 270.88087826
      // Signer 2: 333.67616897 + 99.05231549 = 432.72848446
      // Signer 3: 6015.26062276 +3099.25893275 = 9114.51955551
      await verifyBalances(
        [
          { reward: '15315.927643047811' },
          { reward: '762.75445191' },
          { reward: '1218.74662993' },
          { reward: '33841.08396884' },
        ],
        { albFee: 0 }
      );

      await stake(2, 399.75);
      await fundPool(17000);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 5480.11759552 + 599.953260593 + 2503.452787 = 8583.52364311
      // Signer 1: 270.88087826 + 29.997663 + 125.1726393 = 426.05118056
      // Signer 2: 432.72848446 + 71.91939711 + 300.1014028 = 804.74928437
      // Signer 3: 9114.51955551 + 1499.88315148 + 6258.6319672 = 16873.03467419

      await verifyBalances(
        [
          { reward: '18326.01793382' },
          { reward: '913.26964514' },
          { reward: '1979.35680584' },
          { reward: '41366.84363396' },
        ],
        { albFee: 0 }
      );
      await exit(3);
      await stake(3, 15000);
      await fundPool(3700);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 8583.52364311 + 2926.219 + 214.0181171 = 11723.76076021
      // Signer 1: 426.05118056 + 146.310992157 + 10.700906 = 583.06307872
      // Signer 2: 804.74928437 + 350.780603696 + 25.65542179 = 1181.18530986
      // Signer 3: 4389.32976471 + 321.02717563764 = 4710.35694035

      await verifyBalances(
        [
          { reward: '21372.0479374' },
          { reward: '1065.57118636' },
          { reward: '2344.49975056' },
          { reward: '19569.04623214' },
        ],
        { albFee: 0 }
      );
    });
  });

  describe('1 reward token with 6 decimals, same as staking token , no limits', async function () {
    let _stakingtoken: ERC20Faucet;
    before(async () => {
      _stakingtoken = stakingToken;
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');

      stakingToken = await ERC20Faucet.deploy('Staking token', 'STAKE', 6);
      rewardToken = stakingToken;
      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        [rewardToken.address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    after(async () => {
      stakingToken = _stakingtoken;
    });

    it.only('Should calculate rewards correctly', async function () {
      await startPool();
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 62.5
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 62.5 + 1.741623
      // Signer 1: 0.08708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 64.241623 + 1770.0681476
      // Signer 1: 0.08708 + 88.503407
      // Signer 2: 141.42844
      await stake(3, 25000);
      await fundPool(7500);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 1834.3097706 + 2186.195569 + 219.90868282260 = 4240.41402242
      // Signer 1: 88.590487 + 109.30977846 + 10.99543414 = 208.8956996
      // Signer 2: 141.42844 + 174.67702597 + 17.570703 = 333.67616897
      // Signer 3: 5465.48892276 + 549.7717 = 6015.26062276

      await verifyBalances(
        [
          { reward: '14113.20160175' },
          { reward: '702.62882861' },
          { reward: '1122.6658839' },
          { reward: '30834.80280408' },
        ],
        { albFee: 0 }
      );

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 4240.41402242 + 1239.7035731 = 5480.11759552
      // Signer 1: 208.8956996 + 61.98517866 = 270.88087826
      // Signer 2: 333.67616897 + 99.05231549 = 432.72848446
      // Signer 3: 6015.26062276 +3099.25893275 = 9114.51955551
      await verifyBalances(
        [
          { reward: '15315.927643047811' },
          { reward: '762.75445191' },
          { reward: '1218.74662993' },
          { reward: '33841.08396884' },
        ],
        { albFee: 0 }
      );

      await stake(2, 399.75);
      await fundPool(17000);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 5480.11759552 + 599.953260593 + 2503.452787 = 8583.52364311
      // Signer 1: 270.88087826 + 29.997663 + 125.1726393 = 426.05118056
      // Signer 2: 432.72848446 + 71.91939711 + 300.1014028 = 804.74928437
      // Signer 3: 9114.51955551 + 1499.88315148 + 6258.6319672 = 16873.03467419

      await verifyBalances(
        [
          { reward: '18326.01793382' },
          { reward: '913.26964514' },
          { reward: '1979.35680584' },
          { reward: '41366.84363396' },
        ],
        { albFee: 0 }
      );
      await exit(3);
      await stake(3, 15000);
      await fundPool(3700);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 8583.52364311 + 2926.219 + 214.0181171 = 11723.76076021
      // Signer 1: 426.05118056 + 146.310992157 + 10.700906 = 583.06307872
      // Signer 2: 804.74928437 + 350.780603696 + 25.65542179 = 1181.18530986
      // Signer 3: 4389.32976471 + 321.02717563764 = 4710.35694035

      await verifyBalances(
        [
          { reward: '21372.0479374' },
          { reward: '1065.57118636' },
          { reward: '2344.49975056' },
          { reward: '19569.04623214' },
        ],
        { albFee: 0 }
      );
    });
  });

  describe('4 reward tokens, 2,6,8 & 18 decimals , no limits', async function () {
    let { fundPool, startPool, verifyBalances } = multipleRewardsHelpers;
    let _rewards: ERC20Faucet[];

    before(async () => {
      _rewards = rewards;
      rewards = [];
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');

      for (const [index, decimals] of [2, 6, 8, 18].entries()) {
        const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, decimals);
        rewards.push(reward);
      }

      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        rewards.map(({ address }) => address),
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    after(async () => {
      rewards = _rewards;
    });

    it.only('Should calculate rewards correctly', async function () {
      await startPool({
        rewardAmount: [
          utils.parseUnits('10000', 2),
          utils.parseUnits('5000', 6),
          utils.parseUnits('20000', 8),
          utils.parseUnits('40000', 18),
        ],
      });
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 62.5
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 62.5 + 1.741623
      // Signer 1: 0.08708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 64.241623 + 1770.0681476
      // Signer 1: 0.08708 + 88.503407
      // Signer 2: 141.42844
      await stake(3, 25000);
      await fundPool([7500, 3750, 15000, 30000]);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 1834.3097706 + 2186.195569 + 219.90868282260 = 4240.41402242
      // Signer 1: 88.590487 + 109.30977846 + 10.99543414 = 208.8956996
      // Signer 2: 141.42844 + 174.67702597 + 17.570703 = 333.67616897
      // Signer 3: 5465.48892276 + 549.7717 = 6015.26062276

      await verifyBalances([
        { rewards: ['4240.41402242', '2120.20701121', '8480.82804484', '16961.65608968'], staking: '10000' },
        { rewards: ['208.8956996', '104.4478498', '417.7913992', '835.5827984'], staking: '500' },
        { rewards: ['333.67616897', '166.838084485', '667.35233794', '1334.70467588'], staking: '799' },
        { rewards: ['6015.26062276', '3007.63031138', '12030.52124552', '24061.04249104'], staking: '25000' },
      ]);

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 4240.41402242 + 1239.7035731 = 5480.11759552
      // Signer 1: 208.8956996 + 61.98517866 = 270.88087826
      // Signer 2: 333.67616897 + 99.05231549 = 432.72848446
      // Signer 3: 6015.26062276 +3099.25893275 = 9114.51955551
      await verifyBalances([
        { rewards: ['5480.11759552', '2740.05879776', '10960.23519104', '21920.47038208'], staking: '10000' },
        { rewards: ['270.88087826', '135.44043913', '541.76175652', '1083.52351304'], staking: '500' },
        { rewards: ['432.72848446', '216.36424223', '865.45696892', '1730.91393784'], staking: '799' },
        { rewards: ['9114.51955551', '4557.259777755', '18229.03911102', '36458.07822204'], staking: '25000' },
      ]);
      await stake(2, 399.75);
      await fundPool([17000, 8500, 34000, 68000]);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 5480.11759552 + 599.953260593 + 2503.452787 = 8583.52364311
      // Signer 1: 270.88087826 + 29.997663 + 125.1726393 = 426.05118056
      // Signer 2: 432.72848446 + 71.91939711 + 300.1014028 = 804.74928437
      // Signer 3: 9114.51955551 + 1499.88315148 + 6258.6319672 = 16873.03467419

      await verifyBalances([
        { rewards: ['8583.52364311', '4291.761821555', '17167.04728622', '34334.09457244'], staking: '10000' },
        { rewards: ['426.05118056', '213.02559028', '852.10236112', '1704.20472224'], staking: '500' },
        { rewards: ['804.74928437', '402.374642185', '1609.49856874', '3218.99713748'], staking: '1198.75' },
        { rewards: ['16873.03467419', '8436.517337095', '33746.06934838', '67492.13869676'], staking: '25000' },
      ]);
      await exit(3);
      await stake(3, 15000);
      await fundPool([3700, 1850, 7400, 14800]);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 8583.52364311 + 2926.219 + 214.0181171 = 11723.76076021
      // Signer 1: 426.05118056 + 146.310992157 + 10.700906 = 583.06307872
      // Signer 2: 804.74928437 + 350.780603696 + 25.65542179 = 1181.18530986
      // Signer 3: 4389.32976471 + 321.02717563764 = 4710.35694035

      await verifyBalances([
        { rewards: ['11723.76076021', '5861.880380105', '23447.52152042', '46895.04304084'], staking: '10000' },
        { rewards: ['583.06307872', '291.53153936', '1166.12615744', '2332.25231488'], staking: '500' },
        { rewards: ['1181.18530986', '590.59265493', '2362.37061972', '4724.74123944'], staking: '1198.75' },
        { rewards: ['4710.35694035', '2355.178470175', '9420.7138807', '18841.4277614'], staking: '15000' },
      ]);
    });
  });

  describe('Staking token with 6 decimals, 4 reward tokens, 2,6,8 & 18 decimals , no limits', async function () {
    let { fundPool, startPool, verifyBalances } = multipleRewardsHelpers;
    let _rewards: ERC20Faucet[] = [];
    let _stakingtoken: ERC20Faucet;

    before(async () => {
      _rewards = rewards;
      rewards = [];
      _stakingtoken = stakingToken;
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      stakingToken = await ERC20Faucet.deploy(`Staking token`, `Stake`, 6);

      for (const [index, decimals] of [2, 6, 8, 18].entries()) {
        const reward = await ERC20Faucet.deploy(`Reward #${index}`, `TEST${index}`, decimals);
        rewards.push(reward);
      }

      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        rewards.map(({ address }) => address),
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    after(async () => {
      rewards = _rewards;
      stakingToken = _stakingtoken;
    });

    it.only('Should calculate rewards correctly', async function () {
      await startPool({
        rewardAmount: [
          utils.parseUnits('10000', 2),
          utils.parseUnits('5000', 6),
          utils.parseUnits('20000', 8),
          utils.parseUnits('40000', 18),
        ],
      });
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 62.5
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 62.5 + 1.741623
      // Signer 1: 0.08708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 64.241623 + 1770.0681476
      // Signer 1: 0.08708 + 88.503407
      // Signer 2: 141.42844
      await stake(3, 25000);
      await fundPool([7500, 3750, 15000, 30000]);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 1834.3097706 + 2186.195569 + 219.90868282260 = 4240.41402242
      // Signer 1: 88.590487 + 109.30977846 + 10.99543414 = 208.8956996
      // Signer 2: 141.42844 + 174.67702597 + 17.570703 = 333.67616897
      // Signer 3: 5465.48892276 + 549.7717 = 6015.26062276

      await verifyBalances([
        { rewards: ['4240.41402242', '2120.20701121', '8480.82804484', '16961.65608968'], staking: '10000' },
        { rewards: ['208.8956996', '104.4478498', '417.7913992', '835.5827984'], staking: '500' },
        { rewards: ['333.67616897', '166.838084485', '667.35233794', '1334.70467588'], staking: '799' },
        { rewards: ['6015.26062276', '3007.63031138', '12030.52124552', '24061.04249104'], staking: '25000' },
      ]);

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 4240.41402242 + 1239.7035731 = 5480.11759552
      // Signer 1: 208.8956996 + 61.98517866 = 270.88087826
      // Signer 2: 333.67616897 + 99.05231549 = 432.72848446
      // Signer 3: 6015.26062276 +3099.25893275 = 9114.51955551
      await verifyBalances([
        { rewards: ['5480.11759552', '2740.05879776', '10960.23519104', '21920.47038208'], staking: '10000' },
        { rewards: ['270.88087826', '135.44043913', '541.76175652', '1083.52351304'], staking: '500' },
        { rewards: ['432.72848446', '216.36424223', '865.45696892', '1730.91393784'], staking: '799' },
        { rewards: ['9114.51955551', '4557.259777755', '18229.03911102', '36458.07822204'], staking: '25000' },
      ]);
      await stake(2, 399.75);
      await fundPool([17000, 8500, 34000, 68000]);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 5480.11759552 + 599.953260593 + 2503.452787 = 8583.52364311
      // Signer 1: 270.88087826 + 29.997663 + 125.1726393 = 426.05118056
      // Signer 2: 432.72848446 + 71.91939711 + 300.1014028 = 804.74928437
      // Signer 3: 9114.51955551 + 1499.88315148 + 6258.6319672 = 16873.03467419

      await verifyBalances([
        { rewards: ['8583.52364311', '4291.761821555', '17167.04728622', '34334.09457244'], staking: '10000' },
        { rewards: ['426.05118056', '213.02559028', '852.10236112', '1704.20472224'], staking: '500' },
        { rewards: ['804.74928437', '402.374642185', '1609.49856874', '3218.99713748'], staking: '1198.75' },
        { rewards: ['16873.03467419', '8436.517337095', '33746.06934838', '67492.13869676'], staking: '25000' },
      ]);
      await exit(3);
      await stake(3, 15000);
      await fundPool([3700, 1850, 7400, 14800]);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 8583.52364311 + 2926.219 + 214.0181171 = 11723.76076021
      // Signer 1: 426.05118056 + 146.310992157 + 10.700906 = 583.06307872
      // Signer 2: 804.74928437 + 350.780603696 + 25.65542179 = 1181.18530986
      // Signer 3: 4389.32976471 + 321.02717563764 = 4710.35694035

      await verifyBalances([
        { rewards: ['11723.76076021', '5861.880380105', '23447.52152042', '46895.04304084'], staking: '10000' },
        { rewards: ['583.06307872', '291.53153936', '1166.12615744', '2332.25231488'], staking: '500' },
        { rewards: ['1181.18530986', '590.59265493', '2362.37061972', '4724.74123944'], staking: '1198.75' },
        { rewards: ['4710.35694035', '2355.178470175', '9420.7138807', '18841.4277614'], staking: '15000' },
      ]);
    });
  });

  describe('3 reward tokend, no limits', async function () {
    const { fundPool, startPool, verifyBalances } = multipleRewardsHelpers;

    before(async () => {
      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        rewards.map(({ address }) => address),
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    it('Should calculate rewards correctly', async function () {
      await startPool();
      await stake(0, 10000);
      await timeTravel(2700);

      // Total staked: 10,000
      // Time passed: 2700
      // Signer 0: 62.5
      await stake(1, 500);
      await timeTravel(79);

      // Total staked: 10,500
      // Time passed: 2779
      // Signer 0: 62.5 + 1.741623
      // Signer 1: 0.08708
      await stake(2, 799);
      await timeTravel(3600 * 24);

      // Total staked: 11,299
      // Time passed: 89,179
      // Signer 0: 64.241623 + 1770.0681476
      // Signer 1: 0.08708 + 88.503407
      // Signer 2: 141.42844
      await stake(3, 25000);
      await fundPool([7500, 3750, 15000]);
      await timeTravel(3600 * 24 * 4.5);

      // Total staked: 36299
      // Time passed: 477979
      // Signer 0: 1834.3097706 + 2186.195569 + 219.90868282260 = 4240.41402242
      // Signer 1: 88.590487 + 109.30977846 + 10.99543414 = 208.8956996
      // Signer 2: 141.42844 + 174.67702597 + 17.570703 = 333.67616897
      // Signer 3: 5465.48892276 + 549.7717 = 6015.26062276

      await verifyBalances([
        { rewards: ['4240.41402242', '2120.20701121', '8480.82804484'], staking: '10000' },
        { rewards: ['208.8956996', '104.4478498', '417.7913992'], staking: '500' },
        { rewards: ['333.67616897', '166.838084485', '667.35233794'], staking: '799' },
        { rewards: ['6015.26062276', '3007.63031138', '12030.52124552'], staking: '25000' },
      ]);

      await timeTravel(3600 * 24 * 3);

      // Total staked: 36299
      // Time passed: 737179
      // Signer 0: 4240.41402242 + 1239.7035731 = 5480.11759552
      // Signer 1: 208.8956996 + 61.98517866 = 270.88087826
      // Signer 2: 333.67616897 + 99.05231549 = 432.72848446
      // Signer 3: 6015.26062276 +3099.25893275 = 9114.51955551
      await verifyBalances([
        { rewards: ['5480.11759552', '2740.05879776', '10960.23519104'], staking: '10000' },
        { rewards: ['270.88087826', '135.44043913', '541.76175652'], staking: '500' },
        { rewards: ['432.72848446', '216.36424223', '865.45696892'], staking: '799' },
        { rewards: ['9114.51955551', '4557.259777755', '18229.03911102'], staking: '25000' },
      ]);
      await stake(2, 399.75);
      await fundPool([17000, 8500, 34000]);
      await timeTravel(3600 * 24 * 4.17);

      // Total staked: 36698.75
      // Time passed: 1097467
      // Signer 0: 5480.11759552 + 599.953260593 + 2503.452787 = 8583.52364311
      // Signer 1: 270.88087826 + 29.997663 + 125.1726393 = 426.05118056
      // Signer 2: 432.72848446 + 71.91939711 + 300.1014028 = 804.74928437
      // Signer 3: 9114.51955551 + 1499.88315148 + 6258.6319672 = 16873.03467419

      await verifyBalances([
        { rewards: ['8583.52364311', '4291.761821555', '17167.04728622'], staking: '10000' },
        { rewards: ['426.05118056', '213.02559028', '852.10236112'], staking: '500' },
        { rewards: ['804.74928437', '402.374642185', '1609.49856874'], staking: '1198.75' },
        { rewards: ['16873.03467419', '8436.517337095', '33746.06934838'], staking: '25000' },
      ]);
      await exit(3);
      await stake(3, 15000);
      await fundPool([3700, 1850, 7400]);
      await timeTravel(3600 * 24 * 3.07);

      // Total staked: 36698.75
      // Time passed: 1362715
      // Signer 0: 8583.52364311 + 2926.219 + 214.0181171 = 11723.76076021
      // Signer 1: 426.05118056 + 146.310992157 + 10.700906 = 583.06307872
      // Signer 2: 804.74928437 + 350.780603696 + 25.65542179 = 1181.18530986
      // Signer 3: 4389.32976471 + 321.02717563764 = 4710.35694035

      await verifyBalances([
        { rewards: ['11723.76076021', '5861.880380105', '23447.52152042'], staking: '10000' },
        { rewards: ['583.06307872', '291.53153936', '1166.12615744'], staking: '500' },
        { rewards: ['1181.18530986', '590.59265493', '2362.37061972'], staking: '1198.75' },
        { rewards: ['4710.35694035', '2355.178470175', '9420.7138807'], staking: '15000' },
      ]);
    });
  });
});
