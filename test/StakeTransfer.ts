import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { StakeTransfererRewardsPoolMock } from '../typechain-types/StakeTransfererRewardsPoolMock';
import { StakeReceiverRewardsPoolMock } from '../typechain-types/StakeReceiverRewardsPoolMock';
import { getTime, timeTravel } from './utils';

describe('StakeTransfer', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;
  let carolAccount: SignerWithAddress;

  let StakeTransfererInstance: StakeTransfererRewardsPoolMock;
  let StakeReceiverInstance: StakeReceiverRewardsPoolMock;
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
    [aliceAccount, bobAccount, carolAccount] = await ethers.getSigners();

    const TestERC20 = await ethers.getContractFactory('TestERC20');
    stakingTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;
    await stakingTokenInstance.mint(aliceAccount.address, amount);
    await stakingTokenInstance.mint(bobAccount.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    await setupRewardsPoolParameters();

    const StakeTransfererRewardsPoolMock = await ethers.getContractFactory('StakeTransfererRewardsPoolMock');
    StakeTransfererInstance = (await StakeTransfererRewardsPoolMock.deploy(
      stakingTokenAddress,
      startTimestamp,
      endTimestamp,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      name
    )) as StakeTransfererRewardsPoolMock;

    const StakeReceiverRewardsPoolMock = await ethers.getContractFactory('StakeReceiverRewardsPoolMock');
    StakeReceiverInstance = (await StakeReceiverRewardsPoolMock.deploy(
      stakingTokenAddress,
      startTimestamp,
      endTimestamp + oneMinute,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      name
    )) as StakeReceiverRewardsPoolMock;

    await StakeTransfererInstance.setReceiverWhitelisted(StakeReceiverInstance.address, true);

    await rewardTokensInstances[0].mint(StakeTransfererInstance.address, amount);
    await rewardTokensInstances[0].mint(StakeReceiverInstance.address, amount);

    await StakeTransfererInstance.start(startTimestamp, endTimestamp, rewardPerSecond);
    await StakeReceiverInstance.start(startTimestamp, endTimestamp + oneMinute, rewardPerSecond);

    await stakingTokenInstance.approve(StakeTransfererInstance.address, standardStakingAmount);
    await stakingTokenInstance.connect(bobAccount).approve(StakeTransfererInstance.address, standardStakingAmount);

    await timeTravel(70);
    await StakeTransfererInstance.stake(standardStakingAmount);
  });

  it('Should exit to another contract', async () => {
    await timeTravel(120);

    const userInfoInitial = await StakeTransfererInstance.userInfo(aliceAccount.address);
    const initialTotalStakedAmount = await StakeTransfererInstance.totalStaked();
    const userInitialBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
    const userRewards = await StakeTransfererInstance.getUserAccumulatedReward(
      aliceAccount.address,
      0,
      await getTime()
    );

    await StakeTransfererInstance.exitAndTransfer(StakeReceiverInstance.address);

    const userFinalBalanceRewards = await rewardTokensInstances[0].balanceOf(aliceAccount.address);
    const userTokensOwed = await StakeTransfererInstance.getUserOwedTokens(aliceAccount.address, 0);
    const userFinalBalanceStaking = await stakingTokenInstance.balanceOf(aliceAccount.address);
    const userInfoFinal = await StakeTransfererInstance.userInfo(aliceAccount.address);
    const finalTotalStkaedAmount = await StakeTransfererInstance.totalStaked();

    expect(userFinalBalanceRewards).to.equal(
      userInitialBalanceRewards.add(userRewards),
      'Rewards claim was not successful'
    );
    expect(userTokensOwed).to.equal(0, 'User tokens owed should be zero');
    expect(userInfoFinal.amountStaked).to.equal(0, 'User staked amount is not updated properly');
    expect(finalTotalStkaedAmount).to.equal(
      initialTotalStakedAmount.sub(standardStakingAmount),
      'Contract total staked amount is not updated properly'
    );

    const userinfoInReceiverContract = await StakeReceiverInstance.userInfo(aliceAccount.address);

    expect(userInfoInitial.amountStaked).to.equal(
      userinfoInReceiverContract.amountStaked,
      'Receiver User staked amount is not updated properly'
    );
  });

  it('Should not exit to non whitelisted contract', async () => {
    await timeTravel(1);

    await expect(StakeTransfererInstance.exitAndTransfer(bobAccount.address)).to.be.revertedWith(
      'exitAndTransfer::receiver is not whitelisted'
    );
  });

  it('Should not set contract whitelisted by not deployer', async () => {
    await timeTravel(1);

    await expect(
      StakeTransfererInstance.connect(bobAccount).setReceiverWhitelisted(bobAccount.address, true)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });
});
