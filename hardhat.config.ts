import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        runs: 200,
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 0,
      },
    },
    rinkeby: {
      url: `https://broker.alliancenode.io/ethereum/rinkeby/${process.env.ALLIANCE_BLOCK_API_KEY}`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 120,
    coinmarketcap: '2f8f78a1-2769-493f-9cd4-df353a6594d7',
  },
};
