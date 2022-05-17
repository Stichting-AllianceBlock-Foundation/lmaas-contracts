/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface AutoStakeInterface extends utils.Interface {
  functions: {
    "UNIT()": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "campaignEndTimestamp()": FunctionFragment;
    "completeExit()": FunctionFragment;
    "exit()": FunctionFragment;
    "exitInfo(address)": FunctionFragment;
    "exitStake()": FunctionFragment;
    "factory()": FunctionFragment;
    "getPendingReward(uint256)": FunctionFragment;
    "lockEndTimestamp()": FunctionFragment;
    "name()": FunctionFragment;
    "nextAvailableExitTimestamp()": FunctionFragment;
    "nextAvailableRoundExitVolume()": FunctionFragment;
    "owner()": FunctionFragment;
    "refreshAutoStake()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardPool()": FunctionFragment;
    "setPool(address)": FunctionFragment;
    "share(address)": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "stakingToken()": FunctionFragment;
    "start(uint256)": FunctionFragment;
    "throttleRoundCap()": FunctionFragment;
    "throttleRoundSeconds()": FunctionFragment;
    "totalShares()": FunctionFragment;
    "totalValue()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "valuePerShare()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "UNIT", values?: undefined): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "campaignEndTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "completeExit",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "exit", values?: undefined): string;
  encodeFunctionData(functionFragment: "exitInfo", values: [string]): string;
  encodeFunctionData(functionFragment: "exitStake", values?: undefined): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPendingReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lockEndTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "nextAvailableExitTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextAvailableRoundExitVolume",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refreshAutoStake",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPool",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setPool", values: [string]): string;
  encodeFunctionData(functionFragment: "share", values: [string]): string;
  encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "stakingToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "start", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "throttleRoundCap",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "throttleRoundSeconds",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalShares",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "valuePerShare",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "UNIT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "campaignEndTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "completeExit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exitInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exitStake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPendingReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockEndTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nextAvailableExitTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextAvailableRoundExitVolume",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "refreshAutoStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "share", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stakingToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "throttleRoundCap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "throttleRoundSeconds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "totalValue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "valuePerShare",
    data: BytesLike
  ): Result;

  events: {
    "ExitCompleted(address,uint256)": EventFragment;
    "ExitRequested(address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Staked(address,uint256,uint256,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ExitCompleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExitRequested"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
}

export type ExitCompletedEvent = TypedEvent<
  [string, BigNumber],
  { user: string; stake: BigNumber }
>;

export type ExitCompletedEventFilter = TypedEventFilter<ExitCompletedEvent>;

export type ExitRequestedEvent = TypedEvent<
  [string, BigNumber],
  { user: string; exitTimestamp: BigNumber }
>;

export type ExitRequestedEventFilter = TypedEventFilter<ExitRequestedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type StakedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
  {
    user: string;
    amount: BigNumber;
    sharesIssued: BigNumber;
    oldShareVaule: BigNumber;
    newShareValue: BigNumber;
    balanceOf: BigNumber;
  }
>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export interface AutoStake extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AutoStakeInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    UNIT(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOf(_staker: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    campaignEndTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    completeExit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        exitTimestamp: BigNumber;
        exitStake: BigNumber;
      }
    >;

    exitStake(overrides?: CallOverrides): Promise<[BigNumber]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    getPendingReward(
      _tokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    lockEndTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    nextAvailableExitTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    nextAvailableRoundExitVolume(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    refreshAutoStake(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardPool(overrides?: CallOverrides): Promise<[string]>;

    setPool(
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    share(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    stake(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<[string]>;

    start(
      _endTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    throttleRoundCap(overrides?: CallOverrides): Promise<[BigNumber]>;

    throttleRoundSeconds(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalShares(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalValue(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    valuePerShare(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  UNIT(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

  campaignEndTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  completeExit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { exitTimestamp: BigNumber; exitStake: BigNumber }
  >;

  exitStake(overrides?: CallOverrides): Promise<BigNumber>;

  factory(overrides?: CallOverrides): Promise<string>;

  getPendingReward(
    _tokenIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  lockEndTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  nextAvailableExitTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  nextAvailableRoundExitVolume(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  refreshAutoStake(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardPool(overrides?: CallOverrides): Promise<string>;

  setPool(
    _pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  share(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  stake(
    _tokenAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakingToken(overrides?: CallOverrides): Promise<string>;

  start(
    _endTimestamp: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  throttleRoundCap(overrides?: CallOverrides): Promise<BigNumber>;

  throttleRoundSeconds(overrides?: CallOverrides): Promise<BigNumber>;

  totalShares(overrides?: CallOverrides): Promise<BigNumber>;

  totalValue(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  valuePerShare(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    UNIT(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

    campaignEndTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    completeExit(overrides?: CallOverrides): Promise<void>;

    exit(overrides?: CallOverrides): Promise<void>;

    exitInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        exitTimestamp: BigNumber;
        exitStake: BigNumber;
      }
    >;

    exitStake(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<string>;

    getPendingReward(
      _tokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lockEndTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    nextAvailableExitTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    nextAvailableRoundExitVolume(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    refreshAutoStake(overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardPool(overrides?: CallOverrides): Promise<string>;

    setPool(_pool: string, overrides?: CallOverrides): Promise<void>;

    share(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    stake(_tokenAmount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    stakingToken(overrides?: CallOverrides): Promise<string>;

    start(
      _endTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    throttleRoundCap(overrides?: CallOverrides): Promise<BigNumber>;

    throttleRoundSeconds(overrides?: CallOverrides): Promise<BigNumber>;

    totalShares(overrides?: CallOverrides): Promise<BigNumber>;

    totalValue(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    valuePerShare(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "ExitCompleted(address,uint256)"(
      user?: null,
      stake?: null
    ): ExitCompletedEventFilter;
    ExitCompleted(user?: null, stake?: null): ExitCompletedEventFilter;

    "ExitRequested(address,uint256)"(
      user?: null,
      exitTimestamp?: null
    ): ExitRequestedEventFilter;
    ExitRequested(user?: null, exitTimestamp?: null): ExitRequestedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Staked(address,uint256,uint256,uint256,uint256,uint256)"(
      user?: string | null,
      amount?: null,
      sharesIssued?: null,
      oldShareVaule?: null,
      newShareValue?: null,
      balanceOf?: null
    ): StakedEventFilter;
    Staked(
      user?: string | null,
      amount?: null,
      sharesIssued?: null,
      oldShareVaule?: null,
      newShareValue?: null,
      balanceOf?: null
    ): StakedEventFilter;
  };

  estimateGas: {
    UNIT(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

    campaignEndTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    completeExit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    exitStake(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    getPendingReward(
      _tokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lockEndTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    nextAvailableExitTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    nextAvailableRoundExitVolume(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    refreshAutoStake(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardPool(overrides?: CallOverrides): Promise<BigNumber>;

    setPool(
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    share(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    stake(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<BigNumber>;

    start(
      _endTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    throttleRoundCap(overrides?: CallOverrides): Promise<BigNumber>;

    throttleRoundSeconds(overrides?: CallOverrides): Promise<BigNumber>;

    totalShares(overrides?: CallOverrides): Promise<BigNumber>;

    totalValue(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    valuePerShare(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    UNIT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      _staker: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    campaignEndTimestamp(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    completeExit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exitStake(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPendingReward(
      _tokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockEndTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nextAvailableExitTimestamp(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nextAvailableRoundExitVolume(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    refreshAutoStake(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setPool(
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    share(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stake(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    start(
      _endTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    throttleRoundCap(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    throttleRoundSeconds(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalShares(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalValue(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    valuePerShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
