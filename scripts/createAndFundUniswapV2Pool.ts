import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import UniswapV2FactoryAbi from '@uniswap/v2-core/build/IUniswapV2Factory.json';
import UniswapV2PairAbi from '@uniswap/v2-core/build/IUniswapV2Pair.json';

import { parseUnits } from 'ethers/lib/utils';

dotenv.config();


const main = async () => {
  const tokenA = await ethers.getContractAt('IERC20', process.env.TOKEN_A!);
  const tokenB = await ethers.getContractAt('IERC20', process.env.TOKEN_B!);

  const signer = (await ethers.getSigners())[0];

  const factory = await ethers.getContractAt(UniswapV2FactoryAbi.abi, process.env.UNISWAP_V2_FACTORY_ADDRESS!, signer);

  let tx
  //  = await factory.createPair(tokenA.address, tokenB.address);
  // await tx.wait();

  const pairAddress = await factory.getPair(tokenA.address, tokenB.address);

  console.log(`Pair address: ${pairAddress}`);

  const pair = await ethers.getContractAt(UniswapV2PairAbi.abi, pairAddress);

  console.log(`Balance before: ${await pair.balanceOf(signer.address)}`);
  tx = await tokenA.transfer(pair.address, parseUnits('100000', 18));
  await tx.wait();

  tx = await tokenB.transfer(pair.address, parseUnits('1000', 18));
  await tx.wait();

  tx = await pair.mint(signer.address);
  await tx.wait();
  console.log(`Balance after: ${await pair.balanceOf(signer.address)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
