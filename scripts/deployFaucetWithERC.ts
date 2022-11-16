import { ethers } from 'hardhat';

interface TokenProps {
  name: string;
  symbol: string;
  decimals?: number;
}

const tokens: { erc20: TokenProps[]; erc721: TokenProps[]; erc1155: {}[] } = {
  erc20: [
    { name: 'Test ALBT', symbol: 'ALBT', decimals: 18 },
    { name: 'Test USDT', symbol: 'USDT', decimals: 6 },
    { name: 'Test USDC', symbol: 'USDC', decimals: 6 },
  ],
  erc721: [{ name: 'Test NFT', symbol: 'NFT' }],
  erc1155: [{}],
};

const tokenAddress: { erc20: string[]; erc721: string[]; erc1155: string[] } = { erc20: [], erc721: [], erc1155: [] };

async function main() {
  const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
  const ERC721Faucet = await ethers.getContractFactory('ERC721Faucet');
  const ERC1155Faucet = await ethers.getContractFactory('ERC1155Faucet');

  const GeneralFaucet = await ethers.getContractFactory('GeneralFaucet');
  const generalFaucet = await GeneralFaucet.deploy();

  await generalFaucet.deployed();
  await generalFaucet.deployTransaction.wait(1);

  console.log(`GeneralFaucet deployed to ${generalFaucet.address}`);

  //   Deploy ERC20 tokens
  for (const { name, symbol, decimals } of tokens.erc20) {
    const erc20TokenFaucet = await ERC20Faucet.deploy(name, symbol, decimals!);
    await erc20TokenFaucet.deployed();
    await erc20TokenFaucet.deployTransaction.wait(1);

    console.log(
      `Deployed ERC20 token "${name}" with symbol "${symbol}" and ${decimals} decimals to ${erc20TokenFaucet.address}`
    );

    const tx = await generalFaucet.addFaucet(erc20TokenFaucet.address, 0);
    await tx.wait(1);

    tokenAddress.erc20.push(erc20TokenFaucet.address);
  }

  //   Deploy ERC721 tokens
  for (const { name, symbol } of tokens.erc721) {
    const erc721TokenFaucet = await ERC721Faucet.deploy(name, symbol);
    await erc721TokenFaucet.deployed();
    await erc721TokenFaucet.deployTransaction.wait(1);

    console.log(`Deployed ERC721 token "${name}" with symbol "${symbol}" to ${erc721TokenFaucet.address}`);

    const tx = await generalFaucet.addFaucet(erc721TokenFaucet.address, 1);
    await tx.wait(1);

    tokenAddress.erc721.push(erc721TokenFaucet.address);
  }

  //   Deploy ERC1155 tokens
  for (const {} of tokens.erc1155) {
    const erc1155TokenFaucet = await ERC1155Faucet.deploy();
    await erc1155TokenFaucet.deployed();
    await erc1155TokenFaucet.deployTransaction.wait(1);

    console.log(`Deployed ERC1155 token to ${erc1155TokenFaucet.address}`);

    const tx = await generalFaucet.addFaucet(erc1155TokenFaucet.address, 2);
    await tx.wait(1);

    tokenAddress.erc1155.push(erc1155TokenFaucet.address);
  }

  console.log('Token address summary: ', tokenAddress);

  console.log('erc20 faucets');
  for (const erc20Address of tokenAddress.erc20) {
    console.log(erc20Address, await generalFaucet.ERC20Faucets(erc20Address));
  }

  console.log('erc721Address faucets');
  for (const erc721Address of tokenAddress.erc721) {
    console.log(erc721Address, await generalFaucet.ERC721Faucets(erc721Address));
  }

  console.log('erc1155Address faucets');
  for (const erc1155Address of tokenAddress.erc1155) {
    console.log(erc1155Address, await generalFaucet.ERC1155Faucets(erc1155Address));
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
