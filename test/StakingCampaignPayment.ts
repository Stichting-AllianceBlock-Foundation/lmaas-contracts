const { expect } = require('chai');
import { ethers, waffle } from 'hardhat';
const { deployContract } = waffle;

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import TestERC20Artifact from '../../lmaas-contracts/artifacts/contracts/TestERC20.sol/TestERC20.json';
import StakingPaymentArtifact from '../../lmaas-contracts/artifacts/contracts/payment/StakingCampaignPayment.sol/StakingCampaignPayment.json';
import PaymentArtifact from '../../lmaas-contracts/artifacts/contracts/payment/Payment.sol/Payment.json';
import { TestERC20 } from '../typechain/TestERC20';
import { BigNumber } from 'ethers';

describe('Staking campaign payment', () => {
  let PaymentInstance: any;
  let usdt: any;
  let wusdt: any;
  let StakingCampaignInstance: any;

  const receiverA = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const receiverB = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const campaignPrices: [BigNumber, BigNumber, BigNumber] = [
    BigNumber.from('3750'),
    BigNumber.from('5250'),
    BigNumber.from('6750'),
  ];
  const discounts: [BigNumber, BigNumber, BigNumber] = [
    BigNumber.from('10'),
    BigNumber.from('20'),
    BigNumber.from('35'),
  ];
  const extensionPrice = 1850;

  let accounts: SignerWithAddress[];
  let testAccount: SignerWithAddress;

  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;
  let rewardTokensInstances: TestERC20[];
  let rewardPerSecond: BigNumber[];
  rewardPerSecond = [BigNumber.from('1')];

  let StakingCampaignInstanceAddress: string;

  let startTimestamp: any = new Date();
  let endTimestamp: any = new Date();
  startTimestamp.setDate(startTimestamp.getDate() + 1);
  endTimestamp.setDate(startTimestamp.getDate() + 1501);
  startTimestamp = Math.floor(startTimestamp.getTime() / 1000);
  endTimestamp = Math.floor(endTimestamp.getTime() / 1000);

  const LongCampaignDays = 2555;
  before(async () => {
    accounts = await ethers.getSigners();
    [testAccount] = accounts;
  });

  beforeEach(async () => {
    const amount = ethers.utils.parseEther('5184000');
    const thirty = ethers.utils.parseEther('30');
    const stakeLimit = amount;
    const contractStakeLimit = ethers.utils.parseEther('35'); // 10 tokens
    rewardTokensInstances = [];
    const standardStakingAmount = ethers.utils.parseEther('5');
    const _throttleRoundSeconds = 1000;
    const _throttleRoundCap = standardStakingAmount.mul(2);
    //Unix timestamp of 1500 days

    //deploy erc20
    const TERC20 = await ethers.getContractFactory('TestERC20');
    usdt = await TERC20.deploy(1000000000000);
    wusdt = await TERC20.deploy(1000000000000);
    await usdt.deployed();
    await wusdt.deployed();

    const args: [
      string,
      string,
      string,
      string,
      [BigNumber, BigNumber, BigNumber],
      number,
      [BigNumber, BigNumber, BigNumber]
    ] = [receiverA, receiverB, usdt.address, wusdt.address, campaignPrices, extensionPrice, discounts];

    //Deploy payment contract
    PaymentInstance = await deployContract(testAccount, PaymentArtifact, [...args]);
    //Deploy LMC instance
    stakingTokenInstance = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    await stakingTokenInstance.mint(testAccount.address, thirty);

    stakingTokenAddress = stakingTokenInstance.address;

    const tknInst = (await deployContract(testAccount, TestERC20Artifact, [amount])) as TestERC20;
    let rewardTokensAddresses = [];
    rewardTokensInstances.push(tknInst);
    rewardTokensAddresses.push(tknInst.address);

    //Deploy staking payment instance
    StakingCampaignInstance = await deployContract(testAccount, StakingPaymentArtifact, [
      stakingTokenAddress,
      rewardTokensAddresses,
      stakeLimit,
      _throttleRoundSeconds,
      _throttleRoundCap,
      contractStakeLimit,
      '',
      PaymentInstance.address,
    ]);

    StakingCampaignInstanceAddress = StakingCampaignInstance.address;

    await usdt.approve(PaymentInstance.address, 10000000000);
    await wusdt.approve(PaymentInstance.address, 10000000000);
    await tknInst.mint(StakingCampaignInstance.address, amount);
  });

  describe('Create campaign', async () => {
    it('Should start a campaign and use a credit (USDT)', async () => {
      //0 = enum value for short campaign
      await PaymentInstance.pay(testAccount.address, LongCampaignDays, false);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(1);

      await PaymentInstance.useCredit(startTimestamp, endTimestamp, rewardPerSecond, StakingCampaignInstanceAddress);
      // await StakingCampaignInstance.start(starTimestamp, endTimestamp, rewardPerSecond);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(0);
    });

    it('Should cancel a campaign and refund a credit (USDT)', async () => {
      //0 = enum value for short campaign
      await PaymentInstance.pay(testAccount.address, LongCampaignDays, false);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(1);

      await PaymentInstance.useCredit(startTimestamp, endTimestamp, rewardPerSecond, StakingCampaignInstanceAddress);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(0);

      await PaymentInstance.refundCredit(StakingCampaignInstanceAddress);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(1);
    });

    it('Should start a campaign and use a credit (WUSDT)', async () => {
      //0 = enum value for short campaign
      await PaymentInstance.pay(testAccount.address, LongCampaignDays, true);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(1);

      await PaymentInstance.useCredit(startTimestamp, endTimestamp, rewardPerSecond, StakingCampaignInstanceAddress);
      // await StakingCampaignInstance.start(starTimestamp, endTimestamp, rewardPerSecond);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(0);
    });

    it('Should cancel a campaign and refund a credit (WUSDT)', async () => {
      //0 = enum value for short campaign
      await PaymentInstance.pay(testAccount.address, LongCampaignDays, true);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(1);

      await PaymentInstance.useCredit(startTimestamp, endTimestamp, rewardPerSecond, StakingCampaignInstanceAddress);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(0);

      await PaymentInstance.refundCredit(StakingCampaignInstanceAddress);
      expect(await PaymentInstance.creditsCampaigns(testAccount.address, 2)).to.equal(1);
    });
  });
});
