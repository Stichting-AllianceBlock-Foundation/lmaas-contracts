import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from 'ethers';

import { TestERC20 } from '../typechain-types/TestERC20';
import { UniswapV2RouterMock } from '../typechain-types/UniswapV2RouterMock';
import { Treasury } from '../typechain-types/Treasury';
import { NonCompoundingRewardsPool } from '../typechain-types/NonCompoundingRewardsPool';
import { timeTravel } from './utils';

describe('Treasury', () => {
  let aliceAccount: SignerWithAddress;
  let bobAccount: SignerWithAddress;
  let treasury: SignerWithAddress;

  let externalRewardsTokenAddress: string;
  let stakingTokenOneInstance: TestERC20;
  let stakingTokenTwoInstance: TestERC20;
  let externalRewardsTokenInstance: TestERC20;

  let rewardTokensInstances: TestERC20[];
  let rewardTokensAddresses: string[];
  let rewardPerBlock: BigNumber[];

  let startBlock: number;
  let endBlock: number;

  let throttleRoundBlocks = 10;
  let throttleRoundCap = ethers.utils.parseEther('1');

  const rewardTokensCount = 1; // 5 rewards tokens for tests
  const day = 60 * 24 * 60;
  const amount = ethers.utils.parseEther('5184000');
  const stakeLimit = amount;
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmount = ethers.utils.parseEther('5'); // 5 tokens
  const contractStakeLimit = ethers.utils.parseEther('10'); // 10 tokens

  const setupRewardsPoolParameters = async () => {
    rewardTokensInstances = [];
    rewardTokensAddresses = [];
    rewardPerBlock = [];
    for (let i = 0; i < rewardTokensCount; i++) {
      const TestERC20 = await ethers.getContractFactory('TestERC20');
      const tknInst = (await TestERC20.deploy(amount)) as TestERC20;

      // populate tokens
      rewardTokensInstances.push(tknInst);
      rewardTokensAddresses.push(tknInst.address);

      // populate amounts
      let parsedReward = await ethers.utils.parseEther(`${i + 1}`);
      rewardPerBlock.push(parsedReward);
    }

    const currentBlock = await ethers.provider.getBlock('latest');
    startBlock = currentBlock.number + 5;
    endBlock = startBlock + 100;
  };

  const stake = async (
    _throttleRoundBlocks: BigNumberish,
    _throttleRoundCap: BigNumberish,
    stakingTokenContract: TestERC20,
    treasuryContract: Treasury
  ): Promise<NonCompoundingRewardsPool> => {
    await setupRewardsPoolParameters();

    const NonCompoundingRewardsPool = await ethers.getContractFactory('NonCompoundingRewardsPool');
    const instance = (await NonCompoundingRewardsPool.deploy(
      stakingTokenContract.address,
      startBlock,
      endBlock,
      rewardTokensAddresses,
      rewardPerBlock,
      stakeLimit,
      _throttleRoundBlocks,
      _throttleRoundCap,
      treasuryContract.address,
      externalRewardsTokenAddress,
      contractStakeLimit
    )) as NonCompoundingRewardsPool;

    const reward = rewardPerBlock[0].mul(endBlock - startBlock);

    await rewardTokensInstances[0].mint(instance.address, reward);

    await stakingTokenContract.approve(instance.address, standardStakingAmount);
    await stakingTokenContract.connect(bobAccount).approve(instance.address, standardStakingAmount);
    let currentBlock = await ethers.provider.getBlock('latest');
    let blocksDelta = startBlock - currentBlock.number;

    for (let i = 0; i < blocksDelta; i++) {
      await timeTravel(1);
    }
    await instance.stake(standardStakingAmount);

    return instance;
  };

  xdescribe('Interaction Mechanics', async function () {
    let instanceOne: NonCompoundingRewardsPool;
    let instanceTwo: NonCompoundingRewardsPool;
    let treasuryInstance: Treasury;
    let uniswapRouterMock: UniswapV2RouterMock;

    beforeEach(async () => {
      [aliceAccount, bobAccount] = await ethers.getSigners();

      const UniswapV2RouterMock = await ethers.getContractFactory('UniswapV2RouterMock');
      uniswapRouterMock = (await UniswapV2RouterMock.deploy()) as UniswapV2RouterMock;

      const TestERC20 = await ethers.getContractFactory('TestERC20');
      stakingTokenOneInstance = (await TestERC20.deploy(amount)) as TestERC20;

      await stakingTokenOneInstance.mint(aliceAccount.address, amount);
      await stakingTokenOneInstance.mint(bobAccount.address, amount);

      stakingTokenTwoInstance = (await TestERC20.deploy(amount)) as TestERC20;

      await stakingTokenTwoInstance.mint(aliceAccount.address, amount);
      await stakingTokenTwoInstance.mint(bobAccount.address, amount);

      externalRewardsTokenInstance = (await TestERC20.deploy(amount)) as TestERC20;
      await externalRewardsTokenInstance.mint(treasury.address, amount);

      externalRewardsTokenAddress = externalRewardsTokenInstance.address;

      const Treasury = await ethers.getContractFactory('Treasury');
      treasuryInstance = (await Treasury.deploy(uniswapRouterMock.address, externalRewardsTokenAddress)) as Treasury;

      instanceOne = await stake(throttleRoundBlocks, throttleRoundCap, stakingTokenOneInstance, treasuryInstance);
      instanceTwo = await stake(throttleRoundBlocks, throttleRoundCap, stakingTokenTwoInstance, treasuryInstance);
    });

    it('Should withdraw liquidity', async () => {
      const balanceOneBefore = await stakingTokenOneInstance.balanceOf(instanceOne.address);
      const balanceTwoBefore = await stakingTokenTwoInstance.balanceOf(instanceTwo.address);
      await treasuryInstance.withdrawLiquidity([instanceOne.address, instanceTwo.address], [bOne, bOne.mul(2)]);
      const balanceOneAfter = await stakingTokenOneInstance.balanceOf(instanceOne.address);
      const balanceTwoAfter = await stakingTokenTwoInstance.balanceOf(instanceTwo.address);

      const treasuryBalanceOne = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const treasuryBalanceTwo = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);

      expect(balanceOneBefore).to.equal(balanceOneAfter.add(bOne), 'The liquidity was not drawn');
      expect(balanceTwoBefore).to.equal(balanceTwoAfter.add(bOne.mul(2)), 'The liquidity was not drawn');
      expect(treasuryBalanceOne).to.equal(bOne, 'The liquidity was not drawn');
      expect(treasuryBalanceTwo).to.equal(bOne.mul(2), 'The liquidity was not drawn');
    });

    it('Should provide liquidity to Uniswap', async () => {
      await treasuryInstance.withdrawLiquidity([instanceOne.address, instanceTwo.address], [bOne, bOne.mul(2)]);
      const balanceBefore = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const balanceTwoBefore = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);
      await treasuryInstance.addUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        bOne,
        bOne,
        bOne,
        bOne,
        0
      );
      const balanceAfter = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const balanceTwoAfter = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);

      const lpTokenContractAddress = await uniswapRouterMock.lpToken();

      const TestERC20 = await ethers.getContractFactory('TestERC20');
      const lpTokenInstance = (await TestERC20.attach(lpTokenContractAddress)) as TestERC20;

      const lpTokenBalance = await lpTokenInstance.balanceOf(treasuryInstance.address);

      expect(balanceAfter).to.equal(balanceBefore.sub(bOne), 'The liquidity was not provided');
      expect(balanceTwoAfter).to.equal(balanceTwoBefore.sub(bOne), 'The liquidity was not provided');
      expect(lpTokenBalance).to.equal(bOne, 'The liquidity tokens were not provided');
    });

    it('Should remove liquidity from Uniswap', async () => {
      await treasuryInstance.withdrawLiquidity([instanceOne.address, instanceTwo.address], [bOne, bOne.mul(2)]);
      await treasuryInstance.addUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        bOne,
        bOne,
        bOne,
        bOne,
        0
      );

      const lpTokenContractAddress = await uniswapRouterMock.lpToken();

      await treasuryInstance.removeUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        lpTokenContractAddress,
        bOne,
        bOne,
        bOne,
        0
      );

      const balanceAfter = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const balanceTwoAfter = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);

      expect(balanceAfter).to.equal(bOne, 'The liquidity was not returned');
      expect(balanceTwoAfter).to.equal(bOne.mul(2), 'The liquidity was not returned');
    });

    it('Should withdraw some tokens', async () => {
      await treasuryInstance.withdrawLiquidity([instanceOne.address, instanceTwo.address], [bOne, bOne.mul(2)]);
      await treasuryInstance.addUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        bOne,
        bOne,
        bOne,
        bOne,
        0
      );

      const lpTokenContractAddress = await uniswapRouterMock.lpToken();
      await treasuryInstance.removeUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        lpTokenContractAddress,
        bOne,
        bOne,
        bOne,
        0
      );

      const ownerBalanceBefore = await stakingTokenTwoInstance.balanceOf(aliceAccount.address);

      await treasuryInstance.withdrawToken(stakingTokenTwoInstance.address, bOne);

      const balanceAfter = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const balanceTwoAfter = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);
      const ownerBalanceAfter = await stakingTokenTwoInstance.balanceOf(aliceAccount.address);

      expect(balanceAfter).to.equal(bOne, 'The liquidity was drawn but should not have');
      expect(balanceTwoAfter).to.equal(bOne, 'The liquidity was not withdrawn');
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(bOne), 'The owner liquidity did not increase');
    });

    it('Return liquidity without external reward', async () => {
      await treasuryInstance.withdrawLiquidity([instanceOne.address, instanceTwo.address], [bOne, bOne.mul(2)]);
      await treasuryInstance.addUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        bOne,
        bOne,
        bOne,
        bOne,
        0
      );

      const lpTokenContractAddress = await uniswapRouterMock.lpToken();
      await treasuryInstance.removeUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        lpTokenContractAddress,
        bOne,
        bOne,
        bOne,
        0
      );

      const balanceOneBefore = await stakingTokenOneInstance.balanceOf(instanceOne.address);
      const balanceTwoBefore = await stakingTokenTwoInstance.balanceOf(instanceTwo.address);

      await treasuryInstance.returnLiquidity([instanceOne.address, instanceTwo.address], [0, 0]);

      const balanceTreasuryAfter = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const balanceTreasuryTwoAfter = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);

      expect(balanceTreasuryAfter).to.equal(0, 'The liquidity taken from the treasury');
      expect(balanceTreasuryTwoAfter).to.equal(0, 'The liquidity was not taken from the treasury');

      const balanceOneAfter = await stakingTokenOneInstance.balanceOf(instanceOne.address);
      const balanceTwoAfter = await stakingTokenTwoInstance.balanceOf(instanceTwo.address);

      expect(balanceOneAfter).to.equal(
        balanceOneBefore.add(bOne),
        'The liquidity was not returned to the first contract'
      );
      expect(balanceTwoAfter).to.equal(
        balanceTwoBefore.add(bOne.mul(2)),
        'TThe liquidity was not returned to the second contract'
      );
    });

    it('Return liquidity without external reward', async () => {
      await externalRewardsTokenInstance.mint(treasuryInstance.address, bOne.mul(10));
      await treasuryInstance.withdrawLiquidity([instanceOne.address, instanceTwo.address], [bOne, bOne.mul(2)]);
      await treasuryInstance.addUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        bOne,
        bOne,
        bOne,
        bOne,
        0
      );

      const lpTokenContractAddress = await uniswapRouterMock.lpToken();
      await treasuryInstance.removeUniswapLiquidity(
        stakingTokenOneInstance.address,
        stakingTokenTwoInstance.address,
        lpTokenContractAddress,
        bOne,
        bOne,
        bOne,
        0
      );

      const balanceOneBefore = await stakingTokenOneInstance.balanceOf(instanceOne.address);
      const balanceTwoBefore = await stakingTokenTwoInstance.balanceOf(instanceTwo.address);

      await treasuryInstance.returnLiquidity([instanceOne.address, instanceTwo.address], [bOne.mul(3), bOne.mul(4)]);

      const balanceTreasuryAfter = await stakingTokenOneInstance.balanceOf(treasuryInstance.address);
      const balanceTreasuryTwoAfter = await stakingTokenTwoInstance.balanceOf(treasuryInstance.address);

      expect(balanceTreasuryAfter).to.equal(0, 'The liquidity taken from the treasury');
      expect(balanceTreasuryTwoAfter).to.equal(0, 'The liquidity was not taken from the treasury');

      const balanceOneAfter = await stakingTokenOneInstance.balanceOf(instanceOne.address);
      const balanceTwoAfter = await stakingTokenTwoInstance.balanceOf(instanceTwo.address);

      expect(balanceOneAfter).to.equal(
        balanceOneBefore.add(bOne),
        'The liquidity was not returned to the first contract'
      );
      expect(balanceTwoAfter).to.equal(
        balanceTwoBefore.add(bOne.mul(2)),
        'TThe liquidity was not returned to the second contract'
      );

      const externalTokenBalanceOne = await externalRewardsTokenInstance.balanceOf(instanceOne.address);
      const externalTokenBalanceTwo = await externalRewardsTokenInstance.balanceOf(instanceTwo.address);

      expect(externalTokenBalanceOne).to.equal(bOne.mul(3), 'The external reward was not given to the first contract');
      expect(externalTokenBalanceTwo).to.equal(
        bOne.mul(4),
        'TThe external reward was not given to the second contract'
      );
    });
  });
});
