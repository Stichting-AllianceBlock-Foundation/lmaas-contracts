/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { StakeReceiver, StakeReceiverInterface } from "../StakeReceiver";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "delegateStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class StakeReceiver__factory {
  static readonly abi = _abi;
  static createInterface(): StakeReceiverInterface {
    return new utils.Interface(_abi) as StakeReceiverInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): StakeReceiver {
    return new Contract(address, _abi, signerOrProvider) as StakeReceiver;
  }
}
