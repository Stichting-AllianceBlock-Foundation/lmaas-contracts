import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { ERC20Faucet, NonCompoundingRewardsPoolInfinite } from '../typechain';
import { timeTravel } from './utils';

let snapshotId: string;
let signers: SignerWithAddress[];
let stakers: SignerWithAddress[];
let stakingToken: ERC20Faucet;
let rewards: ERC20Faucet[] = [];
let nonCompoundingRewardsPoolInfinite: NonCompoundingRewardsPoolInfinite;
let rewardToken: ERC20Faucet;

describe('RewardsPoolBaseInfinite', () => {
  before(async () => {
    signers = await ethers.getSigners();
    stakers = signers.slice(5);

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
      const NonCompoundingRewardsPoolInfinite = await ethers.getContractFactory('NonCompoundingRewardsPoolInfinite');
      nonCompoundingRewardsPoolInfinite = await NonCompoundingRewardsPoolInfinite.deploy(
        stakingToken.address,
        [rewardToken.address],
        ethers.constants.MaxUint256,
        ethers.constants.MaxUint256,
        'Test pool'
      );
    });

    it('Should be able to withdraw stake out of dead pool', async function () {
      let amount = ethers.utils.parseEther('10');
      await rewardToken.faucet(nonCompoundingRewardsPoolInfinite.address, amount);

      await nonCompoundingRewardsPoolInfinite['start(uint256)'](3600 * 24 * 5);
      amount = ethers.utils.parseEther('10000');
      const staker = stakers[0];

      stakingToken.faucet(staker.address, amount);
      await stakingToken.connect(staker).approve(nonCompoundingRewardsPoolInfinite.address, amount);

      await nonCompoundingRewardsPoolInfinite.connect(staker).stake(amount);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(nonCompoundingRewardsPoolInfinite.address)).to.be.eq(amount);
      expect(await nonCompoundingRewardsPoolInfinite.balanceOf(staker.address)).to.be.eq(amount);

      timeTravel(3600 * 24 * 5);

      await nonCompoundingRewardsPoolInfinite.connect(staker).exit();

      expect(await stakingToken.balanceOf(nonCompoundingRewardsPoolInfinite.address)).to.be.eq(0);
      expect(await nonCompoundingRewardsPoolInfinite.balanceOf(staker.address)).to.be.eq(0);
      expect(await stakingToken.balanceOf(staker.address)).to.be.eq(amount);
    });
  });
});
