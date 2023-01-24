import { ethers } from 'hardhat';

async function main() {
  const GeneralFaucet = await ethers.getContractFactory('GeneralFaucet');
  const generalFaucet = await GeneralFaucet.deploy();

  await generalFaucet.deployed();
  console.log('Faucet deployed to: ', generalFaucet.address);

  // ERC20Faucet - add
  await generalFaucet.addFaucet('0xAe2Af531463f81fB72dc983ca3D31D9ce3d466Cf', 0);
  await generalFaucet.addFaucet('0x128eCB61c2750b185e924cef31d42B4593F5fABC', 0);
  await generalFaucet.addFaucet('0x442186eeC60b09cF68A026A9cbF840c6E9Abdb1A', 0);

  // ERC721Faucet - add
  await generalFaucet.addFaucet('0x27E0ee770f2Ad45dd4c35FDDCCb2BF4B013cFbEF', 1);

  // ERC1155Faucet - add
  await generalFaucet.addFaucet('0xc38cc549b9a17B0dab540D3aE43cC07808126261', 2);

  console.log('Faucets added!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
