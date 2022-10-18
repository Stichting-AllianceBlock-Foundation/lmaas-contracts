import { ethers } from 'hardhat';

async function main() {
  const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
  const ERC721Faucet = await ethers.getContractFactory('ERC721Faucet');
  const ERC1155Faucet = await ethers.getContractFactory('ERC1155Faucet');

  const fALBT = await ERC20Faucet.deploy('Test ALBT', 'tALBT', 18);
  const fUSDT = await ERC20Faucet.deploy('Test USDT', 'tUSDT', 6);
  const fUSDC = await ERC20Faucet.deploy('Test USDC', 'tUSDC', 6);
  const fNFT = await ERC721Faucet.deploy('Test NFT', 'tNFT');
  const fMultiToken = await ERC1155Faucet.deploy();

  await fALBT.deployed();
  await fUSDT.deployed();
  await fUSDC.deployed();
  await fNFT.deployed();
  await fMultiToken.deployed();

  console.log('fALBT deployed to: ', fALBT.address);
  console.log('fUSDT deployed to: ', fUSDT.address);
  console.log('fUSDC deployed to: ', fUSDC.address);
  console.log('fNFT deployed to: ', fNFT.address);
  console.log('fMultiToken deployed to: ', fMultiToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
