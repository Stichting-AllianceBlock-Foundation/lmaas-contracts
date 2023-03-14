import { ethers } from 'hardhat';
import { StakingCampaignRecipient } from '../typechain';
import fs from 'fs';
import { getTime } from '../test/utils';

const addressesInformation = fs.readFileSync('test/RecipientCampaign/campaign_balances.csv', 'utf8').split('\n');

const stakingAmounts = addressesInformation.map((a) => a.split(',')[1]);
const rewardAmounts = addressesInformation.map((a) => a.split(',')[2]);
const fullReward = ethers.BigNumber.from('7999954860066201558372192');
const staked = ethers.BigNumber.from('12999999999999996976240178');
const reward = fullReward.sub(ethers.BigNumber.from('7970548700973012674211967')); // * already distributed rewards
const timeInSeconds = 86400 * 2; // * 2 days
const addresses = addressesInformation.map((a) => a.split(',')[0]);
const campaign = '0x8662aB07C92b0703C1e42eF879cFee0A8cA9B2F0';

async function main() {
  const fNXRA = await ethers.getContractAt('ERC20Faucet', '0x57F0A442216af7b2480a94E9E7E7af2A4217c271');
  const contractStakeLimit = ethers.utils.parseEther('13000000');
  const stakeLimit = ethers.utils.parseEther('300000');
  const throttleRoundSeconds = 86400;
  const throttleRoundCap = ethers.utils.parseEther('310000');

  const NonCompoundingRewardsPool = await ethers.getContractFactory('StakingCampaignRecipient');

  const NonCompoundingRewardsPoolInstance = (await NonCompoundingRewardsPool.deploy(
    fNXRA.address,
    [fNXRA.address],
    stakeLimit,
    throttleRoundSeconds,
    throttleRoundCap,
    contractStakeLimit,
    '2YR NXRA Campaign'
  )) as StakingCampaignRecipient;

  await NonCompoundingRewardsPoolInstance.deployed();

  await (await fNXRA.faucet(NonCompoundingRewardsPoolInstance.address, staked)).wait(1);
  await (
    await fNXRA.faucet(NonCompoundingRewardsPoolInstance.address, fullReward.add(ethers.utils.parseEther('1000')))
  ).wait(1);

  console.log('StakingCampaignRecipient deployed to:', NonCompoundingRewardsPoolInstance.address);
}

async function startCampaign(contractAddress: string) {
  const currentTimestamp = await getTime();
  const rewardPerSecond = reward.div(timeInSeconds);
  const startTimestamp = currentTimestamp + 60;
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

  for (let i = 0; i <= addresses.length; i += 57) {
    let currentAddresses = [];
    let currentStandardStakingAmounts = [];
    let currentExpectedRewards = [];

    for (let j = i === 0 ? 0 : i - 57; j < i; j++) {
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
