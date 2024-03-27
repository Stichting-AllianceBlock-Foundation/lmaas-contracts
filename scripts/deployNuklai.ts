import { ethers } from 'hardhat';
import { deployContract } from 'ethereum-waffle';

import NuklaiStakingPoolArtifact from '../artifacts/contracts/V2/NuklaiStakingPool.sol/NuklaiStakingPool.json';
import { NuklaiStakingPool } from '../typechain/NuklaiStakingPool';

import TestERC20Artifact from '../artifacts/contracts/TestERC20.sol/TestERC20.json';
import { TestERC20 } from '../typechain/TestERC20';

import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  // Deploy new token
  const TestERC20Instance = (await deployContract(contractOwner, TestERC20Artifact, [parseEther('1000000')])) as TestERC20;
  console.log('TestERC20 deployed at:', TestERC20Instance.address);

  const stakingTokenAddress = TestERC20Instance.address;

  const duration = 3600 * 24 * 30;

  const rewardTokenAddresses = [stakingTokenAddress];
  const rewardTokenAmounts = [parseEther('100').div(duration)];

  const stakeLimit = parseEther('1000000');
  const contractStakeLimit = parseEther('1000000');

  const throttleRoundSeconds = 3600;
  const throttleRoundCap = stakeLimit;

  const StakingInstance = (await deployContract(contractOwner, NuklaiStakingPoolArtifact, [
    stakingTokenAddress,
    rewardTokenAddresses,
    stakeLimit,
    throttleRoundSeconds,
    throttleRoundCap,
    contractStakeLimit,
    'Test Nuklai',
  ])) as NuklaiStakingPool;

  console.log('Staking pool deployed at:', StakingInstance.address);

  const erc20 = await ethers.getContractFactory('TestERC20');
  const txs = [];

  for (let i = 0; i < rewardTokenAddresses.length; i++) {
    const rewardTokenAddress = rewardTokenAddresses[i];
    const rewardTokenAmount = BigNumber.from(rewardTokenAmounts[i]).mul(duration);

    const contract = (await erc20.attach(rewardTokenAddress)) as TestERC20;

    await contract.approve(StakingInstance.address, rewardTokenAmount);
    const tx = await contract.transfer(StakingInstance.address, rewardTokenAmount);

    txs.push(tx.wait());

    console.log('Sent ' + rewardTokenAmount + ' ' + rewardTokenAddress + ' to ' + StakingInstance.address);
  }

  await Promise.all(txs);

  const currentTime = Math.round(new Date().getTime() / 1000);
  const startTime = currentTime + 60;

  await StakingInstance.start(startTime, startTime + duration, rewardTokenAmounts.map(x => x.mul(parseEther("1"))));

  console.log('Staking pool starts at:', new Date(startTime * 1000));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
