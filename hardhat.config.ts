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
      accounts: { count: 1000 },
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    ethereum: {
      url: 'https://rpc.ankr.com/eth',
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
    polygon: {
      url: 'https://nd-046-983-923.p2pify.com/1aace6ebb1db9383cd75547f66d39741',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    energywebchain: {
      url: 'https://rpc.energyweb.org',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
      gasPrice: 200000000000,
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
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/C/rpc',
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    volta: {
      url: 'https://volta-rpc.energyweb.org/',
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
