import { ethers } from 'hardhat';
import { StakingCampaignRecipient } from '../typechain';
import fs from 'fs';
import { getTime } from '../test/utils';

const addressesInformation = fs.readFileSync('test/RecipientCampaign/campaign_balances.csv', 'utf8').split('\n');

const stakingAmounts = addressesInformation.map((a) => a.split(',')[1]);
const rewardAmounts = addressesInformation.map((a) => a.split(',')[2]);
const fullReward = ethers.BigNumber.from('19999999999999999996075266');
const reward = fullReward.sub(
  rewardAmounts.reduce((a, b) => ethers.BigNumber.from(a).add(ethers.BigNumber.from(b)), ethers.BigNumber.from(0))
);
const timeInSeconds = 86400 * 30 * 31;
const addresses = addressesInformation.map((a) => a.split(',')[0]);
const campaign = '0x8b0F10F928B620e1a6292Fb7918EDcad73C083F8';

async function main() {
  const contractStakeLimit = ethers.utils.parseEther('20000000');
  const stakeLimit = ethers.utils.parseEther('500000');
  const throttleRoundCap = ethers.utils.parseEther('100000');
  const throttleRoundSeconds = 86400;

  const NonCompoundingRewardsPool = await ethers.getContractFactory('StakingCampaignRecipient');

  const NonCompoundingRewardsPoolInstance = (await NonCompoundingRewardsPool.deploy(
    '0x644192291cc835a93d6330b24ea5f5fedd0eef9e',
    ['0x644192291cc835a93d6330b24ea5f5fedd0eef9e'],
    stakeLimit,
    throttleRoundSeconds,
    throttleRoundCap,
    contractStakeLimit,
    '2YR NXRA Campaign',
    { gasPrice: ethers.utils.parseUnits('23', 'gwei') }
  )) as StakingCampaignRecipient;

  await NonCompoundingRewardsPoolInstance.deployed();

  console.log('StakingCampaignRecipient deployed to:', NonCompoundingRewardsPoolInstance.address);
}

async function startCampaign(contractAddress: string) {
  const currentTimestamp = await getTime();
  const rewardPerSecond = reward.div(timeInSeconds);
  const startTimestamp = currentTimestamp + 30;
  const endTimestamp = startTimestamp + timeInSeconds;

  const NonCompoundingRewardsPoolInstance = (await ethers.getContractAt(
    'StakingCampaignRecipient',
    contractAddress
  )) as StakingCampaignRecipient;

  await (await NonCompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp, [rewardPerSecond])).wait(1);
}

async function addStakers(contractAddress: string) {
  const NonCompoundingRewardsPoolInstance = (await ethers.getContractAt(
    'StakingCampaignRecipient',
    contractAddress
  )) as StakingCampaignRecipient;

  const standardStakingAmounts = stakingAmounts.map((a) => ethers.BigNumber.from(a));
  const standardRewardAmounts = rewardAmounts.map((a) => ethers.BigNumber.from(a));

  for (let i = 0; i <= addresses.length; i += 48) {
    console.log(i);
    let currentAddresses = [];
    let currentStandardStakingAmounts = [];
    let currentExpectedRewards = [];

    for (let j = i === 0 ? 0 : i - 48; j < i; j++) {
      currentAddresses.push(addresses[j]);
      currentStandardStakingAmounts.push(standardStakingAmounts[j]);
      currentExpectedRewards.push([standardRewardAmounts[j]]);
    }

    await (
      await NonCompoundingRewardsPoolInstance.addStakersBatch(
        currentAddresses, // * extracting the address from the wallet
        currentStandardStakingAmounts,
        currentExpectedRewards
      )
    ).wait(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// startCampaign(campaign).catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

addStakers(campaign).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
