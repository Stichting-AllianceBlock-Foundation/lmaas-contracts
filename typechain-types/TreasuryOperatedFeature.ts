/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface TreasuryOperatedFeatureInterface
  extends ethers.utils.Interface {
  functions: {
    "accumulatedRewardMultiplier(uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "claim()": FunctionFragment;
    "contractStakeLimit()": FunctionFragment;
    "endTimestamp()": FunctionFragment;
    "exit()": FunctionFragment;
    "extend(uint256,uint256[])": FunctionFragment;
    "externalRewardToken()": FunctionFragment;
    "externalRewards(address)": FunctionFragment;
    "getAvailableBalance(uint256,uint256)": FunctionFragment;
    "getBlockTime()": FunctionFragment;
    "getUserAccumulatedReward(address,uint256,uint256)": FunctionFragment;
    "getUserOwedTokens(address,uint256)": FunctionFragment;
    "getUserRewardDebt(address,uint256)": FunctionFragment;
    "getUserRewardDebtLength(address)": FunctionFragment;
    "getUserTokensOwedLength(address)": FunctionFragment;
    "hasStakingStarted()": FunctionFragment;
    "notifyExternalReward(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardPerBlock(uint256)": FunctionFragment;
    "rewardsTokens(uint256)": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "stakeLimit()": FunctionFragment;
    "stakingToken()": FunctionFragment;
    "start(uint256,uint256,uint256[])": FunctionFragment;
    "startTimestamp()": FunctionFragment;
    "totalStaked()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "treasury()": FunctionFragment;
    "updateRewardMultipliers()": FunctionFragment;
    "userInfo(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
    "withdrawLPRewards(address,address)": FunctionFragment;
    "withdrawStake(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accumulatedRewardMultiplier",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "contractStakeLimit",
    values?: undefined
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
    functionFragment: "externalRewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "externalRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableBalance",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBlockTime",
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
  encodeFunctionData(
    functionFragment: "notifyExternalReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerBlock",
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
  encodeFunctionData(functionFragment: "treasury", values?: undefined): string;
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
    functionFragment: "withdrawLPRewards",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStake",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "accumulatedRewardMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractStakeLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "endTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "extend", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "externalRewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "externalRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBlockTime",
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
  decodeFunctionResult(
    functionFragment: "notifyExternalReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerBlock",
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
  decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateRewardMultipliers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "userInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawLPRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStake",
    data: BytesLike
  ): Result;

  events: {
    "Claimed(address,uint256,address)": EventFragment;
    "Exited(address,uint256)": EventFragment;
    "Extended(uint256,uint256[])": EventFragment;
    "ExternalRewardsAdded(address,address,uint256)": EventFragment;
    "ExternalRewardsClaimed(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "StakeWithdrawn(uint256)": EventFragment;
    "Staked(address,uint256)": EventFragment;
    "Started()": EventFragment;
    "WithdrawLPRewards(uint256,address)": EventFragment;
    "Withdrawn(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Exited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Extended"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExternalRewardsAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExternalRewardsClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StakeWithdrawn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Started"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawLPRewards"): EventFragment;
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
  [BigNumber, BigNumber[]],
  { newEndBlock: BigNumber; newRewardsPerBlock: BigNumber[] }
>;

export type ExtendedEventFilter = TypedEventFilter<ExtendedEvent>;

export type ExternalRewardsAddedEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; token: string; reward: BigNumber }
>;

export type ExternalRewardsAddedEventFilter =
  TypedEventFilter<ExternalRewardsAddedEvent>;

export type ExternalRewardsClaimedEvent = TypedEvent<
  [string],
  { receiver: string }
>;

export type ExternalRewardsClaimedEventFilter =
  TypedEventFilter<ExternalRewardsClaimedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type StakeWithdrawnEvent = TypedEvent<
  [BigNumber],
  { amount: BigNumber }
>;

export type StakeWithdrawnEventFilter = TypedEventFilter<StakeWithdrawnEvent>;

export type StakedEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export type StartedEvent = TypedEvent<[], {}>;

export type StartedEventFilter = TypedEventFilter<StartedEvent>;

export type WithdrawLPRewardsEvent = TypedEvent<
  [BigNumber, string],
  { rewardsAmount: BigNumber; recipient: string }
>;

export type WithdrawLPRewardsEventFilter =
  TypedEventFilter<WithdrawLPRewardsEvent>;

export type WithdrawnEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface TreasuryOperatedFeature extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TreasuryOperatedFeatureInterface;

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

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    contractStakeLimit(overrides?: CallOverrides): Promise<[BigNumber]>;

    endTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    extend(
      _endTimestamp: BigNumberish,
      _rewardsPerBlock: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    externalRewardToken(overrides?: CallOverrides): Promise<[string]>;

    externalRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getBlockTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    getUserAccumulatedReward(
      _userAddress: string,
      tokenIndex: BigNumberish,
      time: BigNumberish,
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

    notifyExternalReward(
      reward: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardPerBlock(
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
      _rewardPerBlock: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalStaked(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    treasury(overrides?: CallOverrides): Promise<[string]>;

    updateRewardMultipliers(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        firstStakedBlockNumber: BigNumber;
        amountStaked: BigNumber;
      }
    >;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawLPRewards(
      recipient: string,
      lpTokenContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawStake(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  accumulatedRewardMultiplier(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOf(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  claim(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  contractStakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

  endTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  exit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  extend(
    _endTimestamp: BigNumberish,
    _rewardsPerBlock: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  externalRewardToken(overrides?: CallOverrides): Promise<string>;

  externalRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  getAvailableBalance(
    _rewardTokenIndex: BigNumberish,
    time: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBlockTime(overrides?: CallOverrides): Promise<BigNumber>;

  getUserAccumulatedReward(
    _userAddress: string,
    tokenIndex: BigNumberish,
    time: BigNumberish,
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

  notifyExternalReward(
    reward: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardPerBlock(
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
    _rewardPerBlock: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  treasury(overrides?: CallOverrides): Promise<string>;

  updateRewardMultipliers(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      firstStakedBlockNumber: BigNumber;
      amountStaked: BigNumber;
    }
  >;

  withdraw(
    _tokenAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawLPRewards(
    recipient: string,
    lpTokenContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawStake(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    accumulatedRewardMultiplier(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOf(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(overrides?: CallOverrides): Promise<void>;

    contractStakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

    endTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    exit(overrides?: CallOverrides): Promise<void>;

    extend(
      _endTimestamp: BigNumberish,
      _rewardsPerBlock: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    externalRewardToken(overrides?: CallOverrides): Promise<string>;

    externalRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBlockTime(overrides?: CallOverrides): Promise<BigNumber>;

    getUserAccumulatedReward(
      _userAddress: string,
      tokenIndex: BigNumberish,
      time: BigNumberish,
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

    notifyExternalReward(
      reward: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardPerBlock(
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
      _rewardPerBlock: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    startTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    treasury(overrides?: CallOverrides): Promise<string>;

    updateRewardMultipliers(overrides?: CallOverrides): Promise<void>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        firstStakedBlockNumber: BigNumber;
        amountStaked: BigNumber;
      }
    >;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawLPRewards(
      recipient: string,
      lpTokenContract: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawStake(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
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

    "Extended(uint256,uint256[])"(
      newEndBlock?: null,
      newRewardsPerBlock?: null
    ): ExtendedEventFilter;
    Extended(
      newEndBlock?: null,
      newRewardsPerBlock?: null
    ): ExtendedEventFilter;

    "ExternalRewardsAdded(address,address,uint256)"(
      from?: string | null,
      token?: null,
      reward?: null
    ): ExternalRewardsAddedEventFilter;
    ExternalRewardsAdded(
      from?: string | null,
      token?: null,
      reward?: null
    ): ExternalRewardsAddedEventFilter;

    "ExternalRewardsClaimed(address)"(
      receiver?: null
    ): ExternalRewardsClaimedEventFilter;
    ExternalRewardsClaimed(receiver?: null): ExternalRewardsClaimedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "StakeWithdrawn(uint256)"(amount?: null): StakeWithdrawnEventFilter;
    StakeWithdrawn(amount?: null): StakeWithdrawnEventFilter;

    "Staked(address,uint256)"(
      user?: string | null,
      amount?: null
    ): StakedEventFilter;
    Staked(user?: string | null, amount?: null): StakedEventFilter;

    "Started()"(): StartedEventFilter;
    Started(): StartedEventFilter;

    "WithdrawLPRewards(uint256,address)"(
      rewardsAmount?: BigNumberish | null,
      recipient?: string | null
    ): WithdrawLPRewardsEventFilter;
    WithdrawLPRewards(
      rewardsAmount?: BigNumberish | null,
      recipient?: string | null
    ): WithdrawLPRewardsEventFilter;

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

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    contractStakeLimit(overrides?: CallOverrides): Promise<BigNumber>;

    endTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    extend(
      _endTimestamp: BigNumberish,
      _rewardsPerBlock: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    externalRewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    externalRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBlockTime(overrides?: CallOverrides): Promise<BigNumber>;

    getUserAccumulatedReward(
      _userAddress: string,
      tokenIndex: BigNumberish,
      time: BigNumberish,
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

    notifyExternalReward(
      reward: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardPerBlock(
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
      _rewardPerBlock: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    treasury(overrides?: CallOverrides): Promise<BigNumber>;

    updateRewardMultipliers(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    userInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _tokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawLPRewards(
      recipient: string,
      lpTokenContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawStake(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
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

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    contractStakeLimit(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    endTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    extend(
      _endTimestamp: BigNumberish,
      _rewardsPerBlock: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    externalRewardToken(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    externalRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAvailableBalance(
      _rewardTokenIndex: BigNumberish,
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBlockTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUserAccumulatedReward(
      _userAddress: string,
      tokenIndex: BigNumberish,
      time: BigNumberish,
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

    notifyExternalReward(
      reward: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardPerBlock(
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
      _rewardPerBlock: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalStaked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    treasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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

    withdrawLPRewards(
      recipient: string,
      lpTokenContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawStake(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}