import { ethers } from 'hardhat';

async function main() {
  const GeneralFaucet = await ethers.getContractFactory('GeneralFaucet');
  const generalFaucet = await GeneralFaucet.deploy();

  await generalFaucet.deployed();
  console.log('Faucet deployed to: ', generalFaucet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
