const { expect } = require('chai');
import { ethers, waffle } from 'hardhat';
const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');
const { deployContract } = waffle;

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import TestERC20Artifact from '../../lmaas-contracts/artifacts/contracts/TestERC20.sol/TestERC20.json';
import LMCArtifact from '../../lmaas-contracts/artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import LmcPaymentArtifact from '../../lmaas-contracts/artifacts/contracts/payment/LiquidityMiningCampaignPayment.sol/LiquidityMiningCampaignPayment.json';
import PaymentArtifact from '../../lmaas-contracts/artifacts/contracts/payment/Payment.sol/PaymentPortal.json';
import { TestERC20 } from '../typechain/TestERC20';
import { LiquidityMiningCampaign } from '../typechain/LiquidityMiningCampaign';
import { BigNumber } from 'ethers';

describe.only('Liquidity mining campaign payment', () => {
  let PaymentInstance: any;
  let erc20;
  let LmcPaymentInstance: any;

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
  let rewardTokensInstances: TestERC20[];
  let rewardPerSecond: BigNumber[];
  rewardPerSecond = [BigNumber.from('1')];

  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount, test1Account, test2Account, trasury] = accounts;
  });

  beforeEach(async () => {
    const amount = ethers.utils.parseEther('5184000');
    const thirty = ethers.utils.parseEther('30');
    const stakeLimit = amount;
    const contractStakeLimit = ethers.utils.parseEther('35'); // 10 tokens
    rewardTokensInstances = [];

    //deploy erc20
    const UsdtToken = await ethers.getContractFactory('TestERC20');
    erc20 = await UsdtToken.deploy(1000000000000);
    await erc20.deployed();

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

    //Deploy payment contract
    PaymentInstance = await deployContract(testAccount, PaymentArtifact, [...args]);

    //Deploy LMC instance
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    await stakingTokenInstance.mint(testAccount.address, thirty);
    await stakingTokenInstance.mint(test2Account.address, amount);

    stakingTokenAddress = stakingTokenInstance.address;

    const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    let rewardTokensAddresses = [];
    rewardTokensInstances.push(tknInst);
    rewardTokensAddresses.push(tknInst.address);
    console.log(PaymentInstance.address);

    //Deploy liquidity mining payment instance
    LmcPaymentInstance = await deployContract(testAccount, LmcPaymentArtifact, [
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      contractStakeLimit,
      '',
      PaymentInstance.address,
    ]);

    console.log(PaymentInstance.address);
    console.log(LmcPaymentInstance.address);

    // lmcPayment = await LmcPayment.deploy();
    // await lmcPayment.deployed();

    await erc20.approve(PaymentInstance.address, 10000000000);
    await tknInst.mint(LmcPaymentInstance.address, amount);
  });

  it('Should start a campaign and use a credit', async () => {
    const LongCampaignDays = 2555;

    //3 years days
    const starTimestamp = 1855292518;
    const endTimestamp = 1955292518;

    //0 = enum value for short campaign
    await PaymentInstance.pay(testAccount.address, LongCampaignDays);
    expect(await PaymentInstance.getCreditsCampaigns(testAccount.address, 2)).to.equal(1);

    await LmcPaymentInstance.start(starTimestamp, endTimestamp, rewardPerSecond);
    expect(await PaymentInstance.getCreditsCampaigns(testAccount.address, 2)).to.equal(0);

    await LmcPaymentInstance.cancel();
    expect(await PaymentInstance.getCreditsCampaigns(testAccount.address, 2)).to.equal(1);
  });
});
