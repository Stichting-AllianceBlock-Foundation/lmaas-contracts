import { ethers } from 'hardhat';
import { deployContract } from 'ethereum-waffle';

import { TestERC20 } from '../typechain/TestERC20';

import CompoundingRewardsPoolStakerArtifact from '../artifacts/contracts/V2/CompoundingRewardsPoolStaker.sol/CompoundingRewardsPoolStaker.json';
import CompoundingRewardsPoolArtifact from '../artifacts/contracts/V2/CompoundingRewardsPool.sol/CompoundingRewardsPool.json';
import { CompoundingRewardsPoolStaker } from '../typechain/CompoundingRewardsPoolStaker';
import { CompoundingRewardsPool } from '../typechain/CompoundingRewardsPool';
import { BigNumber } from 'ethers';

async function main() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  const stakingTokenAddress = process.env.STAKING_TOKEN;

  const rewardTokenAddresses = (process.env.REWARD_TOKENS as string).split(',');
  const rewardTokenAmounts = (process.env.REWARD_AMOUNTS as string).split(',');

  const stakeLimit = process.env.STAKE_LIMIT;
  const contractStakeLimit = process.env.CONTRACT_STAKE_LIMIT;

  const throttleRoundSeconds = process.env.THROTTLE_ROUND_SECONDS;
  const throttleRoundCap = process.env.THROTTLE_ROUND_CAP;

  const CompoundingRewardsPoolStakerInstance = (await deployContract(
    contractOwner,
    CompoundingRewardsPoolStakerArtifact,
    [stakingTokenAddress, throttleRoundSeconds, throttleRoundCap, contractStakeLimit]
  )) as CompoundingRewardsPoolStaker;

  const CompoundingRewardsPoolInstance = (await deployContract(contractOwner, CompoundingRewardsPoolArtifact, [
    stakingTokenAddress,
    rewardTokenAddresses,
    CompoundingRewardsPoolStakerInstance.address,
    'Test Auto Staking Pool',
  ])) as CompoundingRewardsPool;

  await CompoundingRewardsPoolStakerInstance.setPool(CompoundingRewardsPoolInstance.address);

  console.log('Auto staking pool deployed at:', CompoundingRewardsPoolStakerInstance.address);

  const duration = parseInt(process.env.DURATION as string);

  const erc20 = await ethers.getContractFactory('TestERC20');
  const txs = [];

  for (let i = 0; i < rewardTokenAddresses.length; i++) {
    const rewardTokenAddress = rewardTokenAddresses[i];
    const rewardTokenAmount = BigNumber.from(rewardTokenAmounts[i]).mul(duration);

    const contract = (await erc20.attach(rewardTokenAddress)) as TestERC20;
    const tx = await contract.transfer(CompoundingRewardsPoolInstance.address, rewardTokenAmount);

    txs.push(tx.wait());

    console.log(
      'Sent ' + rewardTokenAmount + ' ' + rewardTokenAddress + ' to ' + CompoundingRewardsPoolInstance.address
    );
  }

  await Promise.all(txs);

  const currentTime = Math.round(new Date().getTime() / 1000);
  const startTime = currentTime + 60;

  const tx = await CompoundingRewardsPoolInstance.start(startTime, startTime + duration, rewardTokenAmounts);
  await tx.wait();

  await CompoundingRewardsPoolStakerInstance.start(startTime + duration);

  console.log('Auto staking pool starts at:', new Date(startTime * 1000));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
