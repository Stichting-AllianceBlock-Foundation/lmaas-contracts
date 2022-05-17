import { ethers } from 'hardhat';
import { deployContract } from 'ethereum-waffle';

import { TestERC20 } from '../typechain/TestERC20';

import LMCArtifact from '../artifacts/contracts/LiquidityMiningCampaign.sol/LiquidityMiningCampaign.json';
import { LiquidityMiningCampaign } from '../typechain/LiquidityMiningCampaign';
import { BigNumber } from 'ethers';

async function main() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  const stakingTokenAddress = process.env.STAKING_TOKEN;

  const rewardTokenAddresses = (process.env.REWARD_TOKENS as string).split(',');
  const rewardTokenAmounts = (process.env.REWARD_AMOUNTS as string).split(',');

  const stakeLimit = process.env.STAKE_LIMIT;
  const contractStakeLimit = process.env.CONTRACT_STAKE_LIMIT;

  const LmcInstance = (await deployContract(contractOwner, LMCArtifact, [
    stakingTokenAddress,
    rewardTokenAddresses,
    stakeLimit,
    contractStakeLimit,
    'Test LMC',
  ])) as LiquidityMiningCampaign;

  console.log('LMC deployed at:', LmcInstance.address);

  const duration = parseInt(process.env.DURATION as string);

  const erc20 = await ethers.getContractFactory('TestERC20');
  const txs = [];

  for (let i = 0; i < rewardTokenAddresses.length; i++) {
    const rewardTokenAddress = rewardTokenAddresses[i];
    const rewardTokenAmount = BigNumber.from(rewardTokenAmounts[i]).mul(duration);

    const contract = (await erc20.attach(rewardTokenAddress)) as TestERC20;
    const tx = await contract.transfer(LmcInstance.address, rewardTokenAmount);

    txs.push(tx.wait());

    console.log('Sent ' + rewardTokenAmount + ' ' + rewardTokenAddress + ' to ' + LmcInstance.address);
  }

  await Promise.all(txs);

  const currentTime = Math.round(new Date().getTime() / 1000);
  const startTime = currentTime + 60;

  await LmcInstance.start(startTime, startTime + duration, rewardTokenAmounts);

  console.log('LMC starts at:', new Date(startTime * 1000));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
