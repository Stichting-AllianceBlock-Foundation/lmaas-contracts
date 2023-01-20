import { ethers } from 'hardhat';

const nonce = 875;
async function main() {
  const signer = (await ethers.getSigners())[0];

  console.log('Transaction count:', await signer.getTransactionCount());
  console.log(`Address: ${signer.address}`);

  const currentNonce = await signer.getTransactionCount();

  for (let _nonce = currentNonce; _nonce < nonce; _nonce++) {
    const tx = await signer.sendTransaction({ to: ethers.constants.AddressZero, nonce: _nonce, value: 0 });

    // await tx.wait(1);
    console.log(`Deployed tx with nonce ${_nonce} and hash ${tx.hash}`);

    // const latestNonce = await signer.getTransactionCount();
    // if (_nonce + 1 !== latestNonce) {
    //   throw new Error(`Nonce not matching it should be at ${_nonce} while it is ${latestNonce} on chain`);
    // }
  }

  // Transaction to be executed when the nonce is reached

  const ERC20Faucet = await ethers.getContractFactory('ERC20Faucet');
  const fUSDT = await ERC20Faucet.deploy('Test ALBT', 'ALBT', 18, { nonce });
  console.log(`deployed with nonce ${fUSDT.deployTransaction.nonce} in ${fUSDT.deployTransaction.hash}`);
  console.log(`Contract address is ${fUSDT.address}`);

  await fUSDT.deployTransaction.wait(1);
  console.log('Deployment finished');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, time);
  });
};
