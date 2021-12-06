import { BigNumberish } from '@ethersproject/bignumber';
import { ethers, network } from 'hardhat';
import { TestERC20 } from '../typechain-types/TestERC20';

export async function timeTravel(seconds: number) {
  await network.provider.send('evm_increaseTime', [seconds]);
  await network.provider.send('evm_mine');
}

export async function getBlockNumber(virtualBlockTime: number) {
  return Math.trunc((await getTime()) / virtualBlockTime);
}

export async function getTime() {
  return (await ethers.provider.getBlock('latest')).timestamp;
}

export async function deployERC20(amount: BigNumberish = 0) {
  const TestERC20 = await ethers.getContractFactory('TestERC20');
  return (await TestERC20.deploy(amount)) as TestERC20;
}
