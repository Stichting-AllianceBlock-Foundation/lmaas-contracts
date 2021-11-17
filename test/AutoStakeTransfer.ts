import { BigNumber } from 'ethers';
import { ethers, waffle, network } from 'hardhat';
const { deployContract } = waffle;
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import OneStakerRewardsPoolArtifact from '../artifacts/contracts/mocks/OneStakerRewardsPoolMock.sol/OneStakerRewardsPoolMock.json';
import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import StakeTransfererAutoStakeArtifact from '../artifacts/contracts/mocks/AutoStakeTransfererMock.sol/AutoStakeTransfererMock.json';
import StakeReceiverAutoStakeArtifact from '../artifacts/contracts/mocks/AutoStakeReceiverMock.sol/AutoStakeReceiverMock.json';
import { OneStakerRewardsPoolMock } from '../typechain-types/OneStakerRewardsPoolMock';
import { TestERC20 } from '../typechain-types/TestERC20';
import { StakeTransfererAutoStake } from '../typechain-types/StakeTransfererAutoStake';
import { StakeReceiverAutoStake } from '../typechain-types/StakeReceiverAutoStake';
import { timeTravel } from './utils';

describe.only('AutoStakeTransfer', () => {
  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;

  let OneStakerRewardsPoolInstance: OneStakerRewardsPoolMock;
  let StakeTransfererAutoStakeInstance: StakeTransfererAutoStake;
  let StakeReceiverAutoStakeInstance: StakeReceiverAutoStake;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account] = accounts;
  });

  let startBlock: number;
  let endBlock: number;
  let startTimestmap: number;
  let endTimestamp: number;

  const virtualBlocksTime: number = 10; // 10s == 10000ms
  const oneMinute: number = 60;

  let throttleRoundBlocks: number = 20;

  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = amount;

  const setupRewardsPoolParameters = async () => {
    const currentBlock = await ethers.provider.getBlock('latest');
    startTimestmap = currentBlock.timestamp + oneMinute;
    endTimestamp = startTimestmap + oneMinute * 2;
    endBlock = Math.trunc(endTimestamp / virtualBlocksTime);
  };

  beforeEach(async () => {
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    StakeTransfererAutoStakeInstance = (await deployContract(testAccount, StakeTransfererAutoStakeArtifact, [
      stakingTokenAddress,
      throttleRoundBlocks,
      bOne,
      endTimestamp,
      virtualBlocksTime,
    ])) as StakeTransfererAutoStake;

    OneStakerRewardsPoolInstance = (await deployContract(testAccount, OneStakerRewardsPoolArtifact, [
      stakingTokenAddress,
      startTimestmap,
      endTimestamp,
      [stakingTokenAddress],
      [bOne],
      ethers.constants.MaxUint256,
      StakeTransfererAutoStakeInstance.address,
      contractStakeLimit,
      virtualBlocksTime,
    ])) as OneStakerRewardsPoolMock;

    await StakeTransfererAutoStakeInstance.setPool(OneStakerRewardsPoolInstance.address);
    await stakingTokenInstance.mint(OneStakerRewardsPoolInstance.address, amount);

    StakeReceiverAutoStakeInstance = (await deployContract(testAccount, StakeReceiverAutoStakeArtifact, [
      stakingTokenAddress,
      throttleRoundBlocks,
      bOne,
      endTimestamp + oneMinute,
      virtualBlocksTime,
    ])) as StakeReceiverAutoStake;

    OneStakerRewardsPoolInstance = (await deployContract(testAccount, OneStakerRewardsPoolArtifact, [
      stakingTokenAddress,
      startTimestmap,
      endTimestamp + oneMinute,
      [stakingTokenAddress],
      [bOne],
      ethers.constants.MaxUint256,
      StakeReceiverAutoStakeInstance.address,
      contractStakeLimit,
      virtualBlocksTime,
    ])) as OneStakerRewardsPoolMock;

    await StakeReceiverAutoStakeInstance.setPool(OneStakerRewardsPoolInstance.address);
    await stakingTokenInstance.mint(OneStakerRewardsPoolInstance.address, amount);

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
    await timeTravel(130);

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
    ).to.be.revertedWith('Caller is not the Factory contract');
  });
});
