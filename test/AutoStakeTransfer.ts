import { ethers, waffle } from 'hardhat';
const { deployContract } = waffle;
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import CompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/CompoundingRewardsPool.sol/CompoundingRewardsPool.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import StakeTransfererAutoStakeArtifact from '../artifacts/contracts/mocks/AutoStakeTransfererMock.sol/AutoStakeTransfererMock.json';
import StakeReceiverAutoStakeArtifact from '../artifacts/contracts/mocks/AutoStakeReceiverMock.sol/AutoStakeReceiverMock.json';
import { CompoundingRewardsPool } from '../typechain-types/CompoundingRewardsPool';
import { TestERC20 } from '../typechain-types/TestERC20';
import { StakeTransfererAutoStake } from '../typechain-types/StakeTransfererAutoStake';
import { StakeReceiverAutoStake } from '../typechain-types/StakeReceiverAutoStake';
import { timeTravel } from './utils';

describe('AutoStakeTransfer', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;

  let CompoundingRewardsPoolInstance: CompoundingRewardsPool;
  let StakeTransfererAutoStakeInstance: StakeTransfererAutoStake;
  let StakeReceiverAutoStakeInstance: StakeReceiverAutoStake;
  let stakingTokenInstance: TestERC20;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account] = accounts;
  });

  let startTimestamp: number;
  let endTimestamp: number;

  const oneMinute: number = 60;

  let throttleRoundSeconds: number = 20;

  const amount = ethers.utils.parseEther('5184000');
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens

  beforeEach(async () => {
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestamp = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestamp + oneMinute * 2;

    StakeTransfererAutoStakeInstance = (await deployContract(testAccount, StakeTransfererAutoStakeArtifact, [
      stakingTokenInstance.address,
      throttleRoundSeconds,
      bOne,
      endTimestamp,
    ])) as StakeTransfererAutoStake;

    CompoundingRewardsPoolInstance = (await deployContract(testAccount, CompoundingRewardsPoolArtifact, [
      stakingTokenInstance.address,
      [stakingTokenInstance.address],
      StakeTransfererAutoStakeInstance.address,
      startTimestamp,
      endTimestamp,
    ])) as CompoundingRewardsPool;

    await StakeTransfererAutoStakeInstance.setPool(CompoundingRewardsPoolInstance.address);
    await stakingTokenInstance.mint(CompoundingRewardsPoolInstance.address, amount);

    await CompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp, [bOne]);

    StakeReceiverAutoStakeInstance = (await deployContract(testAccount, StakeReceiverAutoStakeArtifact, [
      stakingTokenInstance.address,
      throttleRoundSeconds,
      bOne,
      endTimestamp + oneMinute,
    ])) as StakeReceiverAutoStake;

    CompoundingRewardsPoolInstance = (await deployContract(testAccount, CompoundingRewardsPoolArtifact, [
      stakingTokenInstance.address,
      [stakingTokenInstance.address],
      StakeReceiverAutoStakeInstance.address,
      startTimestamp,
      endTimestamp,
    ])) as CompoundingRewardsPool;

    await StakeReceiverAutoStakeInstance.setPool(CompoundingRewardsPoolInstance.address);
    await stakingTokenInstance.mint(CompoundingRewardsPoolInstance.address, amount);

    await CompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp + oneMinute, [bOne]);

    await StakeTransfererAutoStakeInstance.setReceiverWhitelisted(StakeReceiverAutoStakeInstance.address, true);

    await stakingTokenInstance.mint(test1Account.address, amount);
    await stakingTokenInstance.mint(test2Account.address, amount);

    await stakingTokenInstance.approve(StakeTransfererAutoStakeInstance.address, standardStakingAmount);
    await stakingTokenInstance
      .connect(test2Account)
      .approve(StakeTransfererAutoStakeInstance.address, standardStakingAmount);

    await timeTravel(70);
    await StakeTransfererAutoStakeInstance.stake(standardStakingAmount);
  });

  it('[Should exit to another contract]:', async () => {
    await timeTravel(140);

    const userBalance = await StakeTransfererAutoStakeInstance.balanceOf(testAccount.address);
    const userShares = await StakeTransfererAutoStakeInstance.share(testAccount.address);

    await StakeTransfererAutoStakeInstance.exitAndTransfer(StakeReceiverAutoStakeInstance.address);

    const userBalanceAfter = await StakeReceiverAutoStakeInstance.balanceOf(testAccount.address);
    const userSharesAfter = await StakeReceiverAutoStakeInstance.share(testAccount.address);
    expect(userBalance).to.lt(userBalanceAfter);
    expect(userShares).to.lt(userSharesAfter);
  });

  it('[Should not exit to non whitelisted contract]:', async () => {
    await expect(StakeTransfererAutoStakeInstance.exitAndTransfer(test2Account.address)).to.be.revertedWith(
      'exitAndTransfer::receiver is not whitelisted'
    );
  });

  it('[Should not set contract whitelisted by not deployer]:', async () => {
    await expect(
      StakeTransfererAutoStakeInstance.connect(test2Account).setReceiverWhitelisted(test2Account.address, true)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });
});
