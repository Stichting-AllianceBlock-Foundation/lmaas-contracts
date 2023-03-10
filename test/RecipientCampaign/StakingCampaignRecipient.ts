import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { TestERC20 } from '../../typechain/TestERC20';
import { getTime, timeTravel } from '../utils';
import { StakingCampaignRecipient } from '../../typechain';
import fs from 'fs';

const addressesInformation = fs.readFileSync('test/RecipientCampaign/campaign_balances.csv', 'utf8').split('\n');
const fullAddressesInformation = fs
  .readFileSync('test/RecipientCampaign/expected_campaign_balances.csv', 'utf8')
  .split('\n');

const fullRewardAmounts = fullAddressesInformation.map((a) => a.split(',')[2]);
const expectedRewardAmounts = fullRewardAmounts.map((a) => ethers.BigNumber.from(a));

const stakingAmounts = addressesInformation.map((a) => a.split(',')[1]);
const rewardAmounts = addressesInformation.map((a) => a.split(',')[2]);
const fullReward = ethers.BigNumber.from('7999954860066201558372192');
const staked = ethers.BigNumber.from('12999999999999996976240178');
const reward = fullReward.sub(ethers.BigNumber.from('7878001805597348121738098'));
let addresses: SignerWithAddress[] = [];

describe('StakingCampaignRecipient', () => {
  let accounts: SignerWithAddress[];

  before(async () => {
    accounts = await ethers.getSigners();
    addresses = addressesInformation.map((_, i) => accounts[i]);
  });

  let NonCompoundingRewardsPoolInstance: StakingCampaignRecipient;
  let stakingTokenInstance: TestERC20;
  let stakingTokenAddress: string;

  let rewardTokenInstance: TestERC20;
  let rewardTokenAddress: string;
  let rewardPerSecond: BigNumber;

  let throttleRoundSeconds = 86400;
  let throttleRoundCap = ethers.utils.parseEther('310000');

  const closeAmount = '2000';
  const amount = ethers.utils.parseEther('51840000');
  const contractStakeLimit = ethers.constants.MaxUint256;
  const stakeLimit = amount;
  const bOne = ethers.utils.parseEther('1');
  const standardStakingAmounts = stakingAmounts.map((a) => ethers.BigNumber.from(a));
  const standardRewardAmounts = rewardAmounts.map((a) => ethers.BigNumber.from(a));

  let startTimestamp: number;
  let endTimestamp: number;
  const oneMinute = 60;
  const timeInSeconds = 3600;

  const setupRewardsPoolParameters = async () => {
    const ERC20 = await ethers.getContractFactory('TestERC20');
    const tknInst = (await ERC20.deploy(amount)) as TestERC20;

    // populate tokens
    stakingTokenInstance = tknInst;
    stakingTokenAddress = tknInst.address;
    rewardTokenInstance = tknInst;
    rewardTokenAddress = tknInst.address;

    // populate amounts
    rewardPerSecond = reward.div(timeInSeconds);

    const currentTimestamp = await getTime();
    startTimestamp = currentTimestamp + oneMinute;
    endTimestamp = startTimestamp + timeInSeconds;
  };

  const stakeBatch = async (_throttleRoundSeconds: number, _throttleRoundCap: BigNumber) => {
    const NonCompoundingRewardsPool = await ethers.getContractFactory('StakingCampaignRecipient');

    NonCompoundingRewardsPoolInstance = (await NonCompoundingRewardsPool.deploy(
      stakingTokenAddress,
      [rewardTokenAddress],
      stakeLimit,
      _throttleRoundSeconds,
      _throttleRoundCap,
      contractStakeLimit,
      'TestCampaign'
    )) as StakingCampaignRecipient;

    await stakingTokenInstance.mint(NonCompoundingRewardsPoolInstance.address, staked);
    await rewardTokenInstance.mint(
      NonCompoundingRewardsPoolInstance.address,
      fullReward.add(ethers.utils.parseEther('60000'))
    );

    await NonCompoundingRewardsPoolInstance.start(startTimestamp, endTimestamp, [rewardPerSecond]);

    await timeTravel(60);

    for (let i = 0; i <= addresses.length; i += 19) {
      let currentAddresses = [];
      let currentStandardStakingAmounts = [];
      let currentExpectedRewards = [];

      for (let j = i === 0 ? 0 : i - 19; j < i; j++) {
        currentAddresses.push(addresses[j].address);
        currentStandardStakingAmounts.push(standardStakingAmounts[j]);
        currentExpectedRewards.push([standardRewardAmounts[j]]);
      }

      await NonCompoundingRewardsPoolInstance.addStakersBatch(
        currentAddresses, // * extracting the address from the wallet
        currentStandardStakingAmounts,
        currentExpectedRewards
      );
    }
  };

  describe('Interaction Mechanics', async function () {
    beforeEach(async () => {
      await setupRewardsPoolParameters();
      await stakeBatch(throttleRoundSeconds, throttleRoundCap);
    });

    it('[Should deploy the campaign correctly]:', async () => {
      expect(NonCompoundingRewardsPoolInstance.address);
    });

    it('[Should not claim or withdraw]:', async () => {
      await expect(NonCompoundingRewardsPoolInstance.claim()).to.be.revertedWith(
        'OnlyExitFeature::cannot claim from this contract. Only exit.'
      );

      await expect(NonCompoundingRewardsPoolInstance.withdraw(bOne)).revertedWith(
        'OnlyExitFeature::cannot withdraw from this contract. Only exit.'
      );
    });

    it('[Should not allow extending]:', async () => {
      await expect(NonCompoundingRewardsPoolInstance.extend(0, [])).to.be.revertedWith(
        'NonCompoundingRewardsPool: cannot extend this pool.'
      );
    });

    it('[Should not exit before end of campaign]:', async () => {
      await expect(NonCompoundingRewardsPoolInstance.exit()).to.be.revertedWith(
        'onlyUnlocked::cannot perform this action until the end of the lock'
      );
    });

    it('[Should not be able to stake in stakingRecipient campaign]:', async () => {
      expect(NonCompoundingRewardsPoolInstance.stake(standardStakingAmounts[0])).to.be.revertedWith(
        'StakingCampaignRecipient: not allowed in campaign recipient.'
      );
    });

    it('[Should request exit successfully]:', async () => {
      await timeTravel(timeInSeconds);

      const exitPR = addresses.map((a) => NonCompoundingRewardsPoolInstance.connect(a).exit());
      await Promise.all(exitPR);

      const exitInformationPR = addresses.map((a) => NonCompoundingRewardsPoolInstance.exitInfo(a.address));
      const totalStaked = await NonCompoundingRewardsPoolInstance.totalStaked();
      const pendingRewardPR = addresses.map((a) => NonCompoundingRewardsPoolInstance.connect(a).getPendingReward(0));
      const userExitInformation = await Promise.all(exitInformationPR);
      const pendingRewards = await Promise.all(pendingRewardPR);

      for (let i = 0; i < addresses.length; i++) {
        expect(userExitInformation[i].exitStake).to.equal(standardStakingAmounts[i]);
        expect(pendingRewards[i]).to.closeTo(expectedRewardAmounts[i], ethers.utils.parseEther(closeAmount));
      }

      expect(totalStaked).to.eq(staked);
    });
  });

  describe('Completing Exit', async function () {
    beforeEach(async () => {
      await setupRewardsPoolParameters();
      await stakeBatch(throttleRoundSeconds, throttleRoundCap);
    });

    it('[Should not complete early]:', async () => {
      await timeTravel(timeInSeconds);
      await NonCompoundingRewardsPoolInstance.exit();

      await expect(NonCompoundingRewardsPoolInstance.completeExit()).to.be.revertedWith(
        'finalizeExit::Trying to exit too early'
      );
    });

    it.only('[Should complete succesfully]:', async () => {
      await timeTravel(timeInSeconds);

      const exitPR = addresses.map((a) => NonCompoundingRewardsPoolInstance.connect(a).exit());
      await Promise.all(exitPR);

      await timeTravel(86400);

      const exitInformationPR = addresses.map((a) => NonCompoundingRewardsPoolInstance.exitInfo(a.address));
      const pendingRewardPR = addresses.map((a) => NonCompoundingRewardsPoolInstance.connect(a).getPendingReward(0));

      const userExitInformation = await Promise.all(exitInformationPR);
      const pendingRewards = await Promise.all(pendingRewardPR);

      for (let i = 0; i < addresses.length; i++) {
        expect(userExitInformation[i].exitStake).to.equal(standardStakingAmounts[i]);
        expect(pendingRewards[i]).to.closeTo(expectedRewardAmounts[i], ethers.utils.parseEther(closeAmount));
      }

      for (let i = 0; i < addresses.length; i++) {
        await NonCompoundingRewardsPoolInstance.connect(addresses[i]).completeExit();
        await timeTravel(86400);
      }

      const finalBalancesPR = addresses.map((a) => stakingTokenInstance.balanceOf(a.address));
      const finalBalances = await Promise.all(finalBalancesPR);

      for (let i = 0; i < addresses.length; i++) {
        if (i === 0) continue; // * we skip the first one because it has a different amount (the one who holds the tokens)
        expect(finalBalances[i]).to.eq(userExitInformation[i].exitStake.add(pendingRewards[i]));
      }
    });
  });
});