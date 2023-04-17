import { ethers } from 'hardhat';
import { Payment } from '../typechain';

async function main() {
  const paymentContractAddress = process.env.PAYMENT_CONTRACT!;
  const addressToWhitelist = process.env.PAYMENT_CONTRACT_WHITELIST_ADDRESS!;
  const paymentContract = await ethers.getContractAt('Payment', paymentContractAddress!);

  console.log(`${addressToWhitelist} is whitelisted before: ${await paymentContract.whitelist(addressToWhitelist)}`);
  const tx = await paymentContract.addToWhitelist(addressToWhitelist);
  await tx.wait(1);
  console.log(`${addressToWhitelist} is whitelisted after: ${await paymentContract.whitelist(addressToWhitelist)}`);

  // Script for payment redeploy
  //   const accounts = await ethers.getSigners();
  //   console.log(await accounts[0].getBalance());
  //   let paymentContract: Payment;
  //   {
  //     paymentContract = await ethers.getContractAt('Payment', paymentContractAddress!);
  //     const paymentReceiverA = await paymentContract.paymentReceiverA();
  //     const paymentReceiverB = await paymentContract.paymentReceiverB();

  //     const priceCampaign = [];
  //     for (let index = 0; index < 3; index++) {
  //       priceCampaign[index] = await paymentContract.priceCampaign(index);
  //     }
  //     const priceCampaignExtension = await paymentContract.priceCampaignExtension();

  //     const discount = [];
  //     for (let index = 0; index < 3; index++) {
  //       discount[index] = await paymentContract.discounts(index);
  //     }

  //     console.log('payment receiverA', paymentReceiverA);
  //     console.log('payment receiverB', paymentReceiverB);
  //     console.log('Pricecampaign', priceCampaign);
  //     console.log('priceCampaign extension', priceCampaignExtension);
  //     console.log('discount', discount);

  //     const usdtToken = '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73';
  //     const wusdtToken = '0x122CDB7aCfDa67Fb2Ae308a9F8819c962622C324';

  //     //   console.log(`${addressToWhitelist} is whitelisted before: ${await paymentContract.whitelist(addressToWhitelist)}`);
  //     //   const tx = await paymentContract.addToWhitelist(addressToWhitelist);
  //     //   await tx.wait(1);
  //     //   console.log(`${addressToWhitelist} is whitelisted after: ${await paymentContract.whitelist(addressToWhitelist)}`);

  //     const PaymentContract = await ethers.getContractFactory('Payment');
  //     paymentContract = await PaymentContract.deploy(
  //       paymentReceiverA,
  //       paymentReceiverB,
  //       usdtToken,
  //       wusdtToken,
  //       priceCampaign as any,
  //       priceCampaignExtension,
  //       discount as any
  //     );
  //     console.log(`Deploying contract at ${paymentContract.address}`);
  //     await paymentContract.deployTransaction.wait(1);
  //   }

  //   {
  //     const paymentReceiverA = await paymentContract.paymentReceiverA();
  //     const paymentReceiverB = await paymentContract.paymentReceiverB();

  //     const priceCampaign = [];
  //     for (let index = 0; index < 3; index++) {
  //       priceCampaign[index] = await paymentContract.priceCampaign(index);
  //     }
  //     const priceCampaignExtension = await paymentContract.priceCampaignExtension();

  //     const discount = [];
  //     for (let index = 0; index < 3; index++) {
  //       discount[index] = await paymentContract.discounts(index);
  //     }

  //     console.log('payment receiverA', paymentReceiverA);
  //     console.log('payment receiverB', paymentReceiverB);
  //     console.log('Pricecampaign', priceCampaign);
  //     console.log('priceCampaign extension', priceCampaignExtension);
  //     console.log('discount', discount);
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
