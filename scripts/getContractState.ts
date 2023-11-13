import { parseEther } from '@ethersproject/units';
import { ethers, network } from 'hardhat';

const IMPOSE_AS = '0x54559E53d3AfA6aD0F01ad949560E5638BF48be9';
const CONTRACT_ADDRESS = '0xd33B4d4543e18173B16d9e47AF45276c347B5a3b';
const BOSON = '0xE3c811AbbD19FBb9Fe324EB0F30f32d1F6D20C95';

async function main() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const boson = await ethers.getContractAt('ERC20', BOSON);
  // Impose as user
  await deployer.sendTransaction({
    to: IMPOSE_AS,
    value: parseEther('1'),
  });

  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [IMPOSE_AS],
  });

  const imposed = await ethers.getSigner(IMPOSE_AS);

  const contract = await ethers.getContractAt('RewardsPoolBase', CONTRACT_ADDRESS);

  console.log({
    ...(await contract.userInfo(imposed.address)),
    rewardDebt: await contract.getUserRewardDebt(imposed.address, 0),
    owedTokens: await contract.getUserOwedTokens(imposed.address, 0),
  });

  console.log('balance before', {
    contract: await boson.balanceOf(contract.address),
    imposed: await boson.balanceOf(imposed.address),
  });
  await contract.connect(imposed).exit();

  console.log('balance after', {
    contract: await boson.balanceOf(contract.address),
    imposed: await boson.balanceOf(imposed.address),
  });
  console.log(await contract.getRewardTokensCount());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
