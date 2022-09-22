import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Payment', () => {
  let payment: any;
  let deployer: SignerWithAddress;
  let usdt: any;
  let wusdt: any;

  const userWallet = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
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

  beforeEach(async () => {
    const TERC20 = await ethers.getContractFactory('TestERC20');
    [deployer] = await ethers.getSigners();
    usdt = await TERC20.deploy(1000000000000);
    wusdt = await TERC20.deploy(1000000000000);

    await usdt.deployed();
    await wusdt.deployed();

    await usdt.setDecimals(6);
    await wusdt.setDecimals(6);

    const Payment = await ethers.getContractFactory('Payment');

    const args: [
      string,
      string,
      string,
      string,
      [BigNumber, BigNumber, BigNumber],
      number,
      [BigNumber, BigNumber, BigNumber]
    ] = [receiverA, receiverB, usdt.address, wusdt.address, campaignPrices, extensionPrice, discounts];

    payment = await Payment.deploy(...args);

    await payment.deployed();

    await usdt.approve(payment.address, 10000000000);
    await wusdt.approve(payment.address, 10000000000);
  });

  it('Should change value of payment receivers', async () => {
    const address = '0x6606A67b2d0a1f2a01D27f41671D72bAb47a45D8';
    expect(await payment.paymentReceiverA()).to.equal(receiverA);
    expect(await payment.paymentReceiverB()).to.equal(receiverB);

    await payment.setPaymentReceivers(address, address);

    expect(await payment.paymentReceiverA()).to.equal(address);
    expect(await payment.paymentReceiverB()).to.equal(address);
  });

  it('Should change value of price campaign extension', async () => {
    const newPrice = 2500;

    expect(await payment.priceCampaignExtension()).to.equal(extensionPrice);
    await payment.setPriceCampaignExtension(newPrice);
    expect(await payment.priceCampaignExtension()).to.equal(newPrice);
  });

  it('Should change discount values', async () => {
    const newDiscounts: [BigNumber, BigNumber, BigNumber] = [
      BigNumber.from('25'),
      BigNumber.from('35'),
      BigNumber.from('50'),
    ];

    expect(await payment.discounts(0)).to.equal(discounts[0]);
    await payment.setDiscounts(newDiscounts);
    expect(await payment.discounts(0)).to.equal(newDiscounts[0]);
  });

  it('Should add and remove an address to the whitelist', async () => {
    expect(await payment.whitelist(userWallet)).to.equal(false);
    await payment.addToWhitelist(userWallet);
    expect(await payment.whitelist(userWallet)).to.equal(true);
    await payment.removeFromWhitelist(userWallet);
    expect(await payment.whitelist(userWallet)).to.equal(false);
  });

  it('Should add a credit to a short campaign campaign based on duration (WUSDT)', async () => {
    const shortCampaignDays = 20;

    //0 = enum value for short campaign
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.pay(userWallet, shortCampaignDays, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 0)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it('Should add a credit to a medium campaign campaign based on duration (WUSDT)', async () => {
    const mediumCampaignDays = 38;

    //1 = enum value for medium campaign
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.pay(userWallet, mediumCampaignDays, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 1)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it('Should add a credit to a long campaign campaign based on duration (WUSDT)', async () => {
    const LongCampaignDays = 2555;

    //2 = enum value for long campaign
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.pay(userWallet, LongCampaignDays, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 2)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it.skip('Should use credit after pool has been deployed ( Short campaign ) (WUSDT)', async () => {
    const shortCampaignDays = 20;

    //4 days
    const starTimestamp = 1655201984;
    const endTimestamp = 1655505927;

    //0 = enum value for short campaign
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.pay(userWallet, shortCampaignDays, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 0)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.creditsCampaigns(userWallet, 0)).to.equal(0);
  });

  it.skip('Should use credit after pool has been deployed ( Medium campaign ) (WUSDT)', async () => {
    const mediumCampaignDays = 38;

    //38 days
    const starTimestamp = 1655201984;
    const endTimestamp = 1658505927;

    //0 = enum value for short campaign
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.pay(userWallet, mediumCampaignDays, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 1)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.creditsCampaigns(userWallet, 1)).to.equal(0);
  });

  it.skip('Should use credit after pool has been deployed ( Long campaign ) (WUSDT)', async () => {
    const LongCampaignDays = 2555;

    //3 years days
    const starTimestamp = 1655201984;
    const endTimestamp = 1758505927;

    //0 = enum value for short campaign
    await payment.pay(userWallet, LongCampaignDays, true);
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 2)).to.equal(1);
    const afterBalance = await wusdt.balanceOf(deployer.address);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.creditsCampaigns(userWallet, 2)).to.equal(0);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it('Should add a credit to campaign extension (WUSDT)', async () => {
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.payExtension(userWallet, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    //0 is enum key for a short campaign
    expect(await payment.creditsCampaignExtension(userWallet)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it.skip('Should use a credit from campaign extension (WUSDT)', async () => {
    const beforeBalance = await wusdt.balanceOf(deployer.address);
    await payment.payExtension(userWallet, true);
    const afterBalance = await wusdt.balanceOf(deployer.address);
    //0 is enum key for a short campaign
    expect(await payment.creditsCampaignExtension(userWallet)).to.equal(1);

    await payment.useCreditExtension(userWallet);
    expect(await payment.creditsCampaignExtension(userWallet)).to.equal(0);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it('Should add a credit to a short campaign campaign based on duration (USDT)', async () => {
    const shortCampaignDays = 20;

    //0 = enum value for short campaign
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.pay(userWallet, shortCampaignDays, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 0)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it('Should add a credit to a medium campaign campaign based on duration (USDT)', async () => {
    const mediumCampaignDays = 38;

    //1 = enum value for medium campaign
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.pay(userWallet, mediumCampaignDays, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 1)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it('Should add a credit to a long campaign campaign based on duration (USDT)', async () => {
    const LongCampaignDays = 2555;

    //2 = enum value for long campaign
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.pay(userWallet, LongCampaignDays, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 2)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it.skip('Should use credit after pool has been deployed ( Short campaign ) (USDT)', async () => {
    const shortCampaignDays = 20;

    //4 days
    const starTimestamp = 1655201984;
    const endTimestamp = 1655505927;

    //0 = enum value for short campaign
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.pay(userWallet, shortCampaignDays, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 0)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.creditsCampaigns(userWallet, 0)).to.equal(0);
  });

  it.skip('Should use credit after pool has been deployed ( Medium campaign ) (USDT)', async () => {
    const mediumCampaignDays = 38;

    //38 days
    const starTimestamp = 1655201984;
    const endTimestamp = 1658505927;

    //0 = enum value for short campaign
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.pay(userWallet, mediumCampaignDays, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    expect(await payment.creditsCampaigns(userWallet, 1)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.creditsCampaigns(userWallet, 1)).to.equal(0);
  });

  it.skip('Should use credit after pool has been deployed ( Long campaign ) (USDT)', async () => {
    const LongCampaignDays = 2555;

    //3 years days
    const starTimestamp = 1655201984;
    const endTimestamp = 1758505927;

    //0 = enum value for short campaign
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.pay(userWallet, LongCampaignDays, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    expect(afterBalance).to.lt(beforeBalance);
    expect(await payment.creditsCampaigns(userWallet, 2)).to.equal(1);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.creditsCampaigns(userWallet, 2)).to.equal(0);
  });

  it('Should add a credit to campaign extension (USDT)', async () => {
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.payExtension(userWallet, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    //0 is enum key for a short campaign
    expect(await payment.creditsCampaignExtension(userWallet)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);
  });

  it.skip('Should use a credit from campaign extension (USDT)', async () => {
    const beforeBalance = await usdt.balanceOf(deployer.address);
    await payment.payExtension(userWallet, false);
    const afterBalance = await usdt.balanceOf(deployer.address);
    //0 is enum key for a short campaign
    expect(await payment.creditsCampaignExtension(userWallet)).to.equal(1);
    expect(afterBalance).to.lt(beforeBalance);

    await payment.useCreditExtension(userWallet);
    expect(await payment.creditsCampaignExtension(userWallet)).to.equal(0);
  });

  it.skip('Should throw an error when no credits are available for a campaign', async () => {
    const starTimestamp = 1655201984;
    const endTimestamp = 1758505927;

    await expect(payment.useCredit(userWallet, starTimestamp, endTimestamp)).to.be.revertedWith('No credits available');
  });

  it.skip('Should throw an error when no credits are available for campaign extension', async () => {
    await expect(payment.useCreditExtension(userWallet)).to.be.revertedWith('No credits available');
  });
});
