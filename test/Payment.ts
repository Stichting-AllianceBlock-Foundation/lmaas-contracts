const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Payment', () => {
  let payment: any;
  let erc20;

  const userWallet = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const receiverA = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const receiverB = '0x1750659358e53EddecEd0E818E2c65F9fD9A44e5';
  const campaignPrices = ['3750', '5250', '6750'];
  const extensionPrice = 1850;
  const lowestDiscount = 10;
  const mediumDiscount = 20;
  const highestDiscount = 35;

  beforeEach(async () => {
    const UsdtToken = await ethers.getContractFactory('TestERC20');
    erc20 = await UsdtToken.deploy(1000000000000);
    await erc20.deployed();
    await erc20.setDecimals(6);

    const Payment = await ethers.getContractFactory('PaymentPortal');

    const args = [
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
  });

  //#TO DO: Bignumber array
  // it("Should return price campaign", async () => {
  //   expect(await payment.getPriceCampaign()).to.equal(campaignPrices);
  // });

  //#TO DO: How to test mappings?
  // it("Should return credits of wallet x", async () => {
  //   expect(await payment.getCreditsCampaigns()).to.equal(0);
  // });

  // it("Should return extension credits of wallet x", async () => {
  //   expect(await payment.getCreditsCampaignExtension()).to.equal(0);
  // });

  // it("Should return campaigns deployed of wallet x", async () => {
  //   expect(await payment.getCampaignsDeployed()).to.equal(0);
  // });

  it('Should change value of payment receivers', async () => {
    const address = '0x6606A67b2d0a1f2a01D27f41671D72bAb47a45D8';
    expect(await payment.getPaymentReceiverA()).to.equal(receiverA);
    expect(await payment.getPaymentReceiverB()).to.equal(receiverB);

    await payment.setPaymentReceivers(address, address);

    expect(await payment.getPaymentReceiverA()).to.equal(address);
    expect(await payment.getPaymentReceiverB()).to.equal(address);
  });

  it('Should change value of price campaign extension', async () => {
    const newPrice = 2500;

    expect(await payment.getPriceCampaignExtension()).to.equal(extensionPrice);
    await payment.setPriceCampaignExtension(newPrice);
    expect(await payment.getPriceCampaignExtension()).to.equal(newPrice);
  });

  it('Should change lowest discount value', async () => {
    const newLowestDiscount = 25;

    expect(await payment.getLowestDiscount()).to.equal(lowestDiscount);
    await payment.setLowestDiscount(newLowestDiscount);
    expect(await payment.getLowestDiscount()).to.equal(newLowestDiscount);
  });

  it('Should change medium discount value', async () => {
    const newMediumDiscount = 50;

    expect(await payment.getMediumDiscount()).to.equal(mediumDiscount);
    await payment.setMediumDiscount(newMediumDiscount);
    expect(await payment.getMediumDiscount()).to.equal(newMediumDiscount);
  });

  it('Should change highest discount value', async () => {
    const newHighestDiscount = 75;

    expect(await payment.getHighestDiscount()).to.equal(highestDiscount);
    await payment.setHighestDiscount(newHighestDiscount);
    expect(await payment.getHighestDiscount()).to.equal(newHighestDiscount);
  });

  it('Should add and remove an address to the whitelist', async () => {
    expect(await payment.isWhitelisted(userWallet)).to.equal(false);
    await payment.addToWhitelist(userWallet);
    expect(await payment.isWhitelisted(userWallet)).to.equal(true);
    await payment.removeFromWhitelist(userWallet);
    expect(await payment.isWhitelisted(userWallet)).to.equal(false);
  });

  it('Should add a credit to a short campaign campaign based on duration', async () => {
    const shortCampaignDays = 20;

    //0 = enum value for short campaign
    await payment.pay(userWallet, shortCampaignDays);
    expect(await payment.getCreditsCampaigns(userWallet, 0)).to.equal(1);
  });

  it('Should add a credit to a medium campaign campaign based on duration', async () => {
    const mediumCampaignDays = 38;

    //1 = enum value for medium campaign
    await payment.pay(userWallet, mediumCampaignDays);
    expect(await payment.getCreditsCampaigns(userWallet, 1)).to.equal(1);
  });

  it('Should add a credit to a long campaign campaign based on duration', async () => {
    const LongCampaignDays = 2555;

    //2 = enum value for long campaign
    await payment.pay(userWallet, LongCampaignDays);
    expect(await payment.getCreditsCampaigns(userWallet, 2)).to.equal(1);
  });

  it('Should use credit after pool has been deployed ( Short campaign )', async () => {
    const shortCampaignDays = 20;

    //4 days
    const starTimestamp = 1655201984;
    const endTimestamp = 1655505927;

    //0 = enum value for short campaign
    await payment.pay(userWallet, shortCampaignDays);
    expect(await payment.getCreditsCampaigns(userWallet, 0)).to.equal(1);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.getCreditsCampaigns(userWallet, 0)).to.equal(0);
  });

  it('Should use credit after pool has been deployed ( Medium campaign )', async () => {
    const mediumCampaignDays = 38;

    //38 days
    const starTimestamp = 1655201984;
    const endTimestamp = 1658505927;

    //0 = enum value for short campaign
    await payment.pay(userWallet, mediumCampaignDays);
    expect(await payment.getCreditsCampaigns(userWallet, 1)).to.equal(1);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.getCreditsCampaigns(userWallet, 1)).to.equal(0);
  });

  it('Should use credit after pool has been deployed ( Long campaign )', async () => {
    const LongCampaignDays = 2555;

    //3 years days
    const starTimestamp = 1655201984;
    const endTimestamp = 1758505927;

    //0 = enum value for short campaign
    await payment.pay(userWallet, LongCampaignDays);
    expect(await payment.getCreditsCampaigns(userWallet, 2)).to.equal(1);

    await payment.useCredit(userWallet, starTimestamp, endTimestamp);
    expect(await payment.getCreditsCampaigns(userWallet, 2)).to.equal(0);
  });

  it('Should add a credit to campaign extension', async () => {
    await payment.payExtension(userWallet);
    //0 is enum key for a short campaign
    expect(await payment.getCreditsCampaignExtension(userWallet)).to.equal(1);
  });

  it('Should use a credit from campaign extension', async () => {
    await payment.payExtension(userWallet);
    //0 is enum key for a short campaign
    expect(await payment.getCreditsCampaignExtension(userWallet)).to.equal(1);

    await payment.useCreditExtension(userWallet);
    expect(await payment.getCreditsCampaignExtension(userWallet)).to.equal(0);
  });

  it('Should throw an error when no credits are available for a campaign', async () => {
    const starTimestamp = 1655201984;
    const endTimestamp = 1758505927;

    await expect(payment.useCredit(userWallet, starTimestamp, endTimestamp)).to.be.revertedWith('No credits available');
  });

  it('Should throw an error when no credits are available for campaign extension', async () => {
    await expect(payment.useCreditExtension(userWallet)).to.be.revertedWith('No credits available');
  });
});
