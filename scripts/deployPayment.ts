import { ethers } from 'hardhat';
import { deployContract } from 'ethereum-waffle';

import PaymentArtifact from '../artifacts/contracts/payment/Payment.sol/Payment.json';
import { BigNumber } from 'ethers';

async function main() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  const paymentReceiver = process.env.PAYMENT_RECEIVER;

  const usdtRinkeby = '0x851a410Cc18D8A1eB93Ccb6e37C2B19d8628fAF2';
  const usdtMoonbeam = '0x122CDB7aCfDa67Fb2Ae308a9F8819c962622C324';
  const usdtEth = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const usdtBnb = '0x7CfdF292b18403Ff4C51AB7Aaeca051ef4a8F6cf';
  const usdtEwt = '0x86109279df8270a16f3b41602e92d2453f3f6bac';
  const usdtPoylgon = '0x35E9F3005656C9564D6C98b45eb046FDeA1C0199';
  const usdtAvalanche = '0x315aD5DF2b70A45310df333C8Be7c095de2EA774';
  const usdtSongbird = '0x6eB34761e627285994C6bE0E0d4Ea20F7132A736';
  const wusdtSongbird = '0x5f7fCE989543Da18A33E8F949196DDf44e3e5e8c';

  const campaignPrice = [3500000000, 4000000000, 4500000000];
  const campaignPriceExtension = process.env.CAMPAIGN_PRICE_EXTENSION;
  const discounts = [10, 20, 35];

  const PaymentInstance = (await deployContract(contractOwner, PaymentArtifact, [
    paymentReceiver,
    paymentReceiver,
    '0xa136427a92615114347d04cb636891c5785a46cc',
    '0xa136427a92615114347d04cb636891c5785a46cc',
    campaignPrice,
    campaignPriceExtension,
    discounts,
  ])) as any;

  console.log('LMC deployed at:', PaymentInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
