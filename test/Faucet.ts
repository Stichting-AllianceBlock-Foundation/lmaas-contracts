import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { GeneralFaucet } from '../typechain';

let generalFaucet: GeneralFaucet;
const erc20Tokens: { name: string; symbol: string; decimals: number }[] = [
  { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
  { name: 'Tether USD', symbol: 'USDT', decimals: 6 },
  { name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18 },
];
const erc20Faucets: string[] = [];

const erc721Tokens: { name: string; symbol: string }[] = [
  { name: 'Test ERC-721 NFT', symbol: 'tNFT' },
  { name: 'Test ERC-721 NFT #2', symbol: 'tNFT2' },
  { name: 'Test ERC-721 NFT #3', symbol: 'tNFT3' },
];
const erc721Faucets: string[] = [];
const erc1155Faucets: string[] = [];
const ERC1155_MINT_AMOUNT = ethers.utils.parseEther('1000000');

let signers: SignerWithAddress[];

describe('Faucet', async () => {
  before(async () => {
    signers = await ethers.getSigners();
    const GeneralFaucet = await ethers.getContractFactory('GeneralFaucet');
    generalFaucet = await GeneralFaucet.deploy();

    await generalFaucet.deployed();

    // Deploy ERC20 faucets
    for (const { decimals, name, symbol } of erc20Tokens) {
      const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
      const erc20Faucet = await ERC20Faucet.deploy(name, symbol, decimals);

      await erc20Faucet.deployed();
      erc20Faucets.push(erc20Faucet.address);
    }

    // Deploy ERC721 faucets
    for (const { name, symbol } of erc721Tokens) {
      const ERC721Faucet = await ethers.getContractFactory('ERC721Faucet');
      const erc721Faucet = await ERC721Faucet.deploy(name, symbol);

      await erc721Faucet.deployed();
      erc721Faucets.push(erc721Faucet.address);
    }

    // Deploy ERC1155 faucets
    for (let index = 0; index < 3; index++) {
      const ERC1155Faucet = await ethers.getContractFactory('ERC1155Faucet');
      const erc1155Faucet = await ERC1155Faucet.deploy();

      await erc1155Faucet.deployed();
      erc1155Faucets.push(erc1155Faucet.address);
    }
  });

  describe('ERC20 faucets', async () => {
    it('Should be able to add faucets', async () => {
      for (const faucetAddress of erc20Faucets) {
        await generalFaucet.addFaucet(faucetAddress, 0);
        expect(await generalFaucet.ERC20Faucets(faucetAddress)).to.be.true;
      }
    });

    it('Should be able to mint from one faucet', async () => {
      const amount = 1000;
      const decimals = erc20Tokens[0].decimals;
      const erc20Faucet = await ethers.getContractAt('ERC20Faucet', erc20Faucets[0]);

      const balanceBefore = await erc20Faucet.balanceOf(signers[0].address);
      await generalFaucet.faucetERC20MintToMultiple([erc20Faucets[0]], signers[0].address, amount);
      const balanceAfter = await erc20Faucet.balanceOf(signers[0].address);

      expect(balanceBefore.add(BigNumber.from(10).pow(decimals).mul(amount))).to.be.eq(balanceAfter);
    });

    it('Should be able to mint from multiple faucets', async () => {
      const amount = 1000;
      const balancesBefore: BigNumber[] = [];
      const balancesAfter: BigNumber[] = [];

      for (const _erc20Faucet of erc20Faucets) {
        const erc20Faucet = await ethers.getContractAt('ERC20Faucet', _erc20Faucet);
        const balanceBefore = await erc20Faucet.balanceOf(signers[0].address);

        balancesBefore.push(balanceBefore);
      }
      await generalFaucet.faucetERC20MintToMultiple(erc20Faucets, signers[0].address, amount);

      for (const _erc20Faucet of erc20Faucets) {
        const erc20Faucet = await ethers.getContractAt('ERC20Faucet', _erc20Faucet);
        const balanceAfter = await erc20Faucet.balanceOf(signers[0].address);

        balancesAfter.push(balanceAfter);
      }

      for (let index = 0; index < balancesBefore.length; index++) {
        const balanceBefore = balancesBefore[index];
        const balanceAfter = balancesAfter[index];
        const decimals = erc20Tokens[index].decimals;

        expect(balanceBefore.add(BigNumber.from(10).pow(decimals).mul(amount))).to.be.eq(balanceAfter);
      }
    });

    it('Should be able to remove a faucet and add it again', async () => {
      await generalFaucet.deleteFaucet(erc20Faucets[0], 0);
      expect(await generalFaucet.ERC20Faucets(erc20Faucets[0])).to.be.false;
      expect(await generalFaucet.ERC20Faucets(erc20Faucets[1])).to.be.true;
      expect(await generalFaucet.ERC20Faucets(erc20Faucets[2])).to.be.true;

      await generalFaucet.addFaucet(erc20Faucets[0], 0);
      expect(await generalFaucet.ERC20Faucets(erc20Faucets[0])).to.be.true;
      expect(await generalFaucet.ERC20Faucets(erc20Faucets[1])).to.be.true;
      expect(await generalFaucet.ERC20Faucets(erc20Faucets[2])).to.be.true;
    });
  });

  describe('ERC721 faucets', async () => {
    it('Should be able to add faucets', async () => {
      for (const faucetAddress of erc721Faucets) {
        await generalFaucet.addFaucet(faucetAddress, 1);
        expect(await generalFaucet.ERC721Faucets(faucetAddress)).to.be.true;
      }
    });

    it('Should be able to mint from one faucet', async () => {
      const id = 0;
      const erc721Faucet = await ethers.getContractAt('ERC721Faucet', erc721Faucets[0]);

      const balanceBefore = await erc721Faucet.balanceOf(signers[0].address);
      await generalFaucet.faucetERC721MintToMultiple([erc721Faucets[0]], signers[0].address, id);
      const balanceAfter = await erc721Faucet.balanceOf(signers[0].address);

      expect(balanceBefore.add(1)).to.be.eq(balanceAfter);
    });

    it('Should be able to mint from multiple faucets', async () => {
      const id = 1;
      const balancesBefore: BigNumber[] = [];
      const balancesAfter: BigNumber[] = [];

      for (const _erc721Faucet of erc721Faucets) {
        const erc721Faucet = await ethers.getContractAt('ERC721Faucet', _erc721Faucet);
        const balanceBefore = await erc721Faucet.balanceOf(signers[0].address);

        balancesBefore.push(balanceBefore);
      }
      await generalFaucet.faucetERC721MintToMultiple(erc721Faucets, signers[0].address, id);

      for (const _erc721Faucet of erc721Faucets) {
        const erc721Faucet = await ethers.getContractAt('ERC721Faucet', _erc721Faucet);
        const balanceAfter = await erc721Faucet.balanceOf(signers[0].address);

        balancesAfter.push(balanceAfter);
      }

      for (let index = 0; index < balancesBefore.length; index++) {
        const balanceBefore = balancesBefore[index];
        const balanceAfter = balancesAfter[index];

        expect(balanceBefore.add(1)).to.be.eq(balanceAfter);
      }
    });

    it('Should be able to remove a faucet and add it again', async () => {
      await generalFaucet.deleteFaucet(erc721Faucets[0], 1);
      expect(await generalFaucet.ERC721Faucets(erc721Faucets[0])).to.be.false;
      expect(await generalFaucet.ERC721Faucets(erc721Faucets[1])).to.be.true;
      expect(await generalFaucet.ERC721Faucets(erc721Faucets[2])).to.be.true;

      await generalFaucet.addFaucet(erc721Faucets[0], 1);
      expect(await generalFaucet.ERC721Faucets(erc721Faucets[0])).to.be.true;
      expect(await generalFaucet.ERC721Faucets(erc721Faucets[1])).to.be.true;
      expect(await generalFaucet.ERC721Faucets(erc721Faucets[2])).to.be.true;
    });
  });

  describe('ERC1155 faucets', async () => {
    it('Should be able to add faucets', async () => {
      for (const faucetAddress of erc1155Faucets) {
        await generalFaucet.addFaucet(faucetAddress, 2);
        expect(await generalFaucet.ERC1155Faucets(faucetAddress)).to.be.true;
      }
    });

    it('Should be able to mint from one faucet', async () => {
      const id = 0;
      const erc1155Faucet = await ethers.getContractAt('ERC1155Faucet', erc1155Faucets[0]);

      const balanceBefore = await erc1155Faucet.balanceOf(signers[0].address, id);
      await generalFaucet.faucetERC1155MintToMultiple([erc1155Faucets[0]], signers[0].address, id);
      const balanceAfter = await erc1155Faucet.balanceOf(signers[0].address, id);

      expect(balanceBefore.add(ERC1155_MINT_AMOUNT)).to.be.eq(balanceAfter);
    });

    it('Should be able to mint from multiple faucets', async () => {
      const id = 1;
      const balancesBefore: BigNumber[] = [];
      const balancesAfter: BigNumber[] = [];

      for (const _erc1155Faucet of erc1155Faucets) {
        const erc1155Faucet = await ethers.getContractAt('ERC1155Faucet', _erc1155Faucet);
        const balanceBefore = await erc1155Faucet.balanceOf(signers[0].address, id);

        balancesBefore.push(balanceBefore);
      }
      await generalFaucet.faucetERC1155MintToMultiple(erc1155Faucets, signers[0].address, id);

      for (const _erc1155Faucet of erc1155Faucets) {
        const erc1155Faucet = await ethers.getContractAt('ERC1155Faucet', _erc1155Faucet);
        const balanceAfter = await erc1155Faucet.balanceOf(signers[0].address, id);

        balancesAfter.push(balanceAfter);
      }

      for (let index = 0; index < balancesBefore.length; index++) {
        const balanceBefore = balancesBefore[index];
        const balanceAfter = balancesAfter[index];

        expect(balanceBefore.add(ERC1155_MINT_AMOUNT)).to.be.eq(balanceAfter);
      }
    });

    it('Should be able to remove a faucet and add it again', async () => {
      await generalFaucet.deleteFaucet(erc1155Faucets[0], 2);
      expect(await generalFaucet.ERC1155Faucets(erc1155Faucets[0])).to.be.false;
      expect(await generalFaucet.ERC1155Faucets(erc1155Faucets[1])).to.be.true;
      expect(await generalFaucet.ERC1155Faucets(erc1155Faucets[2])).to.be.true;

      await generalFaucet.addFaucet(erc1155Faucets[0], 2);
      expect(await generalFaucet.ERC1155Faucets(erc1155Faucets[0])).to.be.true;
      expect(await generalFaucet.ERC1155Faucets(erc1155Faucets[1])).to.be.true;
      expect(await generalFaucet.ERC1155Faucets(erc1155Faucets[2])).to.be.true;
    });
  });
});
