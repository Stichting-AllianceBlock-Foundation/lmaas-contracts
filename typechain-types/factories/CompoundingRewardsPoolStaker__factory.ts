/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CompoundingRewardsPoolStaker,
  CompoundingRewardsPoolStakerInterface,
} from "../CompoundingRewardsPoolStaker";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_throttleRoundSeconds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_throttleRoundCap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_stakeLimit",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "ExitCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "exitTimestamp",
        type: "uint256",
      },
    ],
    name: "ExitRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sharesIssued",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldShareVaule",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newShareValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "balanceOf",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    inputs: [],
    name: "UNIT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "campaignEndTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "completeExit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "delegateStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_transferTo",
        type: "address",
      },
    ],
    name: "exitAndTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "exitInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "exitTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "exitStake",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exitStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenIndex",
        type: "uint256",
      },
    ],
    name: "getPendingReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lockEndTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextAvailableExitTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextAvailableRoundExitVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "receiversWhitelist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "refreshAutoStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPool",
    outputs: [
      {
        internalType: "contract IRewardsPoolBase",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
    ],
    name: "setPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_whitelisted",
        type: "bool",
      },
    ],
    name: "setReceiverWhitelisted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "share",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [
      {
        internalType: "contract IERC20Detailed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_endTimestamp",
        type: "uint256",
      },
    ],
    name: "start",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "throttleRoundCap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "throttleRoundSeconds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "valuePerShare",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60e0604052670de0b6b3a76400006009553480156200001d57600080fd5b5060405162002236380380620022368339810160408190526200004091620002c2565b838383838383836200005233620000fc565b3360a0526001600160a01b0383166080526200006f82826200014e565b50505080620000eb5760405162461bcd60e51b815260206004820152603960248201527f4c696d697465644175746f5374616b653a636f6e7374727563746f723a3a737460448201527f616b65206c696d69742073686f756c64206e6f7420626520300000000000000060648201526084015b60405180910390fd5b60c052506200030f95505050505050565b600780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60008211620001c65760405162461bcd60e51b815260206004820152603760248201527f7365745468726f74746c653a3a7468726f74746c6520726f756e64207365636f60448201527f6e6473206d757374206265206d6f7265207468616e20300000000000000000006064820152608401620000e2565b600081116200023e5760405162461bcd60e51b815260206004820152603360248201527f7365745468726f74746c653a3a7468726f74746c6520726f756e64206361702060448201527f6d757374206265206d6f7265207468616e2030000000000000000000000000006064820152608401620000e2565b6003541580156200024f5750600454155b620002b75760405162461bcd60e51b815260206004820152603160248201527f7365745468726f74746c653a3a7468726f74746c6520706172616d6574657273604482015270081dd95c9948185b1c9958591e481cd95d607a1b6064820152608401620000e2565b600391909155600455565b60008060008060808587031215620002d957600080fd5b84516001600160a01b0381168114620002f157600080fd5b60208601516040870151606090970151919890975090945092505050565b60805160a05160c051611eb162000385600039600081816102e3015281816106d701526110ad015260006104530152600081816103750152818161062901528181610a5501528181610cf00152818161135f0152818161140a015281816114a2015281816114dd015261180a0152611eb16000f3fe608060405234801561001057600080fd5b50600436106101fb5760003560e01c80637211bbc91161011a578063a861a7a3116100ad578063c45a01551161007c578063c45a01551461044e578063d4c3eea014610475578063e9fad8ee1461047e578063ee483cdf14610486578063f2fde38b1461048f57600080fd5b8063a861a7a314610422578063b01eb66014610435578063b540652e1461043d578063c0a239e31461044557600080fd5b806395805dad116100e957806395805dad146103e457806398cda7f8146103f75780639d8e217714610400578063a694fc3a1461040f57600080fd5b80637211bbc91461035d57806372f702f3146103705780638da5cb5b1461039757806394f66417146103a857600080fd5b80633c323a1b11610192578063652053d911610161578063652053d91461030e57806366666aa91461031757806370a0823114610342578063715018a61461035557600080fd5b80633c323a1b146102b85780634437152a146102cb57806345ef79af146102de5780634ff3306f1461030557600080fd5b80632711f727116101ce5780632711f7271461026a578063363291dc146102735780633882f742146102a65780633a98ef39146102af57600080fd5b806306fdde03146102005780631877bb5c1461021e5780631aa850601461024c5780632240e63c14610255575b600080fd5b6102086104a2565b6040516102159190611ab5565b60405180910390f35b61023e61022c366004611b04565b600d6020526000908152604090205481565b604051908152602001610215565b61023e60005481565b610268610263366004611b04565b610528565b005b61023e60055481565b610296610281366004611b04565b600e6020526000908152604090205460ff1681565b6040519015158152602001610215565b61023e600c5481565b61023e600a5481565b6102686102c6366004611b26565b6106c6565b6102686102d9366004611b04565b61072f565b61023e7f000000000000000000000000000000000000000000000000000000000000000081565b61023e60045481565b61023e60035481565b60085461032a906001600160a01b031681565b6040516001600160a01b039091168152602001610215565b61023e610350366004611b04565b6107d4565b610268610813565b61023e61036b366004611b50565b610849565b61032a7f000000000000000000000000000000000000000000000000000000000000000081565b6007546001600160a01b031661032a565b6103cf6103b6366004611b04565b6006602052600090815260409020805460019091015482565b60408051928352602083019190915201610215565b6102686103f2366004611b50565b610881565b61023e60015481565b61023e670de0b6b3a764000081565b61026861041d366004611b50565b61099f565b610268610430366004611b77565b6109a8565b6102686109fa565b610268610a83565b61023e60095481565b61032a7f000000000000000000000000000000000000000000000000000000000000000081565b61023e600b5481565b610268610a9b565b61023e60025481565b61026861049d366004611b04565b610b3c565b600854604080516306fdde0360e01b815290516060926001600160a01b0316916306fdde03916004808301926000929190829003018186803b1580156104e757600080fd5b505afa1580156104fb573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526105239190810190611bc4565b905090565b6001600160a01b0381166000908152600e6020526040902054819060ff166105ac5760405162461bcd60e51b815260206004820152602c60248201527f65786974416e645472616e736665723a3a7265636569766572206973206e6f7460448201526b081dda1a5d195b1a5cdd195960a21b60648201526084015b60405180910390fd5b60005442116105cd5760405162461bcd60e51b81526004016105a390611c71565b6105d5610bd4565b6105dd610cbe565b60006105e8336107d4565b9050806105f457505050565b336000908152600d6020526040902054600a546106119190611cef565b600a55336000908152600d60205260408120556106587f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168483610da7565b604051633c323a1b60e01b8152336004820152602481018290526001600160a01b03841690633c323a1b90604401600060405180830381600087803b1580156106a057600080fd5b505af11580156106b4573d6000803e3d6000fd5b505050506106c0610cbe565b505b5050565b818160006106d3836107d4565b90507f00000000000000000000000000000000000000000000000000000000000000006107008383611d06565b111561071e5760405162461bcd60e51b81526004016105a390611d1e565b6107288585610efe565b5050505050565b6007546001600160a01b031633146107595760405162461bcd60e51b81526004016105a390611d66565b6008546001600160a01b0316156107b25760405162461bcd60e51b815260206004820152601760248201527f52657761726420706f6f6c20616c72656164792073657400000000000000000060448201526064016105a3565b600880546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b0381166000908152600d6020526040812054600954670de0b6b3a76400009161080391611d9b565b61080d9190611dd0565b92915050565b6007546001600160a01b0316331461083d5760405162461bcd60e51b81526004016105a390611d66565b6108476000610fcd565b565b3360009081526006602052604081206002810180548490811061086e5761086e611de4565b9060005260206000200154915050919050565b6007546001600160a01b031633146108ab5760405162461bcd60e51b81526004016105a390611d66565b6008546040805163a85adeab60e01b8152905183926001600160a01b03169163a85adeab916004808301926020929190829003018186803b1580156108ef57600080fd5b505afa158015610903573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109279190611dfa565b1461098a5760405162461bcd60e51b815260206004820152602d60248201527f456e642074696d657374616d70206973206e6f74207468652073616d6520617360448201526c081c995dd85c991cc81c1bdbdb609a1b60648201526084016105a3565b6109938161101f565b61099c81611037565b50565b61099c8161109c565b6007546001600160a01b031633146109d25760405162461bcd60e51b81526004016105a390611d66565b6001600160a01b0382166000908152600e60205260409020805460ff19168215151790555050565b6000544211610a1b5760405162461bcd60e51b81526004016105a390611c71565b3360009081526006602052604090206001810154600c54610a3c9190611cef565b600c5560408051600080825260208201909252610a7b917f000000000000000000000000000000000000000000000000000000000000000091906110fd565b61099c610cbe565b610a8b610bd4565b610a93610cbe565b61084761134a565b6000544211610abc5760405162461bcd60e51b81526004016105a390611c71565b610ac4610bd4565b610acc610cbe565b6000610ad7336107d4565b905080610ae15750565b336000908152600d6020526040902054600a54610afe9190611cef565b600a55336000908152600d6020526040812055600c54610b1f908290611d06565b600c55604080516000815260208101909152610a7b908290611560565b6007546001600160a01b03163314610b665760405162461bcd60e51b81526004016105a390611d66565b6001600160a01b038116610bcb5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105a3565b61099c81610fcd565b6008546040516370a0823160e01b81523060048201526001600160a01b03909116906370a082319060240160206040518083038186803b158015610c1757600080fd5b505afa158015610c2b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c4f9190611dfa565b1561084757600860009054906101000a90046001600160a01b03166001600160a01b031663e9fad8ee6040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610ca457600080fd5b505af1158015610cb8573d6000803e3d6000fd5b50505050565b600a54610cd8576000600b55670de0b6b3a7640000600955565b600c546040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a082319060240160206040518083038186803b158015610d3a57600080fd5b505afa158015610d4e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d729190611dfa565b610d7c9190611cef565b600b819055600a5490610d9890670de0b6b3a764000090611d9b565b610da29190611dd0565b600955565b801580610e305750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e9060440160206040518083038186803b158015610df657600080fd5b505afa158015610e0a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e2e9190611dfa565b155b610e9b5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084016105a3565b6040516001600160a01b0383166024820152604481018290526106c090849063095ea7b360e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611660565b60008111610f5c5760405162461bcd60e51b815260206004820152602560248201527f5374616b6552656365697665724175746f5374616b653a204e6f207374616b65604482015264081cd95b9d60da1b60648201526084016105a3565b6001600160a01b038216610fc15760405162461bcd60e51b815260206004820152602660248201527f5374616b6552656365697665724175746f5374616b653a20496e76616c69642060448201526539ba30b5b2b960d11b60648201526084016105a3565b6106c2818360006117e0565b600780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60058190556003546110319082611d06565b60015550565b4281116110975760405162461bcd60e51b815260206004820152602860248201527f6c6f636b3a3a4c6f636b20656e64206e6565647320746f20626520696e207468604482015267652066757475726560c01b60648201526084016105a3565b600055565b338160006110a9836107d4565b90507f00000000000000000000000000000000000000000000000000000000000000006110d68383611d06565b11156110f45760405162461bcd60e51b81526004016105a390611d1e565b610cb88461191c565b3360009081526006602052604090208054421161116c5760405162461bcd60e51b815260206004820152602760248201527f66696e616c697a65457869743a3a20547279696e6720746f206578697420746f6044820152666f206561726c7960c81b60648201526084016105a3565b600181018054600090915561118b6001600160a01b0386163383611928565b60005b84518110156113095760008360020182815481106111ae576111ae611de4565b9060005260206000200154905060008460020183815481106111d2576111d2611de4565b9060005260206000200181905550846001600160a01b03168683815181106111fc576111fc611de4565b60200260200101516001600160a01b031614156112bf5785828151811061122557611225611de4565b60200260200101516001600160a01b0316632e1a7d4d826040518263ffffffff1660e01b815260040161125a91815260200190565b600060405180830381600087803b15801561127457600080fd5b505af1158015611288573d6000803e3d6000fd5b505060405133925083156108fc02915083906000818181858888f193505050501580156112b9573d6000803e3d6000fd5b506112f6565b6112f633828885815181106112d6576112d6611de4565b60200260200101516001600160a01b03166119289092919063ffffffff16565b508061130181611e13565b91505061118e565b5060408051338152602081018390527f548aea05c5e3b6ba34acdf7b3ad06c7bb667ed71d1761e2c177167be0a9eb059910160405180910390a15050505050565b6040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a082319060240160206040518083038186803b1580156113a957600080fd5b505afa1580156113bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113e19190611dfa565b1561084757600c546040516370a0823160e01b8152306004820152600091906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a082319060240160206040518083038186803b15801561144c57600080fd5b505afa158015611460573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114849190611dfa565b61148e9190611cef565b6008549091506114cc906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811691166000610da7565b600854611506906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116911683610da7565b60085460405163534a7e1d60e11b8152600481018390526001600160a01b039091169063a694fc3a90602401600060405180830381600087803b15801561154c57600080fd5b505af1158015610728573d6000803e3d6000fd5b805161156c3382611958565b336000908152600660205260409020611584846119b8565b81556001810154611596908590611d06565b600182015560005b8281101561161d578381815181106115b8576115b8611de4565b60200260200101518260020182815481106115d5576115d5611de4565b90600052602060002001546115ea9190611d06565b8260020182815481106115ff576115ff611de4565b6000918252602090912001558061161581611e13565b91505061159e565b5080546040805133815260208101929092527fd9217a461a0f7f84171a8866118c3d92e943ba7c1ba89b819371f729b5cabcbc910160405180910390a150505050565b6001600160a01b0382163b6116b75760405162461bcd60e51b815260206004820152601f60248201527f5361666545524332303a2063616c6c20746f206e6f6e2d636f6e74726163740060448201526064016105a3565b600080836001600160a01b0316836040516116d29190611e2e565b6000604051808303816000865af19150503d806000811461170f576040519150601f19603f3d011682016040523d82523d6000602084013e611714565b606091505b5091509150816117665760405162461bcd60e51b815260206004820181905260248201527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656460448201526064016105a3565b805115610cb857808060200190518101906117819190611e4a565b610cb85760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105a3565b6117e8610bd4565b6117f0610cbe565b611832816117fe5733611800565b825b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016903086611a51565b60095460009061184a670de0b6b3a764000086611d9b565b6118549190611dd0565b905080600a546118649190611d06565b600a556001600160a01b0383166000908152600d602052604090205461188b908290611d06565b6001600160a01b0384166000908152600d60205260409020556009546118af610cbe565b836001600160a01b03167f6381ea17a5324d29cc015352644672ead5185c1c61a0d3a521eda97e35cec97e8684846009546118e98a6107d4565b604080519586526020860194909452928401919091526060830152608082015260a00160405180910390a261072861134a565b61099c813360016117e0565b6040516001600160a01b0383166024820152604481018290526106c090849063a9059cbb60e01b90606401610ec7565b6001600160a01b0382166000908152600660205260409020600281015482141561198157505050565b60028101545b82811015610cb8576002820180546001810182556000918252602082200155806119b081611e13565b915050611987565b6001546000904290811115611a11576000600354600154836119da9190611cef565b6119e49190611e67565b6003549091506119f48284611cef565b6119fe9190611d06565b6001819055600294909455509192915050565b82600254611a1f9190611d06565b600255600154915060045460025410611a4b57600354600154611a429190611d06565b60015560006002555b50919050565b6040516001600160a01b0380851660248301528316604482015260648101829052610cb89085906323b872dd60e01b90608401610ec7565b60005b83811015611aa4578181015183820152602001611a8c565b83811115610cb85750506000910152565b6020815260008251806020840152611ad4816040850160208701611a89565b601f01601f19169190910160400192915050565b80356001600160a01b0381168114611aff57600080fd5b919050565b600060208284031215611b1657600080fd5b611b1f82611ae8565b9392505050565b60008060408385031215611b3957600080fd5b611b4283611ae8565b946020939093013593505050565b600060208284031215611b6257600080fd5b5035919050565b801515811461099c57600080fd5b60008060408385031215611b8a57600080fd5b611b9383611ae8565b91506020830135611ba381611b69565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600060208284031215611bd657600080fd5b815167ffffffffffffffff80821115611bee57600080fd5b818401915084601f830112611c0257600080fd5b815181811115611c1457611c14611bae565b604051601f8201601f19908116603f01168101908382118183101715611c3c57611c3c611bae565b81604052828152876020848701011115611c5557600080fd5b611c66836020830160208801611a89565b979650505050505050565b60208082526042908201527f6f6e6c79556e6c6f636b65643a3a63616e6e6f7420706572666f726d2074686960408201527f7320616374696f6e20756e74696c2074686520656e64206f6620746865206c6f606082015261636b60f01b608082015260a00190565b634e487b7160e01b600052601160045260246000fd5b600082821015611d0157611d01611cd9565b500390565b60008219821115611d1957611d19611cd9565b500190565b60208082526028908201527f6f6e6c79556e6465725374616b654c696d69743a3a5374616b65206c696d6974604082015267081c995858da195960c21b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6000816000190483118215151615611db557611db5611cd9565b500290565b634e487b7160e01b600052601260045260246000fd5b600082611ddf57611ddf611dba565b500490565b634e487b7160e01b600052603260045260246000fd5b600060208284031215611e0c57600080fd5b5051919050565b6000600019821415611e2757611e27611cd9565b5060010190565b60008251611e40818460208701611a89565b9190910192915050565b600060208284031215611e5c57600080fd5b8151611b1f81611b69565b600082611e7657611e76611dba565b50069056fea2646970667358221220c2d55ebc69116020abd871ec15accfba53444d089bfb452a1f8d4c42630bfa3964736f6c63430008090033";

type CompoundingRewardsPoolStakerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CompoundingRewardsPoolStakerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CompoundingRewardsPoolStaker__factory extends ContractFactory {
  constructor(...args: CompoundingRewardsPoolStakerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    token: string,
    _throttleRoundSeconds: BigNumberish,
    _throttleRoundCap: BigNumberish,
    _stakeLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CompoundingRewardsPoolStaker> {
    return super.deploy(
      token,
      _throttleRoundSeconds,
      _throttleRoundCap,
      _stakeLimit,
      overrides || {}
    ) as Promise<CompoundingRewardsPoolStaker>;
  }
  getDeployTransaction(
    token: string,
    _throttleRoundSeconds: BigNumberish,
    _throttleRoundCap: BigNumberish,
    _stakeLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      token,
      _throttleRoundSeconds,
      _throttleRoundCap,
      _stakeLimit,
      overrides || {}
    );
  }
  attach(address: string): CompoundingRewardsPoolStaker {
    return super.attach(address) as CompoundingRewardsPoolStaker;
  }
  connect(signer: Signer): CompoundingRewardsPoolStaker__factory {
    return super.connect(signer) as CompoundingRewardsPoolStaker__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CompoundingRewardsPoolStakerInterface {
    return new utils.Interface(_abi) as CompoundingRewardsPoolStakerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CompoundingRewardsPoolStaker {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CompoundingRewardsPoolStaker;
  }
}
