import { BigNumber } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
const { deployContract } = waffle;
import CompoundingRewardsPoolStakerArtifact from '../artifacts/contracts/V2/CompoundingRewardsPoolStaker.sol/CompoundingRewardsPoolStaker.json';
import CompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/CompoundingRewardsPool.sol/CompoundingRewardsPool.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { CompoundingRewardsPoolStaker } from '../typechain-types/CompoundingRewardsPoolStaker';
import { CompoundingRewardsPool } from '../typechain-types/CompoundingRewardsPool';
import { TestERC20 } from '../typechain-types/TestERC20';
import { timeTravel } from './utils';

describe('CompoundingRewardsPoolStaker', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let treasury: SignerWithAddress;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, treasury] = accounts;
  });

  let CompoundingRewardsPoolInstance: CompoundingRewardsPool;
  let StakeTransfererAutoStakeInstance: CompoundingRewardsPoolStaker;
  let StakeReceiverAutoStakeInstance: CompoundingRewardsPoolStaker;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let externalRewardsTokenInstance: TestERC20;
  let externalRewardsTokenAddress: string;

  let endBlock;
  let startTimestmap: number;
  let endTimestamp: number;

  const virtualBlocksTime: number = 10; // 10s == 10000ms
  const oneMinute: number = 60;

  let throttleRoundBlocks: number = 20;

  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = ethers.utils.parseEther('15'); // 10 tokens

  const setupRewardsPoolParameters = async () => {
    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestmap = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestmap + oneMinute * 2;
    endBlock = Math.trunc(endTimestamp / virtualBlocksTime);
  };

  beforeEach(async () => {
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

    stakingTokenAddress = stakingTokenInstance.address;

    externalRewardsTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [
      ethers.utils.parseEther('300000'),
    ])) as TestERC20;
    externalRewardsTokenAddress = externalRewardsTokenInstance.address;

    await setupRewardsPoolParameters();

    StakeTransfererAutoStakeInstance = (await deployContract(testAccount, CompoundingRewardsPoolStakerArtifact, [
      stakingTokenAddress,
      throttleRoundBlocks,
      bOne,
      endTimestamp,
      standardStakingAmount.mul(2),
      virtualBlocksTime,
    ])) as CompoundingRewardsPoolStaker;

    CompoundingRewardsPoolInstance = (await deployContract(testAccount, CompoundingRewardsPoolArtifact, [
      stakingTokenAddress,
      [stakingTokenAddress],
      StakeTransfererAutoStakeInstance.address,
      startTimestmap,
      endTimestamp,
      [bOne],
      virtualBlocksTime,
    ])) as CompoundingRewardsPool;

    await StakeTransfererAutoStakeInstance.setPool(CompoundingRewardsPoolInstance.address);
    await stakingTokenInstance.mint(CompoundingRewardsPoolInstance.address, amount);

    StakeReceiverAutoStakeInstance = (await deployContract(testAccount, CompoundingRewardsPoolStakerArtifact, [
      stakingTokenAddress,
      throttleRoundBlocks,
      bOne,
      endTimestamp + oneMinute,
      standardStakingAmount,
      virtualBlocksTime,
    ])) as CompoundingRewardsPoolStaker;

    CompoundingRewardsPoolInstance = (await deployContract(testAccount, CompoundingRewardsPoolArtifact, [
      stakingTokenAddress,
      [stakingTokenAddress],
      StakeReceiverAutoStakeInstance.address,
      startTimestmap,
      endTimestamp + oneMinute,
      [bOne],
      virtualBlocksTime,
    ])) as CompoundingRewardsPool;

    await StakeReceiverAutoStakeInstance.setPool(CompoundingRewardsPoolInstance.address);
    await stakingTokenInstance.mint(CompoundingRewardsPoolInstance.address, amount);

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

  it('[Should exit correctly]:', async () => {
    await StakeTransfererAutoStakeInstance.connect(test2Account).stake(standardStakingAmount.div(10));
    await timeTravel(130);

    const userBalance = await StakeTransfererAutoStakeInstance.balanceOf(test2Account.address);
    const userShares = await StakeTransfererAutoStakeInstance.share(test2Account.address);

    await StakeTransfererAutoStakeInstance.connect(test2Account).exitAndTransfer(
      StakeReceiverAutoStakeInstance.address
    );

    const userBalanceAfter = await StakeReceiverAutoStakeInstance.balanceOf(test2Account.address);
    const userSharesAfter = await StakeReceiverAutoStakeInstance.share(test2Account.address);

    expect(userBalance).to.lt(userBalanceAfter);
    expect(userShares).to.lt(userSharesAfter);
  });

  it('[Should not exit to non whitelisted contract]:', async () => {
    await stakingTokenInstance.approve(StakeTransfererAutoStakeInstance.address, standardStakingAmount);
    await StakeTransfererAutoStakeInstance.stake(standardStakingAmount);
    await timeTravel(130);

    await expect(StakeTransfererAutoStakeInstance.exitAndTransfer(test2Account.address)).to.be.revertedWith(
      'exitAndTransfer::receiver is not whitelisted'
    );
  });

  it('[Should not exit to above limit]:', async () => {
    await StakeTransfererAutoStakeInstance.setReceiverWhitelisted(StakeReceiverAutoStakeInstance.address, true);

    await stakingTokenInstance.approve(StakeTransfererAutoStakeInstance.address, standardStakingAmount);
    await StakeTransfererAutoStakeInstance.stake(standardStakingAmount);
    await timeTravel(130);

    await expect(
      StakeTransfererAutoStakeInstance.exitAndTransfer(StakeReceiverAutoStakeInstance.address)
    ).to.be.revertedWith('onlyUnderStakeLimit::Stake limit reached');
  });
});
