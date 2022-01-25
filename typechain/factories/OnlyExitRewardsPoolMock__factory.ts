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
  OnlyExitRewardsPoolMock,
  OnlyExitRewardsPoolMockInterface,
} from "../OnlyExitRewardsPoolMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20Detailed",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTimestamp",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_rewardsTokens",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_stakeLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_contractStakeLimit",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "Claimed",
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
    ],
    name: "Exited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newStartTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newEndTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "newRewardsPerSecond",
        type: "uint256[]",
      },
    ],
    name: "Extended",
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
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "rewardsPerSecond",
        type: "uint256[]",
      },
    ],
    name: "Started",
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
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "accumulatedRewardMultiplier",
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
        name: "_userAddress",
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
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelExtension",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractStakeLimit",
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
    name: "endTimestamp",
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
    name: "exit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_durationTime",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_rewardPerSecond",
        type: "uint256[]",
      },
    ],
    name: "extend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "extensionDuration",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "extensionRewardPerSecond",
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
        name: "_rewardTokenIndex",
        type: "uint256",
      },
    ],
    name: "getAvailableBalance",
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
    name: "getRewardTokensCount",
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
        name: "_userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_time",
        type: "uint256",
      },
    ],
    name: "getUserAccumulatedReward",
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
        name: "_userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getUserOwedTokens",
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
        name: "_userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getUserRewardDebt",
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
        name: "_userAddress",
        type: "address",
      },
    ],
    name: "getUserRewardDebtLength",
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
        name: "_userAddress",
        type: "address",
      },
    ],
    name: "getUserTokensOwedLength",
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
    name: "hasStakingStarted",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rewardPerSecond",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "rewardsTokens",
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
        name: "_startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_rewardPerSecond",
        type: "uint256[]",
      },
    ],
    name: "start",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTimestamp",
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
    name: "totalStaked",
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
    name: "updateRewardMultipliers",
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
    name: "userInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "firstStakedTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountStaked",
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
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "withdrawExcessRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002e3338038062002e338339810160408190526200003491620004d7565b8684848484620000443362000292565b6001600160a01b038516620000af5760405162461bcd60e51b815260206004820152602660248201527f52657761726473506f6f6c426173653a20696e76616c6964207374616b696e67604482015265103a37b5b2b760d11b60648201526084015b60405180910390fd5b8215801590620000be57508115155b620001185760405162461bcd60e51b8152602060048201526024808201527f52657761726473506f6f6c426173653a20696e76616c6964207374616b65206c6044820152631a5b5a5d60e21b6064820152608401620000a6565b6000845111620001775760405162461bcd60e51b8152602060048201526024808201527f52657761726473506f6f6c426173653a20656d7074792072657761726473546f6044820152636b656e7360e01b6064820152608401620000a6565b600680546001600160a01b0319166001600160a01b0387161790558351620001a7906005906020870190620002e2565b50600d839055600e82905560005b6005548110156200026957600c8054600181810190925560007fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c7909101819055600280548084019091557f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0181905560038054928301815581527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b90910155806200026081620005fc565b915050620001b5565b5080516200027f90600f9060208401906200034c565b5050505050505050505050505062000663565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b8280548282559060005260206000209081019282156200033a579160200282015b828111156200033a57825182546001600160a01b0319166001600160a01b0390911617825560209092019160019091019062000303565b5062000348929150620003c9565b5090565b8280546200035a9062000626565b90600052602060002090601f0160209004810192826200037e57600085556200033a565b82601f106200039957805160ff19168380011785556200033a565b828001600101855582156200033a579182015b828111156200033a578251825591602001919060010190620003ac565b5b80821115620003485760008155600101620003ca565b6001600160a01b0381168114620003f657600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156200043a576200043a620003f9565b604052919050565b600082601f8301126200045457600080fd5b81516001600160401b03811115620004705762000470620003f9565b602062000486601f8301601f191682016200040f565b82815285828487010111156200049b57600080fd5b60005b83811015620004bb5785810183015182820184015282016200049e565b83811115620004cd5760008385840101525b5095945050505050565b600080600080600080600060e0888a031215620004f357600080fd5b87516200050081620003e0565b60208981015160408b015160608c0151939a509098509650906001600160401b03808211156200052f57600080fd5b818b0191508b601f8301126200054457600080fd5b815181811115620005595762000559620003f9565b8060051b6200056a8582016200040f565b918252838101850191858101908f8411156200058557600080fd5b948601945b83861015620005b35785519250620005a283620003e0565b82825294860194908601906200058a565b809a505050505060808b0151955060a08b0151945060c08b0151925080831115620005dd57600080fd5b5050620005ed8a828b0162000442565b91505092959891949750929550565b60006000198214156200061f57634e487b7160e01b600052601160045260246000fd5b5060010190565b600181811c908216806200063b57607f821691505b602082108114156200065d57634e487b7160e01b600052602260045260246000fd5b50919050565b6127c080620006736000396000f3fe608060405234801561001057600080fd5b506004361061021b5760003560e01c8063869d8ead11610125578063ce415302116100ad578063ea8a1af01161007c578063ea8a1af014610495578063f27d02641461049d578063f2fde38b146104b0578063fb58cad1146104c3578063fd67fd7c146104d657600080fd5b8063ce41530214610469578063dd2da2201461047c578063e6fd48bc14610484578063e9fad8ee1461048d57600080fd5b8063a694fc3a116100f4578063a694fc3a14610414578063a85adeab14610427578063aabef0db14610430578063b6d0dcd814610443578063c97559ce1461045657600080fd5b8063869d8ead146103b15780638da5cb5b146103c4578063a1292aea146103d5578063a522ad251461040157600080fd5b806345ef79af116101a85780636c32bf69116101775780636c32bf691461033657806370a0823114610349578063715018a61461037557806372f702f31461037d578063817b1cd2146103a857600080fd5b806345ef79af146102fa5780634e71d92d1461030357806357b4f01f1461030b578063602e007a1461032357600080fd5b80632037424b116101ef5780632037424b146102b95780632af9b070146102c25780632c3f455c146102cc5780632d9e88e1146102df5780632e1a7d4d146102e757600080fd5b806284c9271461022057806303d1dae01461025f57806306fdde03146102685780631959a0021461027d575b600080fd5b61024c61022e366004612296565b6001600160a01b031660009081526010602052604090206002015490565b6040519081526020015b60405180910390f35b61024c600e5481565b6102706104e9565b60405161025691906122e4565b6102a461028b366004612296565b6010602052600090815260409020805460019091015482565b60408051928352602083019190915201610256565b61024c600a5481565b6102ca610577565b005b6102ca6102da366004612296565b6106a1565b60055461024c565b6102ca6102f5366004612317565b610738565b61024c600d5481565b6102ca610744565b61031361074c565b6040519015158152602001610256565b61024c610331366004612317565b610766565b6102ca610344366004612346565b610787565b61024c610357366004612296565b6001600160a01b031660009081526010602052604090206001015490565b6102ca6109b7565b600654610390906001600160a01b031681565b6040516001600160a01b039091168152602001610256565b61024c60015481565b6102ca6103bf366004612410565b6109eb565b6000546001600160a01b0316610390565b61024c6103e3366004612296565b6001600160a01b031660009081526010602052604090206003015490565b6102ca61040f366004612493565b610a27565b6102ca610422366004612317565b610c57565b61024c60085481565b61024c61043e366004612317565b610c63565b610390610451366004612317565b610e16565b61024c6104643660046124c6565b610e40565b61024c6104773660046124f9565b610f93565b6102ca610fd5565b61024c60075481565b6102ca61106f565b6102ca611078565b61024c6104ab3660046124f9565b611123565b6102ca6104be366004612296565b611151565b61024c6104d1366004612317565b6111e9565b61024c6104e4366004612317565b6111f9565b600f80546104f690612523565b80601f016020809104026020016040519081016040528092919081815260200182805461052290612523565b801561056f5780601f106105445761010080835404028352916020019161056f565b820191906000526020600020905b81548152906001019060200180831161055257829003601f168201915b505050505081565b6000546001600160a01b031633146105aa5760405162461bcd60e51b81526004016105a19061255e565b60405180910390fd5b6000600a54116106155760405162461bcd60e51b815260206004820152603060248201527f52657761726473506f6f6c426173653a207468657265206973206e6f2065787460448201526f195b9cda5bdb881cd8da19591d5b195960821b60648201526084016105a1565b600854421061068c5760405162461bcd60e51b815260206004820152603d60248201527f52657761726473506f6f6c426173653a2063616e6e6f742063616e63656c206560448201527f7874656e73696f6e20616674657220697420686173207374617274656400000060648201526084016105a1565b6000600a81905561069f90600b906121c1565b565b6000546001600160a01b031633146106cb5760405162461bcd60e51b81526004016105a19061255e565b60055460005b818110156107335760006106e482610c63565b905080156107205761072084826005858154811061070457610704612593565b6000918252602090912001546001600160a01b03169190611209565b508061072b816125bf565b9150506106d1565b505050565b6107418161126c565b50565b61069f6112da565b60008060075411801561076157506007544210155b905090565b600b818154811061077657600080fd5b600091825260209091200154905081565b6000546001600160a01b031633146107b15760405162461bcd60e51b81526004016105a19061255e565b600a54156108185760405162461bcd60e51b815260206004820152602e60248201527f52657761726473506f6f6c426173653a20746865726520697320616c7265616460448201526d3c9030b71032bc3a32b739b4b7b760911b60648201526084016105a1565b600082116108815760405162461bcd60e51b815260206004820152603060248201527f52657761726473506f6f6c426173653a206475726174696f6e206d757374206260448201526f0652067726561746572207468616e20360841b60648201526084016105a1565b805160055481146108a45760405162461bcd60e51b81526004016105a1906125da565b60085460006108b38583612622565b905060005b838110156109705760006108e684848885815181106108d9576108d9612593565b6020026020010151611348565b905060006108f383610c63565b90508181101561095b5760405162461bcd60e51b815260206004820152602d60248201527f52657761726473506f6f6c426173653a206e6f7420656e6f756768207265776160448201526c1c991cc81d1bc8195e1d195b99609a1b60648201526084016105a1565b50508080610968906125bf565b9150506108b8565b5060085442111561099657610986600854611361565b610991828286611474565b6109b0565b600a85905583516109ae90600b9060208701906121df565b505b5050505050565b6000546001600160a01b031633146109e15760405162461bcd60e51b81526004016105a19061255e565b61069f6000611570565b6000546001600160a01b03163314610a155760405162461bcd60e51b81526004016105a19061255e565b610a21848484846115c0565b50505050565b6000546001600160a01b03163314610a515760405162461bcd60e51b81526004016105a19061255e565b6040516370a0823160e01b81523060048201526000906001600160a01b038316906370a082319060240160206040518083038186803b158015610a9357600080fd5b505afa158015610aa7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610acb919061263a565b905060008111610b1d5760405162461bcd60e51b815260206004820152601b60248201527f52657761726473506f6f6c426173653a206e6f2072657761726473000000000060448201526064016105a1565b6006546001600160a01b0383811691161415610b925760405162461bcd60e51b815260206004820152602e60248201527f52657761726473506f6f6c426173653a2063616e6e6f7420776974686472617760448201526d1039ba30b5b4b733903a37b5b2b760911b60648201526084016105a1565b60055460005b81811015610c425760058181548110610bb357610bb3612593565b6000918252602090912001546001600160a01b0385811691161415610c305760405162461bcd60e51b815260206004820152602d60248201527f52657761726473506f6f6c426173653a2063616e6e6f7420776974686472617760448201526c103932bbb0b932103a37b5b2b760991b60648201526084016105a1565b80610c3a816125bf565b915050610b98565b50610a216001600160a01b0384168584611209565b61074181336001611831565b60008060058381548110610c7957610c79612593565b60009182526020822001546040516370a0823160e01b81523060048201526001600160a01b03909116925082906370a082319060240160206040518083038186803b158015610cc757600080fd5b505afa158015610cdb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cff919061263a565b905060075460001415610d13579392505050565b6000610d4160075460085460048881548110610d3157610d31612593565b9060005260206000200154611348565b600a5490915015610d87576000610d77600854600a54600854610d649190612622565b600b8981548110610d3157610d31612593565b9050610d838183612622565b9150505b600060028681548110610d9c57610d9c612593565b90600052602060002001548260038881548110610dbb57610dbb612593565b9060005260206000200154610dd09190612622565b610dda9190612653565b610de49084612653565b6006549091506001600160a01b0385811691161415610e0d57600154610e0a9082612653565b90505b95945050505050565b60058181548110610e2657600080fd5b6000918252602090912001546001600160a01b0316905081565b6000806008548310610e5457600854610e56565b825b9050600060095482610e689190612653565b9050600060048681548110610e7f57610e7f612593565b906000526020600020015482610e95919061266a565b90506000600154670de0b6b3a764000083610eb0919061266a565b610eba9190612689565b9050600081600c8981548110610ed257610ed2612593565b9060005260206000200154610ee79190612622565b6001600160a01b038a166000908152601060205260408120600181015492935091670de0b6b3a764000090610f1d90859061266a565b610f279190612689565b90506000826002018b81548110610f4057610f40612593565b906000526020600020015482610f569190612653565b905080836003018c81548110610f6e57610f6e612593565b9060005260206000200154610f839190612622565b9c9b505050505050505050505050565b6001600160a01b038216600090815260106020526040812060038101805484908110610fc157610fc1612593565b906000526020600020015491505092915050565b600854429081118015610fea57506000600a54115b1561106657610ffa600854611361565b611066600854600a546008546110109190612622565b600b80548060200260200160405190810160405280929190818152602001828054801561105c57602002820191906000526020600020905b815481526020019060010190808311611048575b5050505050611474565b61074181611361565b61069f33611b11565b6000546001600160a01b031633146110a25760405162461bcd60e51b81526004016105a19061255e565b60075442106111125760405162461bcd60e51b815260206004820152603660248201527f52657761726473506f6f6c426173653a204e6f207374617274207363686564756044820152751b1959081bdc88185b1c9958591e481cdd185c9d195960521b60648201526084016105a1565b600060078190556008819055600955565b6001600160a01b038216600090815260106020526040812060028101805484908110610fc157610fc1612593565b6000546001600160a01b0316331461117b5760405162461bcd60e51b81526004016105a19061255e565b6001600160a01b0381166111e05760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105a1565b61074181611570565b600c818154811061077657600080fd5b6004818154811061077657600080fd5b6040516001600160a01b03831660248201526044810182905261073390849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611b7f565b60405162461bcd60e51b815260206004820152603f60248201527f4f6e6c7945786974466561747572653a3a63616e6e6f7420776974686472617760448201527f2066726f6d207468697320636f6e74726163742e204f6e6c7920657869742e0060648201526084016105a1565b60405162461bcd60e51b815260206004820152603c60248201527f4f6e6c7945786974466561747572653a3a63616e6e6f7420636c61696d20667260448201527f6f6d207468697320636f6e74726163742e204f6e6c7920657869742e0000000060648201526084016105a1565b6000806113558585612653565b9050610e0d818461266a565b600954811161136d5750565b6000600854821061138057600854611382565b815b90506000600954826113949190612653565b9050806113a057505050565b6001546113ae575060095550565b60055460005b8181101561146b576000600482815481106113d1576113d1612593565b9060005260206000200154846113e7919061266a565b90506000600154670de0b6b3a764000083611402919061266a565b61140c9190612689565b905080600c848154811061142257611422612593565b90600052602060002001546114379190612622565b600c848154811061144a5761144a612593565b60009182526020909120015550819050611463816125bf565b9150506113b4565b50505060095550565b60045460005b818110156114fd5760006114a060075460085460048581548110610d3157610d31612593565b905080600383815481106114b6576114b6612593565b90600052602060002001546114cb9190612622565b600383815481106114de576114de612593565b60009182526020909120015550806114f5816125bf565b91505061147a565b5081516115119060049060208501906121df565b50600784905560088390556000600a81905561152f90600b906121c1565b7fd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363848484604051611562939291906126ab565b60405180910390a150505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600754156116105760405162461bcd60e51b815260206004820181905260248201527f52657761726473506f6f6c426173653a20616c7265616479207374617274656460448201526064016105a1565b42841015801561161f57508383115b6116795760405162461bcd60e51b815260206004820152602560248201527f52657761726473506f6f6c426173653a20696e76616c6964207374617274206f6044820152641c88195b9960da1b60648201526084016105a1565b600554811461169a5760405162461bcd60e51b81526004016105a1906125da565b6116a66004838361222a565b5060055460005b818110156117dd5760006116cf878760048581548110610d3157610d31612593565b90506000600583815481106116e6576116e6612593565b6000918252602090912001546040516370a0823160e01b81523060048201526001600160a01b03909116906370a082319060240160206040518083038186803b15801561173257600080fd5b505afa158015611746573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061176a919061263a565b9050818110156117c85760405162461bcd60e51b815260206004820152602360248201527f52657761726473506f6f6c426173653a206e6f7420656e6f756768207265776160448201526272647360e81b60648201526084016105a1565b505080806117d5906125bf565b9150506116ad565b506007859055600884905560098590556040517f74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a906118229087908790600490612700565b60405180910390a15050505050565b600754429015801590611845575060075481115b80156118605750600a5460085461185c9190612622565b8111155b6118f15760405162461bcd60e51b815260206004820152605660248201527f52657761726473506f6f6c426173653a207374616b696e67206973206e6f742060448201527f73746172746564206f722069732066696e6973686564206f72206e6f20657874606482015275656e73696f6e2074616b696e6720696e20706c61636560501b608482015260a4016105a1565b6001600160a01b0383166000908152601060205260409020600d54600182015461191c908790612622565b111580156119395750600e54856001546119369190612622565b11155b6119915760405162461bcd60e51b8152602060048201526024808201527f52657761726473506f6f6c426173653a207374616b65206c696d69742072656160448201526318da195960e21b60648201526084016105a1565b600085116119e15760405162461bcd60e51b815260206004820152601f60248201527f52657761726473506f6f6c426173653a2063616e6e6f74207374616b6520300060448201526064016105a1565b60018101546119ee578181555b6119f6610fd5565b6119ff84611cff565b848160010154611a0f9190612622565b816001018190555084600154611a259190612622565b60015560055460005b81811015611aa957670de0b6b3a7640000600c8281548110611a5257611a52612593565b90600052602060002001548460010154611a6c919061266a565b611a769190612689565b836002018281548110611a8b57611a8b612593565b60009182526020909120015580611aa1816125bf565b915050611a2e565b50846001600160a01b03167f9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d87604051611ae591815260200190565b60405180910390a26109ae84611afb5733611afd565b855b6006546001600160a01b0316903089611e89565b6001600160a01b0381166000818152601060209081526040918290206001810154925192835292917f920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a910160405180910390a2611b6d82611ec1565b611b7b816001015483612032565b5050565b6001600160a01b0382163b611bd65760405162461bcd60e51b815260206004820152601f60248201527f5361666545524332303a2063616c6c20746f206e6f6e2d636f6e74726163740060448201526064016105a1565b600080836001600160a01b031683604051611bf1919061274c565b6000604051808303816000865af19150503d8060008114611c2e576040519150601f19603f3d011682016040523d82523d6000602084013e611c33565b606091505b509150915081611c855760405162461bcd60e51b815260206004820181905260248201527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656460448201526064016105a1565b805115610a215780806020019051810190611ca09190612768565b610a215760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105a1565b6001600160a01b03811660009081526010602052604090206005546002820154611d715760005b81811015611d6f57600283018054600181810183556000928352602080842090920183905560038601805491820181558352908220015580611d67816125bf565b915050611d26565b505b6001820154611d7f57505050565b60005b81811015610a21576000670de0b6b3a7640000600c8381548110611da857611da8612593565b90600052602060002001548560010154611dc2919061266a565b611dcc9190612689565b90506000846002018381548110611de557611de5612593565b906000526020600020015482611dfb9190612653565b90508015611e745780856003018481548110611e1957611e19612593565b9060005260206000200154611e2e9190612622565b856003018481548110611e4357611e43612593565b906000526020600020018190555081856002018481548110611e6757611e67612593565b6000918252602090912001555b50508080611e81906125bf565b915050611d82565b6040516001600160a01b0380851660248301528316604482015260648101829052610a219085906323b872dd60e01b90608401611235565b6001600160a01b0381166000908152601060205260409020611ee1610fd5565b611eea82611cff565b60055460005b81811015610a21576000836003018281548110611f0f57611f0f612593565b906000526020600020015490506000846003018381548110611f3357611f33612593565b90600052602060002001819055508060028381548110611f5557611f55612593565b9060005260206000200154611f6a9190612622565b60028381548110611f7d57611f7d612593565b9060005260206000200181905550846001600160a01b03167f7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e8260058581548110611fca57611fca612593565b600091825260209091200154604051611fff92916001600160a01b0316909182526001600160a01b0316602082015260400190565b60405180910390a261201f85826005858154811061070457610704612593565b508061202a816125bf565b915050611ef0565b6000821161208d5760405162461bcd60e51b815260206004820152602260248201527f52657761726473506f6f6c426173653a2063616e6e6f74207769746864726177604482015261020360f41b60648201526084016105a1565b6001600160a01b03811660009081526010602052604090206120ad610fd5565b6120b682611cff565b8281600101546120c69190612653565b8160010181905550826001546120dc9190612653565b60015560055460005b81811015612166576000670de0b6b3a7640000600c838154811061210b5761210b612593565b90600052602060002001548560010154612125919061266a565b61212f9190612689565b90508084600201838154811061214757612147612593565b600091825260209091200155508061215e816125bf565b9150506120e5565b50826001600160a01b03167f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5856040516121a291815260200190565b60405180910390a2600654610a21906001600160a01b03168486611209565b50805460008255906000526020600020908101906107419190612265565b82805482825590600052602060002090810192821561221a579160200282015b8281111561221a5782518255916020019190600101906121ff565b50612226929150612265565b5090565b82805482825590600052602060002090810192821561221a579160200282015b8281111561221a57823582559160200191906001019061224a565b5b808211156122265760008155600101612266565b80356001600160a01b038116811461229157600080fd5b919050565b6000602082840312156122a857600080fd5b6122b18261227a565b9392505050565b60005b838110156122d35781810151838201526020016122bb565b83811115610a215750506000910152565b60208152600082518060208401526123038160408501602087016122b8565b601f01601f19169190910160400192915050565b60006020828403121561232957600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561235957600080fd5b8235915060208084013567ffffffffffffffff8082111561237957600080fd5b818601915086601f83011261238d57600080fd5b81358181111561239f5761239f612330565b8060051b604051601f19603f830116810181811085821117156123c4576123c4612330565b6040529182528482019250838101850191898311156123e257600080fd5b938501935b82851015612400578435845293850193928501926123e7565b8096505050505050509250929050565b6000806000806060858703121561242657600080fd5b8435935060208501359250604085013567ffffffffffffffff8082111561244c57600080fd5b818701915087601f83011261246057600080fd5b81358181111561246f57600080fd5b8860208260051b850101111561248457600080fd5b95989497505060200194505050565b600080604083850312156124a657600080fd5b6124af8361227a565b91506124bd6020840161227a565b90509250929050565b6000806000606084860312156124db57600080fd5b6124e48461227a565b95602085013595506040909401359392505050565b6000806040838503121561250c57600080fd5b6125158361227a565b946020939093013593505050565b600181811c9082168061253757607f821691505b6020821081141561255857634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006000198214156125d3576125d36125a9565b5060010190565b60208082526028908201527f52657761726473506f6f6c426173653a20696e76616c69642072657761726450604082015267195c94d958dbdb9960c21b606082015260800190565b60008219821115612635576126356125a9565b500190565b60006020828403121561264c57600080fd5b5051919050565b600082821015612665576126656125a9565b500390565b6000816000190483118215151615612684576126846125a9565b500290565b6000826126a657634e487b7160e01b600052601260045260246000fd5b500490565b6000606082018583526020858185015260606040850152818551808452608086019150828701935060005b818110156126f2578451835293830193918301916001016126d6565b509098975050505050505050565b60006060820185835260208581850152606060408501528185548084526080860191508660005282600020935060005b818110156126f257845483526001948501949284019201612730565b6000825161275e8184602087016122b8565b9190910192915050565b60006020828403121561277a57600080fd5b815180151581146122b157600080fdfea2646970667358221220ca4b2d5dbd4f6798a06c3a604c8080f2bdba0793988aef54bdf6b1c868d8941e64736f6c63430008090033";

type OnlyExitRewardsPoolMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OnlyExitRewardsPoolMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OnlyExitRewardsPoolMock__factory extends ContractFactory {
  constructor(...args: OnlyExitRewardsPoolMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    _stakingToken: string,
    _startTimestamp: BigNumberish,
    _endTimestamp: BigNumberish,
    _rewardsTokens: string[],
    _stakeLimit: BigNumberish,
    _contractStakeLimit: BigNumberish,
    _name: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OnlyExitRewardsPoolMock> {
    return super.deploy(
      _stakingToken,
      _startTimestamp,
      _endTimestamp,
      _rewardsTokens,
      _stakeLimit,
      _contractStakeLimit,
      _name,
      overrides || {}
    ) as Promise<OnlyExitRewardsPoolMock>;
  }
  getDeployTransaction(
    _stakingToken: string,
    _startTimestamp: BigNumberish,
    _endTimestamp: BigNumberish,
    _rewardsTokens: string[],
    _stakeLimit: BigNumberish,
    _contractStakeLimit: BigNumberish,
    _name: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _stakingToken,
      _startTimestamp,
      _endTimestamp,
      _rewardsTokens,
      _stakeLimit,
      _contractStakeLimit,
      _name,
      overrides || {}
    );
  }
  attach(address: string): OnlyExitRewardsPoolMock {
    return super.attach(address) as OnlyExitRewardsPoolMock;
  }
  connect(signer: Signer): OnlyExitRewardsPoolMock__factory {
    return super.connect(signer) as OnlyExitRewardsPoolMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OnlyExitRewardsPoolMockInterface {
    return new utils.Interface(_abi) as OnlyExitRewardsPoolMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OnlyExitRewardsPoolMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as OnlyExitRewardsPoolMock;
  }
}
