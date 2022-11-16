import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
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
      url: `https://rpc.ankr.com/eth_rinkeby`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    ethereum: {
      url: `https://rpc.ankr.com/eth`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    binance: {
      url: 'https://rpc.ankr.com/bsc',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    avalanche: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    // avalanche: {
    //   url: 'https://rpc.ankr.com/avalanche',
    //   accounts: [process.env.RINKEBY_PRIVATE_KEY],
    // },
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    energywebchain: {
      url: 'https://rpc.energyweb.org',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
      gasPrice: 20000000000,
    },
    moonbeam: {
      url: 'https://rpc.ankr.com/moonbeam',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    songbird: {
      url: 'https://songbird.towolabs.com/rpc',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    goerli: {
      url: 'https://nd-734-064-122.p2pify.com/62dc5c5a86cd193963ee39f48eb2cadf',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 120,
    coinmarketcap: '2f8f78a1-2769-493f-9cd4-df353a6594d7',
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
