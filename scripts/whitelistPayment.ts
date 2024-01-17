import { ethers } from 'hardhat';
import { deployContract } from 'ethereum-waffle';

import PaymentArtifact from '../artifacts/contracts/payment/Payment.sol/Payment.json';
import { BigNumber } from 'ethers';

const paymentAddress = process.env.PAYMENT_CONTRACT!;
const whitelistAddress = process.env.PAYMENT_CONTRACT_WHITELIST_ADDRESS!;

async function main() {
  const accounts = await ethers.getSigners();

  const paymentContract = await ethers.getContractAt('Payment', paymentAddress);

  console.log(
    'Adding to whitelist:',
    whitelistAddress,
    'Whitelisted',
    await paymentContract.whitelist(whitelistAddress)
  );
  await (await paymentContract.addToWhitelist(whitelistAddress)).wait();

  console.log('Whitelisted', await paymentContract.whitelist(whitelistAddress));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
