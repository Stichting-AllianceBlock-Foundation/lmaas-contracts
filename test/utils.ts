import { ethers, network } from 'hardhat';

export async function timeTravel(seconds: number) {
  await network.provider.send('evm_increaseTime', [seconds]);
  await network.provider.send('evm_mine');
}

export async function getBlockNumber(virtualBlockTime: number) {
  return Math.trunc((await ethers.provider.getBlock('latest')).timestamp / virtualBlockTime);
}
