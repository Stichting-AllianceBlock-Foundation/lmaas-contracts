const { expect } = require('chai');
import { ethers, waffle } from 'hardhat';
const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');
const { deployContract } = waffle;

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import TestERC20Artifact from '../../lmaas-contracts/artifacts/contracts/TestERC20.sol/TestERC20.json';
import LMCArtifact from '../../lmaas-contracts/artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import { TestERC20 } from '../typechain/TestERC20';
import { LiquidityMiningCampaign } from '../typechain/LiquidityMiningCampaign';
import { BigNumber } from 'ethers';

describe.only('Liquidity mining campaign payment', () => {
  let payment: any;
  let erc20;
  const userWallet = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const receiverA = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const receiverB = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const usdtAddress = '0xE428DF7523e39976B736A837CE79Ad1d9B14466F';
  const campaignPrices: [BigNumber, BigNumber, BigNumber] = [
    BigNumber.from('3750'),
    BigNumber.from('5250'),
    BigNumber.from('6750'),
  ];
  const extensionPrice = 1850;
  const lowestDiscount = 10;
  const mediumDiscount = 20;
  const highestDiscount = 35;
  const paymentShareA = 1000;

  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;
  let test1Account: SignerWithAddress;
  let test2Account: SignerWithAddress;
  let trasury: SignerWithAddress;

  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let LmcInstance: LiquidityMiningCampaign;
  let rewardTokensInstances: TestERC20[];

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  beforeEach(async () => {
    const UsdtToken = await ethers.getContractFactory('TestERC20');
    const amount = ethers.utils.parseEther('5184000');
    const thirty = ethers.utils.parseEther('30');
    const stakeLimit = amount;
    const contractStakeLimit = ethers.utils.parseEther('35'); // 10 tokens
    rewardTokensInstances = [];

    erc20 = await UsdtToken.deploy(1000000000000);
    await erc20.deployed();

    const Payment = await ethers.getContractFactory('PaymentPortal');

    const args: [string, string, string, [BigNumber, BigNumber, BigNumber], number, number, number, number] = [
      receiverA,
      receiverB,
      erc20.address,
      campaignPrices,
      extensionPrice,
      lowestDiscount,
      mediumDiscount,
      highestDiscount,
    ];

    payment = await Payment.deploy(...args);
    await payment.deployed();

    await erc20.approve(payment.address, 10000000000);

    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    await stakingTokenInstance.mint(testAccount.address, thirty);
    await stakingTokenInstance.mint(test2Account.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    let rewardTokensAddresses = [];
    rewardTokensInstances.push(tknInst);
    rewardTokensAddresses.push(tknInst.address);

    LmcInstance = (await deployContract(testAccount, LMCArtifact, [
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
    ])) as LiquidityMiningCampaign;
  });

  it('Should x', async () => {});
});
