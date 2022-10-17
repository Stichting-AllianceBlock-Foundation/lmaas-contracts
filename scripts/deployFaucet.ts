import { ethers } from 'hardhat';

async function main() {
  const Faucet = await ethers.getContractFactory('ERC20Faucet');
  const faucet = await Faucet.deploy('Test USDC', 'tUSDC', 6);

  await faucet.deployed();
  console.log('Faucet deployed to: ', faucet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
