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

export interface StakeReceiverFeatureInterface extends utils.Interface {
  functions: {
    "accumulatedRewardMultiplier(uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "cancel()": FunctionFragment;
    "cancelExtension()": FunctionFragment;
    "claim()": FunctionFragment;
    "contractStakeLimit()": FunctionFragment;
    "delegateStake(address,uint256)": FunctionFragment;
    "endTimestamp()": FunctionFragment;
    "exit()": FunctionFragment;
    "extend(uint256,uint256[])": FunctionFragment;
    "extensionDuration()": FunctionFragment;
    "extensionRewardPerSecond(uint256)": FunctionFragment;
    "getAvailableBalance(uint256)": FunctionFragment;
    "getRewardTokensCount()": FunctionFragment;
    "getUserAccumulatedReward(address,uint256,uint256)": FunctionFragment;
    "getUserOwedTokens(address,uint256)": FunctionFragment;
    "getUserRewardDebt(address,uint256)": FunctionFragment;
    "getUserRewardDebtLength(address)": FunctionFragment;
    "getUserTokensOwedLength(address)": FunctionFragment;
    "hasStakingStarted()": FunctionFragment;
    "name()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardPerSecond(uint256)": FunctionFragment;
    "rewardsTokens(uint256)": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "stakeLimit()": FunctionFragment;
    "stakingToken()": FunctionFragment;
    "start(uint256,uint256,uint256[])": FunctionFragment;
    "startTimestamp()": FunctionFragment;
    "totalStaked()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateRewardMultipliers()": FunctionFragment;
    "userInfo(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
    "withdrawExcessRewards(address)": FunctionFragment;
    "withdrawTokens(address,address)": FunctionFragment;
    "wrappedNativeToken()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accumulatedRewardMultiplier",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "cancel", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "cancelExtension",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "contractStakeLimit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "delegateStake",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "endTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "exit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "extend",
    values: [BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "extensionDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "extensionRewardPerSecond",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableBalance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardTokensCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUserAccumulatedReward",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserOwedTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserRewardDebt",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserRewardDebtLength",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserTokensOwedLength",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasStakingStarted",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerSecond",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "stakeLimit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stakingToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "start",
    values: [BigNumberish, BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "startTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalStaked",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRewardMultipliers",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "userInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawExcessRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTokens",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "wrappedNativeToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "accumulatedRewardMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelExtension",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractStakeLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "delegateStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "endTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "extend", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "extensionDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "extensionRewardPerSecond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardTokensCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserAccumulatedReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserOwedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserRewardDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserRewardDebtLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserTokensOwedLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasStakingStarted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerSecond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardsTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakeLimit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stakingToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "startTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalStaked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRewardMultipliers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "userInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawExcessRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "wrappedNativeToken",
    data: BytesLike
  ): Result;

  events: {
    "Claimed(address,uint256,address)": EventFragment;
    "Exited(address,uint256)": EventFragment;
    "Extended(uint256,uint256,uint256[])": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Staked(address,uint256)": EventFragment;
    "Started(uint256,uint256,uint256[])": EventFragment;
    "Withdrawn(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Exited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Extended"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Started"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export type ClaimedEvent = TypedEvent<
  [string, BigNumber, string],
  { user: string; amount: BigNumber; token: string }
>;

export type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;

export type ExitedEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type ExitedEventFilter = TypedEventFilter<ExitedEvent>;

export type ExtendedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber[]],
  {
    newStartTimestamp: BigNumber;
    newEndTimestamp: BigNumber;
    newRewardsPerSecond: BigNumber[];
  }
>;

export type ExtendedEventFilter = TypedEventFilter<ExtendedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type StakedEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export type StartedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber[]],
  {
    startTimestamp: BigNumber;
    endTimestamp: BigNumber;
    rewardsPerSecond: BigNumber[];
  }
>;

export type StartedEventFilter = TypedEventFilter<StartedEvent>;

export type WithdrawnEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface StakeReceiverFeature extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StakeReceiverFeatureInterface;

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
    accumulatedRewardMultiplier(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOf(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    cancel(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancelExtension(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    contractStakeLimit(overrides?: CallOverrides): Promise<[BigNumber]>;

    delegateStake(
      _staker: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    endTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    extend(
      _durationTime: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    extensionDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    extensionRewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getRewardTokensCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getUserAccumulatedReward(
      _userAddress: string,
      _tokenIndex: BigNumberish,
      _time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserOwedTokens(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserRewardDebt(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserRewardDebtLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserTokensOwedLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    hasStakingStarted(overrides?: CallOverrides): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    rewardsTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    stake(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakeLimit(overrides?: CallOverrides): Promise<[BigNumber]>;

    stakingToken(overrides?: CallOverrides): Promise<[string]>;

    start(
      _startTimestamp: BigNumberish,
      _endTimestamp: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalStaked(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateRewardMultipliers(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        firstStakedTimestamp: BigNumber;
        amountStaked: BigNumber;
      }
    >;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawExcessRewards(
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTokens(
      _recipient: string,
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    wrappedNativeToken(overrides?: CallOverrides): Promise<[string]>;
  };

  accumulatedRewardMultiplier(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOf(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  cancel(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancelExtension(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  contractStakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

  delegateStake(
    _staker: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  endTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  exit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  extend(
    _durationTime: BigNumberish,
    _rewardPerSecond: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  extensionDuration(overrides?: CallOverrides): Promise<BigNumber>;

  extensionRewardPerSecond(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getAvailableBalance(
    _rewardTokenIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getRewardTokensCount(overrides?: CallOverrides): Promise<BigNumber>;

  getUserAccumulatedReward(
    _userAddress: string,
    _tokenIndex: BigNumberish,
    _time: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserOwedTokens(
    _userAddress: string,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserRewardDebt(
    _userAddress: string,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserRewardDebtLength(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserTokensOwedLength(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  hasStakingStarted(overrides?: CallOverrides): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardPerSecond(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  rewardsTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  stake(
    _tokenAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

  stakingToken(overrides?: CallOverrides): Promise<string>;

  start(
    _startTimestamp: BigNumberish,
    _endTimestamp: BigNumberish,
    _rewardPerSecond: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateRewardMultipliers(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      firstStakedTimestamp: BigNumber;
      amountStaked: BigNumber;
    }
  >;

  withdraw(
    _tokenAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawExcessRewards(
    _recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTokens(
    _recipient: string,
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  wrappedNativeToken(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    accumulatedRewardMultiplier(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOf(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cancel(overrides?: CallOverrides): Promise<void>;

    cancelExtension(overrides?: CallOverrides): Promise<void>;

    claim(overrides?: CallOverrides): Promise<void>;

    contractStakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

    delegateStake(
      _staker: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    endTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    exit(overrides?: CallOverrides): Promise<void>;

    extend(
      _durationTime: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    extensionDuration(overrides?: CallOverrides): Promise<BigNumber>;

    extensionRewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRewardTokensCount(overrides?: CallOverrides): Promise<BigNumber>;

    getUserAccumulatedReward(
      _userAddress: string,
      _tokenIndex: BigNumberish,
      _time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserOwedTokens(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserRewardDebt(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserRewardDebtLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserTokensOwedLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasStakingStarted(overrides?: CallOverrides): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    stake(_tokenAmount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    stakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<string>;

    start(
      _startTimestamp: BigNumberish,
      _endTimestamp: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    startTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateRewardMultipliers(overrides?: CallOverrides): Promise<void>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        firstStakedTimestamp: BigNumber;
        amountStaked: BigNumber;
      }
    >;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawExcessRewards(
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTokens(
      _recipient: string,
      _token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    wrappedNativeToken(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Claimed(address,uint256,address)"(
      user?: string | null,
      amount?: null,
      token?: null
    ): ClaimedEventFilter;
    Claimed(
      user?: string | null,
      amount?: null,
      token?: null
    ): ClaimedEventFilter;

    "Exited(address,uint256)"(
      user?: string | null,
      amount?: null
    ): ExitedEventFilter;
    Exited(user?: string | null, amount?: null): ExitedEventFilter;

    "Extended(uint256,uint256,uint256[])"(
      newStartTimestamp?: null,
      newEndTimestamp?: null,
      newRewardsPerSecond?: null
    ): ExtendedEventFilter;
    Extended(
      newStartTimestamp?: null,
      newEndTimestamp?: null,
      newRewardsPerSecond?: null
    ): ExtendedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Staked(address,uint256)"(
      user?: string | null,
      amount?: null
    ): StakedEventFilter;
    Staked(user?: string | null, amount?: null): StakedEventFilter;

    "Started(uint256,uint256,uint256[])"(
      startTimestamp?: null,
      endTimestamp?: null,
      rewardsPerSecond?: null
    ): StartedEventFilter;
    Started(
      startTimestamp?: null,
      endTimestamp?: null,
      rewardsPerSecond?: null
    ): StartedEventFilter;

    "Withdrawn(address,uint256)"(
      user?: string | null,
      amount?: null
    ): WithdrawnEventFilter;
    Withdrawn(user?: string | null, amount?: null): WithdrawnEventFilter;
  };

  estimateGas: {
    accumulatedRewardMultiplier(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOf(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cancel(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancelExtension(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    contractStakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

    delegateStake(
      _staker: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    endTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    extend(
      _durationTime: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    extensionDuration(overrides?: CallOverrides): Promise<BigNumber>;

    extensionRewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRewardTokensCount(overrides?: CallOverrides): Promise<BigNumber>;

    getUserAccumulatedReward(
      _userAddress: string,
      _tokenIndex: BigNumberish,
      _time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserOwedTokens(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserRewardDebt(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserRewardDebtLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserTokensOwedLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasStakingStarted(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stake(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<BigNumber>;

    start(
      _startTimestamp: BigNumberish,
      _endTimestamp: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateRewardMultipliers(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    userInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawExcessRewards(
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTokens(
      _recipient: string,
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    wrappedNativeToken(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    accumulatedRewardMultiplier(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOf(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cancel(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancelExtension(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    contractStakeLimit(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    delegateStake(
      _staker: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    endTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    extend(
      _durationTime: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    extensionDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    extensionRewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRewardTokensCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserAccumulatedReward(
      _userAddress: string,
      _tokenIndex: BigNumberish,
      _time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserOwedTokens(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserRewardDebt(
      _userAddress: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserRewardDebtLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserTokensOwedLength(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasStakingStarted(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardPerSecond(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardsTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stake(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakeLimit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    start(
      _startTimestamp: BigNumberish,
      _endTimestamp: BigNumberish,
      _rewardPerSecond: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalStaked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateRewardMultipliers(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawExcessRewards(
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTokens(
      _recipient: string,
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    wrappedNativeToken(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
