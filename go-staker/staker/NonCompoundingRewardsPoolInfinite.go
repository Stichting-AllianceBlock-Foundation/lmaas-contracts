// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package staker

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// StakerMetaData contains all meta data concerning the Staker contract.
var StakerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"_stakingToken\",\"type\":\"address\"},{\"internalType\":\"address[]\",\"name\":\"_rewardsTokens\",\"type\":\"address[]\"},{\"internalType\":\"uint256\",\"name\":\"_stakeLimit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_contractStakeLimit\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"Claimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Exited\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newStartTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newEndTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"newRewardsPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"Extended\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Staked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"startTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"endTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"rewardsPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"Started\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Withdrawn\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"accumulatedRewardMultiplier\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cancel\",\"outputs\":[],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cancelExtension\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"claim\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"contractStakeLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"endTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"epochCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"epochDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"exit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"name\":\"extend\",\"outputs\":[],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"extensionDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"extensionRewardPerSecond\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_rewardTokenIndex\",\"type\":\"uint256\"}],\"name\":\"getAvailableBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getPreviousCampaignsCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getRewardTokensCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_tokenIndex\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_time\",\"type\":\"uint256\"}],\"name\":\"getUserAccumulatedReward\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getUserOwedTokens\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getUserRewardDebt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"getUserRewardDebtLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"getUserTokensOwedLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"hasStakingStarted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"previousCampaigns\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"startTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endTimestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"realStartTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardPerSecond\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardTokenDecimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardsTokens\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenAmount\",\"type\":\"uint256\"}],\"name\":\"stake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakeLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakingToken\",\"outputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakingTokenDecimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_startTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_endTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"_rewardPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_epochDuration\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_startTimestamp\",\"type\":\"uint256\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_epochDuration\",\"type\":\"uint256\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"startTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalStaked\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"updateRewardMultipliers\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"firstStakedTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amountStaked\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userStakedEpoch\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenAmount\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_recipient\",\"type\":\"address\"}],\"name\":\"withdrawExcessRewards\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_recipient\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_token\",\"type\":\"address\"}],\"name\":\"withdrawTokens\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// StakerABI is the input ABI used to generate the binding from.
// Deprecated: Use StakerMetaData.ABI instead.
var StakerABI = StakerMetaData.ABI

// Staker is an auto generated Go binding around an Ethereum contract.
type Staker struct {
	StakerCaller     // Read-only binding to the contract
	StakerTransactor // Write-only binding to the contract
	StakerFilterer   // Log filterer for contract events
}

// StakerCaller is an auto generated read-only Go binding around an Ethereum contract.
type StakerCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// StakerTransactor is an auto generated write-only Go binding around an Ethereum contract.
type StakerTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// StakerFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type StakerFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// StakerSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type StakerSession struct {
	Contract     *Staker           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// StakerCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type StakerCallerSession struct {
	Contract *StakerCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// StakerTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type StakerTransactorSession struct {
	Contract     *StakerTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// StakerRaw is an auto generated low-level Go binding around an Ethereum contract.
type StakerRaw struct {
	Contract *Staker // Generic contract binding to access the raw methods on
}

// StakerCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type StakerCallerRaw struct {
	Contract *StakerCaller // Generic read-only contract binding to access the raw methods on
}

// StakerTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type StakerTransactorRaw struct {
	Contract *StakerTransactor // Generic write-only contract binding to access the raw methods on
}

// NewStaker creates a new instance of Staker, bound to a specific deployed contract.
func NewStaker(address common.Address, backend bind.ContractBackend) (*Staker, error) {
	contract, err := bindStaker(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Staker{StakerCaller: StakerCaller{contract: contract}, StakerTransactor: StakerTransactor{contract: contract}, StakerFilterer: StakerFilterer{contract: contract}}, nil
}

// NewStakerCaller creates a new read-only instance of Staker, bound to a specific deployed contract.
func NewStakerCaller(address common.Address, caller bind.ContractCaller) (*StakerCaller, error) {
	contract, err := bindStaker(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &StakerCaller{contract: contract}, nil
}

// NewStakerTransactor creates a new write-only instance of Staker, bound to a specific deployed contract.
func NewStakerTransactor(address common.Address, transactor bind.ContractTransactor) (*StakerTransactor, error) {
	contract, err := bindStaker(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &StakerTransactor{contract: contract}, nil
}

// NewStakerFilterer creates a new log filterer instance of Staker, bound to a specific deployed contract.
func NewStakerFilterer(address common.Address, filterer bind.ContractFilterer) (*StakerFilterer, error) {
	contract, err := bindStaker(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &StakerFilterer{contract: contract}, nil
}

// bindStaker binds a generic wrapper to an already deployed contract.
func bindStaker(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := StakerMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Staker *StakerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Staker.Contract.StakerCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Staker *StakerRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.Contract.StakerTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Staker *StakerRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Staker.Contract.StakerTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Staker *StakerCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Staker.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Staker *StakerTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Staker *StakerTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Staker.Contract.contract.Transact(opts, method, params...)
}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_Staker *StakerCaller) AccumulatedRewardMultiplier(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "accumulatedRewardMultiplier", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_Staker *StakerSession) AccumulatedRewardMultiplier(arg0 *big.Int) (*big.Int, error) {
	return _Staker.Contract.AccumulatedRewardMultiplier(&_Staker.CallOpts, arg0)
}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_Staker *StakerCallerSession) AccumulatedRewardMultiplier(arg0 *big.Int) (*big.Int, error) {
	return _Staker.Contract.AccumulatedRewardMultiplier(&_Staker.CallOpts, arg0)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_Staker *StakerCaller) BalanceOf(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "balanceOf", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_Staker *StakerSession) BalanceOf(_userAddress common.Address) (*big.Int, error) {
	return _Staker.Contract.BalanceOf(&_Staker.CallOpts, _userAddress)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_Staker *StakerCallerSession) BalanceOf(_userAddress common.Address) (*big.Int, error) {
	return _Staker.Contract.BalanceOf(&_Staker.CallOpts, _userAddress)
}

// Cancel is a free data retrieval call binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() pure returns()
func (_Staker *StakerCaller) Cancel(opts *bind.CallOpts) error {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "cancel")

	if err != nil {
		return err
	}

	return err

}

// Cancel is a free data retrieval call binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() pure returns()
func (_Staker *StakerSession) Cancel() error {
	return _Staker.Contract.Cancel(&_Staker.CallOpts)
}

// Cancel is a free data retrieval call binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() pure returns()
func (_Staker *StakerCallerSession) Cancel() error {
	return _Staker.Contract.Cancel(&_Staker.CallOpts)
}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_Staker *StakerCaller) ContractStakeLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "contractStakeLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_Staker *StakerSession) ContractStakeLimit() (*big.Int, error) {
	return _Staker.Contract.ContractStakeLimit(&_Staker.CallOpts)
}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_Staker *StakerCallerSession) ContractStakeLimit() (*big.Int, error) {
	return _Staker.Contract.ContractStakeLimit(&_Staker.CallOpts)
}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_Staker *StakerCaller) EndTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "endTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_Staker *StakerSession) EndTimestamp() (*big.Int, error) {
	return _Staker.Contract.EndTimestamp(&_Staker.CallOpts)
}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_Staker *StakerCallerSession) EndTimestamp() (*big.Int, error) {
	return _Staker.Contract.EndTimestamp(&_Staker.CallOpts)
}

// EpochCount is a free data retrieval call binding the contract method 0x829965cc.
//
// Solidity: function epochCount() view returns(uint256)
func (_Staker *StakerCaller) EpochCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "epochCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EpochCount is a free data retrieval call binding the contract method 0x829965cc.
//
// Solidity: function epochCount() view returns(uint256)
func (_Staker *StakerSession) EpochCount() (*big.Int, error) {
	return _Staker.Contract.EpochCount(&_Staker.CallOpts)
}

// EpochCount is a free data retrieval call binding the contract method 0x829965cc.
//
// Solidity: function epochCount() view returns(uint256)
func (_Staker *StakerCallerSession) EpochCount() (*big.Int, error) {
	return _Staker.Contract.EpochCount(&_Staker.CallOpts)
}

// EpochDuration is a free data retrieval call binding the contract method 0x4ff0876a.
//
// Solidity: function epochDuration() view returns(uint256)
func (_Staker *StakerCaller) EpochDuration(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "epochDuration")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EpochDuration is a free data retrieval call binding the contract method 0x4ff0876a.
//
// Solidity: function epochDuration() view returns(uint256)
func (_Staker *StakerSession) EpochDuration() (*big.Int, error) {
	return _Staker.Contract.EpochDuration(&_Staker.CallOpts)
}

// EpochDuration is a free data retrieval call binding the contract method 0x4ff0876a.
//
// Solidity: function epochDuration() view returns(uint256)
func (_Staker *StakerCallerSession) EpochDuration() (*big.Int, error) {
	return _Staker.Contract.EpochDuration(&_Staker.CallOpts)
}

// Extend is a free data retrieval call binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 , uint256[] ) pure returns()
func (_Staker *StakerCaller) Extend(opts *bind.CallOpts, arg0 *big.Int, arg1 []*big.Int) error {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "extend", arg0, arg1)

	if err != nil {
		return err
	}

	return err

}

// Extend is a free data retrieval call binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 , uint256[] ) pure returns()
func (_Staker *StakerSession) Extend(arg0 *big.Int, arg1 []*big.Int) error {
	return _Staker.Contract.Extend(&_Staker.CallOpts, arg0, arg1)
}

// Extend is a free data retrieval call binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 , uint256[] ) pure returns()
func (_Staker *StakerCallerSession) Extend(arg0 *big.Int, arg1 []*big.Int) error {
	return _Staker.Contract.Extend(&_Staker.CallOpts, arg0, arg1)
}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_Staker *StakerCaller) ExtensionDuration(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "extensionDuration")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_Staker *StakerSession) ExtensionDuration() (*big.Int, error) {
	return _Staker.Contract.ExtensionDuration(&_Staker.CallOpts)
}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_Staker *StakerCallerSession) ExtensionDuration() (*big.Int, error) {
	return _Staker.Contract.ExtensionDuration(&_Staker.CallOpts)
}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_Staker *StakerCaller) ExtensionRewardPerSecond(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "extensionRewardPerSecond", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_Staker *StakerSession) ExtensionRewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _Staker.Contract.ExtensionRewardPerSecond(&_Staker.CallOpts, arg0)
}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_Staker *StakerCallerSession) ExtensionRewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _Staker.Contract.ExtensionRewardPerSecond(&_Staker.CallOpts, arg0)
}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_Staker *StakerCaller) GetAvailableBalance(opts *bind.CallOpts, _rewardTokenIndex *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getAvailableBalance", _rewardTokenIndex)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_Staker *StakerSession) GetAvailableBalance(_rewardTokenIndex *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetAvailableBalance(&_Staker.CallOpts, _rewardTokenIndex)
}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_Staker *StakerCallerSession) GetAvailableBalance(_rewardTokenIndex *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetAvailableBalance(&_Staker.CallOpts, _rewardTokenIndex)
}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_Staker *StakerCaller) GetPreviousCampaignsCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getPreviousCampaignsCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_Staker *StakerSession) GetPreviousCampaignsCount() (*big.Int, error) {
	return _Staker.Contract.GetPreviousCampaignsCount(&_Staker.CallOpts)
}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_Staker *StakerCallerSession) GetPreviousCampaignsCount() (*big.Int, error) {
	return _Staker.Contract.GetPreviousCampaignsCount(&_Staker.CallOpts)
}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_Staker *StakerCaller) GetRewardTokensCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getRewardTokensCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_Staker *StakerSession) GetRewardTokensCount() (*big.Int, error) {
	return _Staker.Contract.GetRewardTokensCount(&_Staker.CallOpts)
}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_Staker *StakerCallerSession) GetRewardTokensCount() (*big.Int, error) {
	return _Staker.Contract.GetRewardTokensCount(&_Staker.CallOpts)
}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_Staker *StakerCaller) GetUserAccumulatedReward(opts *bind.CallOpts, _userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getUserAccumulatedReward", _userAddress, _tokenIndex, _time)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_Staker *StakerSession) GetUserAccumulatedReward(_userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetUserAccumulatedReward(&_Staker.CallOpts, _userAddress, _tokenIndex, _time)
}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_Staker *StakerCallerSession) GetUserAccumulatedReward(_userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetUserAccumulatedReward(&_Staker.CallOpts, _userAddress, _tokenIndex, _time)
}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_Staker *StakerCaller) GetUserOwedTokens(opts *bind.CallOpts, _userAddress common.Address, _index *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getUserOwedTokens", _userAddress, _index)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_Staker *StakerSession) GetUserOwedTokens(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetUserOwedTokens(&_Staker.CallOpts, _userAddress, _index)
}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_Staker *StakerCallerSession) GetUserOwedTokens(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetUserOwedTokens(&_Staker.CallOpts, _userAddress, _index)
}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_Staker *StakerCaller) GetUserRewardDebt(opts *bind.CallOpts, _userAddress common.Address, _index *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getUserRewardDebt", _userAddress, _index)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_Staker *StakerSession) GetUserRewardDebt(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetUserRewardDebt(&_Staker.CallOpts, _userAddress, _index)
}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_Staker *StakerCallerSession) GetUserRewardDebt(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _Staker.Contract.GetUserRewardDebt(&_Staker.CallOpts, _userAddress, _index)
}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_Staker *StakerCaller) GetUserRewardDebtLength(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getUserRewardDebtLength", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_Staker *StakerSession) GetUserRewardDebtLength(_userAddress common.Address) (*big.Int, error) {
	return _Staker.Contract.GetUserRewardDebtLength(&_Staker.CallOpts, _userAddress)
}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_Staker *StakerCallerSession) GetUserRewardDebtLength(_userAddress common.Address) (*big.Int, error) {
	return _Staker.Contract.GetUserRewardDebtLength(&_Staker.CallOpts, _userAddress)
}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_Staker *StakerCaller) GetUserTokensOwedLength(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "getUserTokensOwedLength", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_Staker *StakerSession) GetUserTokensOwedLength(_userAddress common.Address) (*big.Int, error) {
	return _Staker.Contract.GetUserTokensOwedLength(&_Staker.CallOpts, _userAddress)
}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_Staker *StakerCallerSession) GetUserTokensOwedLength(_userAddress common.Address) (*big.Int, error) {
	return _Staker.Contract.GetUserTokensOwedLength(&_Staker.CallOpts, _userAddress)
}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_Staker *StakerCaller) HasStakingStarted(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "hasStakingStarted")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_Staker *StakerSession) HasStakingStarted() (bool, error) {
	return _Staker.Contract.HasStakingStarted(&_Staker.CallOpts)
}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_Staker *StakerCallerSession) HasStakingStarted() (bool, error) {
	return _Staker.Contract.HasStakingStarted(&_Staker.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Staker *StakerCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Staker *StakerSession) Name() (string, error) {
	return _Staker.Contract.Name(&_Staker.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Staker *StakerCallerSession) Name() (string, error) {
	return _Staker.Contract.Name(&_Staker.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Staker *StakerCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Staker *StakerSession) Owner() (common.Address, error) {
	return _Staker.Contract.Owner(&_Staker.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Staker *StakerCallerSession) Owner() (common.Address, error) {
	return _Staker.Contract.Owner(&_Staker.CallOpts)
}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_Staker *StakerCaller) PreviousCampaigns(opts *bind.CallOpts, arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "previousCampaigns", arg0)

	outstruct := new(struct {
		StartTimestamp *big.Int
		EndTimestamp   *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.StartTimestamp = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.EndTimestamp = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_Staker *StakerSession) PreviousCampaigns(arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	return _Staker.Contract.PreviousCampaigns(&_Staker.CallOpts, arg0)
}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_Staker *StakerCallerSession) PreviousCampaigns(arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	return _Staker.Contract.PreviousCampaigns(&_Staker.CallOpts, arg0)
}

// RealStartTimestamp is a free data retrieval call binding the contract method 0x4a74662d.
//
// Solidity: function realStartTimestamp() view returns(uint256)
func (_Staker *StakerCaller) RealStartTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "realStartTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RealStartTimestamp is a free data retrieval call binding the contract method 0x4a74662d.
//
// Solidity: function realStartTimestamp() view returns(uint256)
func (_Staker *StakerSession) RealStartTimestamp() (*big.Int, error) {
	return _Staker.Contract.RealStartTimestamp(&_Staker.CallOpts)
}

// RealStartTimestamp is a free data retrieval call binding the contract method 0x4a74662d.
//
// Solidity: function realStartTimestamp() view returns(uint256)
func (_Staker *StakerCallerSession) RealStartTimestamp() (*big.Int, error) {
	return _Staker.Contract.RealStartTimestamp(&_Staker.CallOpts)
}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_Staker *StakerCaller) RewardPerSecond(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "rewardPerSecond", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_Staker *StakerSession) RewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _Staker.Contract.RewardPerSecond(&_Staker.CallOpts, arg0)
}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_Staker *StakerCallerSession) RewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _Staker.Contract.RewardPerSecond(&_Staker.CallOpts, arg0)
}

// RewardTokenDecimals is a free data retrieval call binding the contract method 0xb8ba2430.
//
// Solidity: function rewardTokenDecimals(uint256 ) view returns(uint8)
func (_Staker *StakerCaller) RewardTokenDecimals(opts *bind.CallOpts, arg0 *big.Int) (uint8, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "rewardTokenDecimals", arg0)

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// RewardTokenDecimals is a free data retrieval call binding the contract method 0xb8ba2430.
//
// Solidity: function rewardTokenDecimals(uint256 ) view returns(uint8)
func (_Staker *StakerSession) RewardTokenDecimals(arg0 *big.Int) (uint8, error) {
	return _Staker.Contract.RewardTokenDecimals(&_Staker.CallOpts, arg0)
}

// RewardTokenDecimals is a free data retrieval call binding the contract method 0xb8ba2430.
//
// Solidity: function rewardTokenDecimals(uint256 ) view returns(uint8)
func (_Staker *StakerCallerSession) RewardTokenDecimals(arg0 *big.Int) (uint8, error) {
	return _Staker.Contract.RewardTokenDecimals(&_Staker.CallOpts, arg0)
}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_Staker *StakerCaller) RewardsTokens(opts *bind.CallOpts, arg0 *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "rewardsTokens", arg0)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_Staker *StakerSession) RewardsTokens(arg0 *big.Int) (common.Address, error) {
	return _Staker.Contract.RewardsTokens(&_Staker.CallOpts, arg0)
}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_Staker *StakerCallerSession) RewardsTokens(arg0 *big.Int) (common.Address, error) {
	return _Staker.Contract.RewardsTokens(&_Staker.CallOpts, arg0)
}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_Staker *StakerCaller) StakeLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "stakeLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_Staker *StakerSession) StakeLimit() (*big.Int, error) {
	return _Staker.Contract.StakeLimit(&_Staker.CallOpts)
}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_Staker *StakerCallerSession) StakeLimit() (*big.Int, error) {
	return _Staker.Contract.StakeLimit(&_Staker.CallOpts)
}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_Staker *StakerCaller) StakingToken(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "stakingToken")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_Staker *StakerSession) StakingToken() (common.Address, error) {
	return _Staker.Contract.StakingToken(&_Staker.CallOpts)
}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_Staker *StakerCallerSession) StakingToken() (common.Address, error) {
	return _Staker.Contract.StakingToken(&_Staker.CallOpts)
}

// StakingTokenDecimals is a free data retrieval call binding the contract method 0xb9f7a7b5.
//
// Solidity: function stakingTokenDecimals() view returns(uint8)
func (_Staker *StakerCaller) StakingTokenDecimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "stakingTokenDecimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// StakingTokenDecimals is a free data retrieval call binding the contract method 0xb9f7a7b5.
//
// Solidity: function stakingTokenDecimals() view returns(uint8)
func (_Staker *StakerSession) StakingTokenDecimals() (uint8, error) {
	return _Staker.Contract.StakingTokenDecimals(&_Staker.CallOpts)
}

// StakingTokenDecimals is a free data retrieval call binding the contract method 0xb9f7a7b5.
//
// Solidity: function stakingTokenDecimals() view returns(uint8)
func (_Staker *StakerCallerSession) StakingTokenDecimals() (uint8, error) {
	return _Staker.Contract.StakingTokenDecimals(&_Staker.CallOpts)
}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_Staker *StakerCaller) StartTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "startTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_Staker *StakerSession) StartTimestamp() (*big.Int, error) {
	return _Staker.Contract.StartTimestamp(&_Staker.CallOpts)
}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_Staker *StakerCallerSession) StartTimestamp() (*big.Int, error) {
	return _Staker.Contract.StartTimestamp(&_Staker.CallOpts)
}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_Staker *StakerCaller) TotalStaked(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "totalStaked")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_Staker *StakerSession) TotalStaked() (*big.Int, error) {
	return _Staker.Contract.TotalStaked(&_Staker.CallOpts)
}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_Staker *StakerCallerSession) TotalStaked() (*big.Int, error) {
	return _Staker.Contract.TotalStaked(&_Staker.CallOpts)
}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_Staker *StakerCaller) UserInfo(opts *bind.CallOpts, arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "userInfo", arg0)

	outstruct := new(struct {
		FirstStakedTimestamp *big.Int
		AmountStaked         *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.FirstStakedTimestamp = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.AmountStaked = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_Staker *StakerSession) UserInfo(arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	return _Staker.Contract.UserInfo(&_Staker.CallOpts, arg0)
}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_Staker *StakerCallerSession) UserInfo(arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	return _Staker.Contract.UserInfo(&_Staker.CallOpts, arg0)
}

// UserStakedEpoch is a free data retrieval call binding the contract method 0xb7b8e51d.
//
// Solidity: function userStakedEpoch(address ) view returns(uint256)
func (_Staker *StakerCaller) UserStakedEpoch(opts *bind.CallOpts, arg0 common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Staker.contract.Call(opts, &out, "userStakedEpoch", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserStakedEpoch is a free data retrieval call binding the contract method 0xb7b8e51d.
//
// Solidity: function userStakedEpoch(address ) view returns(uint256)
func (_Staker *StakerSession) UserStakedEpoch(arg0 common.Address) (*big.Int, error) {
	return _Staker.Contract.UserStakedEpoch(&_Staker.CallOpts, arg0)
}

// UserStakedEpoch is a free data retrieval call binding the contract method 0xb7b8e51d.
//
// Solidity: function userStakedEpoch(address ) view returns(uint256)
func (_Staker *StakerCallerSession) UserStakedEpoch(arg0 common.Address) (*big.Int, error) {
	return _Staker.Contract.UserStakedEpoch(&_Staker.CallOpts, arg0)
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_Staker *StakerTransactor) CancelExtension(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "cancelExtension")
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_Staker *StakerSession) CancelExtension() (*types.Transaction, error) {
	return _Staker.Contract.CancelExtension(&_Staker.TransactOpts)
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_Staker *StakerTransactorSession) CancelExtension() (*types.Transaction, error) {
	return _Staker.Contract.CancelExtension(&_Staker.TransactOpts)
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_Staker *StakerTransactor) Claim(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "claim")
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_Staker *StakerSession) Claim() (*types.Transaction, error) {
	return _Staker.Contract.Claim(&_Staker.TransactOpts)
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_Staker *StakerTransactorSession) Claim() (*types.Transaction, error) {
	return _Staker.Contract.Claim(&_Staker.TransactOpts)
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_Staker *StakerTransactor) Exit(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "exit")
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_Staker *StakerSession) Exit() (*types.Transaction, error) {
	return _Staker.Contract.Exit(&_Staker.TransactOpts)
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_Staker *StakerTransactorSession) Exit() (*types.Transaction, error) {
	return _Staker.Contract.Exit(&_Staker.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Staker *StakerTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Staker *StakerSession) RenounceOwnership() (*types.Transaction, error) {
	return _Staker.Contract.RenounceOwnership(&_Staker.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Staker *StakerTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Staker.Contract.RenounceOwnership(&_Staker.TransactOpts)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_Staker *StakerTransactor) Stake(opts *bind.TransactOpts, _tokenAmount *big.Int) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "stake", _tokenAmount)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_Staker *StakerSession) Stake(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Stake(&_Staker.TransactOpts, _tokenAmount)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_Staker *StakerTransactorSession) Stake(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Stake(&_Staker.TransactOpts, _tokenAmount)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_Staker *StakerTransactor) Start(opts *bind.TransactOpts, _startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "start", _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_Staker *StakerSession) Start(_startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Start(&_Staker.TransactOpts, _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_Staker *StakerTransactorSession) Start(_startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Start(&_Staker.TransactOpts, _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start0 is a paid mutator transaction binding the contract method 0x8fb4b573.
//
// Solidity: function start(uint256 _epochDuration, uint256 _startTimestamp) returns()
func (_Staker *StakerTransactor) Start0(opts *bind.TransactOpts, _epochDuration *big.Int, _startTimestamp *big.Int) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "start0", _epochDuration, _startTimestamp)
}

// Start0 is a paid mutator transaction binding the contract method 0x8fb4b573.
//
// Solidity: function start(uint256 _epochDuration, uint256 _startTimestamp) returns()
func (_Staker *StakerSession) Start0(_epochDuration *big.Int, _startTimestamp *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Start0(&_Staker.TransactOpts, _epochDuration, _startTimestamp)
}

// Start0 is a paid mutator transaction binding the contract method 0x8fb4b573.
//
// Solidity: function start(uint256 _epochDuration, uint256 _startTimestamp) returns()
func (_Staker *StakerTransactorSession) Start0(_epochDuration *big.Int, _startTimestamp *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Start0(&_Staker.TransactOpts, _epochDuration, _startTimestamp)
}

// Start1 is a paid mutator transaction binding the contract method 0x95805dad.
//
// Solidity: function start(uint256 _epochDuration) returns()
func (_Staker *StakerTransactor) Start1(opts *bind.TransactOpts, _epochDuration *big.Int) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "start1", _epochDuration)
}

// Start1 is a paid mutator transaction binding the contract method 0x95805dad.
//
// Solidity: function start(uint256 _epochDuration) returns()
func (_Staker *StakerSession) Start1(_epochDuration *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Start1(&_Staker.TransactOpts, _epochDuration)
}

// Start1 is a paid mutator transaction binding the contract method 0x95805dad.
//
// Solidity: function start(uint256 _epochDuration) returns()
func (_Staker *StakerTransactorSession) Start1(_epochDuration *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Start1(&_Staker.TransactOpts, _epochDuration)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Staker *StakerTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Staker *StakerSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Staker.Contract.TransferOwnership(&_Staker.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Staker *StakerTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Staker.Contract.TransferOwnership(&_Staker.TransactOpts, newOwner)
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_Staker *StakerTransactor) UpdateRewardMultipliers(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "updateRewardMultipliers")
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_Staker *StakerSession) UpdateRewardMultipliers() (*types.Transaction, error) {
	return _Staker.Contract.UpdateRewardMultipliers(&_Staker.TransactOpts)
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_Staker *StakerTransactorSession) UpdateRewardMultipliers() (*types.Transaction, error) {
	return _Staker.Contract.UpdateRewardMultipliers(&_Staker.TransactOpts)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_Staker *StakerTransactor) Withdraw(opts *bind.TransactOpts, _tokenAmount *big.Int) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "withdraw", _tokenAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_Staker *StakerSession) Withdraw(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Withdraw(&_Staker.TransactOpts, _tokenAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_Staker *StakerTransactorSession) Withdraw(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _Staker.Contract.Withdraw(&_Staker.TransactOpts, _tokenAmount)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_Staker *StakerTransactor) WithdrawExcessRewards(opts *bind.TransactOpts, _recipient common.Address) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "withdrawExcessRewards", _recipient)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_Staker *StakerSession) WithdrawExcessRewards(_recipient common.Address) (*types.Transaction, error) {
	return _Staker.Contract.WithdrawExcessRewards(&_Staker.TransactOpts, _recipient)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_Staker *StakerTransactorSession) WithdrawExcessRewards(_recipient common.Address) (*types.Transaction, error) {
	return _Staker.Contract.WithdrawExcessRewards(&_Staker.TransactOpts, _recipient)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_Staker *StakerTransactor) WithdrawTokens(opts *bind.TransactOpts, _recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _Staker.contract.Transact(opts, "withdrawTokens", _recipient, _token)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_Staker *StakerSession) WithdrawTokens(_recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _Staker.Contract.WithdrawTokens(&_Staker.TransactOpts, _recipient, _token)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_Staker *StakerTransactorSession) WithdrawTokens(_recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _Staker.Contract.WithdrawTokens(&_Staker.TransactOpts, _recipient, _token)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Staker *StakerTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Staker.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Staker *StakerSession) Receive() (*types.Transaction, error) {
	return _Staker.Contract.Receive(&_Staker.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Staker *StakerTransactorSession) Receive() (*types.Transaction, error) {
	return _Staker.Contract.Receive(&_Staker.TransactOpts)
}

// StakerClaimedIterator is returned from FilterClaimed and is used to iterate over the raw logs and unpacked data for Claimed events raised by the Staker contract.
type StakerClaimedIterator struct {
	Event *StakerClaimed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerClaimed)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerClaimed)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerClaimed represents a Claimed event raised by the Staker contract.
type StakerClaimed struct {
	User   common.Address
	Amount *big.Int
	Token  common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterClaimed is a free log retrieval operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_Staker *StakerFilterer) FilterClaimed(opts *bind.FilterOpts, user []common.Address) (*StakerClaimedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.FilterLogs(opts, "Claimed", userRule)
	if err != nil {
		return nil, err
	}
	return &StakerClaimedIterator{contract: _Staker.contract, event: "Claimed", logs: logs, sub: sub}, nil
}

// WatchClaimed is a free log subscription operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_Staker *StakerFilterer) WatchClaimed(opts *bind.WatchOpts, sink chan<- *StakerClaimed, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.WatchLogs(opts, "Claimed", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerClaimed)
				if err := _Staker.contract.UnpackLog(event, "Claimed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseClaimed is a log parse operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_Staker *StakerFilterer) ParseClaimed(log types.Log) (*StakerClaimed, error) {
	event := new(StakerClaimed)
	if err := _Staker.contract.UnpackLog(event, "Claimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StakerExitedIterator is returned from FilterExited and is used to iterate over the raw logs and unpacked data for Exited events raised by the Staker contract.
type StakerExitedIterator struct {
	Event *StakerExited // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerExitedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerExited)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerExited)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerExitedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerExitedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerExited represents a Exited event raised by the Staker contract.
type StakerExited struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterExited is a free log retrieval operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) FilterExited(opts *bind.FilterOpts, user []common.Address) (*StakerExitedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.FilterLogs(opts, "Exited", userRule)
	if err != nil {
		return nil, err
	}
	return &StakerExitedIterator{contract: _Staker.contract, event: "Exited", logs: logs, sub: sub}, nil
}

// WatchExited is a free log subscription operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) WatchExited(opts *bind.WatchOpts, sink chan<- *StakerExited, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.WatchLogs(opts, "Exited", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerExited)
				if err := _Staker.contract.UnpackLog(event, "Exited", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseExited is a log parse operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) ParseExited(log types.Log) (*StakerExited, error) {
	event := new(StakerExited)
	if err := _Staker.contract.UnpackLog(event, "Exited", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StakerExtendedIterator is returned from FilterExtended and is used to iterate over the raw logs and unpacked data for Extended events raised by the Staker contract.
type StakerExtendedIterator struct {
	Event *StakerExtended // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerExtendedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerExtended)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerExtended)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerExtendedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerExtendedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerExtended represents a Extended event raised by the Staker contract.
type StakerExtended struct {
	NewStartTimestamp   *big.Int
	NewEndTimestamp     *big.Int
	NewRewardsPerSecond []*big.Int
	Raw                 types.Log // Blockchain specific contextual infos
}

// FilterExtended is a free log retrieval operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_Staker *StakerFilterer) FilterExtended(opts *bind.FilterOpts) (*StakerExtendedIterator, error) {

	logs, sub, err := _Staker.contract.FilterLogs(opts, "Extended")
	if err != nil {
		return nil, err
	}
	return &StakerExtendedIterator{contract: _Staker.contract, event: "Extended", logs: logs, sub: sub}, nil
}

// WatchExtended is a free log subscription operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_Staker *StakerFilterer) WatchExtended(opts *bind.WatchOpts, sink chan<- *StakerExtended) (event.Subscription, error) {

	logs, sub, err := _Staker.contract.WatchLogs(opts, "Extended")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerExtended)
				if err := _Staker.contract.UnpackLog(event, "Extended", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseExtended is a log parse operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_Staker *StakerFilterer) ParseExtended(log types.Log) (*StakerExtended, error) {
	event := new(StakerExtended)
	if err := _Staker.contract.UnpackLog(event, "Extended", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StakerOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Staker contract.
type StakerOwnershipTransferredIterator struct {
	Event *StakerOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerOwnershipTransferred represents a OwnershipTransferred event raised by the Staker contract.
type StakerOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Staker *StakerFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*StakerOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Staker.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &StakerOwnershipTransferredIterator{contract: _Staker.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Staker *StakerFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *StakerOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Staker.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerOwnershipTransferred)
				if err := _Staker.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Staker *StakerFilterer) ParseOwnershipTransferred(log types.Log) (*StakerOwnershipTransferred, error) {
	event := new(StakerOwnershipTransferred)
	if err := _Staker.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StakerStakedIterator is returned from FilterStaked and is used to iterate over the raw logs and unpacked data for Staked events raised by the Staker contract.
type StakerStakedIterator struct {
	Event *StakerStaked // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerStakedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerStaked)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerStaked)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerStakedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerStakedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerStaked represents a Staked event raised by the Staker contract.
type StakerStaked struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterStaked is a free log retrieval operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) FilterStaked(opts *bind.FilterOpts, user []common.Address) (*StakerStakedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.FilterLogs(opts, "Staked", userRule)
	if err != nil {
		return nil, err
	}
	return &StakerStakedIterator{contract: _Staker.contract, event: "Staked", logs: logs, sub: sub}, nil
}

// WatchStaked is a free log subscription operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) WatchStaked(opts *bind.WatchOpts, sink chan<- *StakerStaked, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.WatchLogs(opts, "Staked", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerStaked)
				if err := _Staker.contract.UnpackLog(event, "Staked", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseStaked is a log parse operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) ParseStaked(log types.Log) (*StakerStaked, error) {
	event := new(StakerStaked)
	if err := _Staker.contract.UnpackLog(event, "Staked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StakerStartedIterator is returned from FilterStarted and is used to iterate over the raw logs and unpacked data for Started events raised by the Staker contract.
type StakerStartedIterator struct {
	Event *StakerStarted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerStartedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerStarted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerStarted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerStartedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerStartedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerStarted represents a Started event raised by the Staker contract.
type StakerStarted struct {
	StartTimestamp   *big.Int
	EndTimestamp     *big.Int
	RewardsPerSecond []*big.Int
	Raw              types.Log // Blockchain specific contextual infos
}

// FilterStarted is a free log retrieval operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_Staker *StakerFilterer) FilterStarted(opts *bind.FilterOpts) (*StakerStartedIterator, error) {

	logs, sub, err := _Staker.contract.FilterLogs(opts, "Started")
	if err != nil {
		return nil, err
	}
	return &StakerStartedIterator{contract: _Staker.contract, event: "Started", logs: logs, sub: sub}, nil
}

// WatchStarted is a free log subscription operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_Staker *StakerFilterer) WatchStarted(opts *bind.WatchOpts, sink chan<- *StakerStarted) (event.Subscription, error) {

	logs, sub, err := _Staker.contract.WatchLogs(opts, "Started")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerStarted)
				if err := _Staker.contract.UnpackLog(event, "Started", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseStarted is a log parse operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_Staker *StakerFilterer) ParseStarted(log types.Log) (*StakerStarted, error) {
	event := new(StakerStarted)
	if err := _Staker.contract.UnpackLog(event, "Started", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StakerWithdrawnIterator is returned from FilterWithdrawn and is used to iterate over the raw logs and unpacked data for Withdrawn events raised by the Staker contract.
type StakerWithdrawnIterator struct {
	Event *StakerWithdrawn // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *StakerWithdrawnIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StakerWithdrawn)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(StakerWithdrawn)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *StakerWithdrawnIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StakerWithdrawnIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StakerWithdrawn represents a Withdrawn event raised by the Staker contract.
type StakerWithdrawn struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterWithdrawn is a free log retrieval operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) FilterWithdrawn(opts *bind.FilterOpts, user []common.Address) (*StakerWithdrawnIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.FilterLogs(opts, "Withdrawn", userRule)
	if err != nil {
		return nil, err
	}
	return &StakerWithdrawnIterator{contract: _Staker.contract, event: "Withdrawn", logs: logs, sub: sub}, nil
}

// WatchWithdrawn is a free log subscription operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) WatchWithdrawn(opts *bind.WatchOpts, sink chan<- *StakerWithdrawn, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Staker.contract.WatchLogs(opts, "Withdrawn", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StakerWithdrawn)
				if err := _Staker.contract.UnpackLog(event, "Withdrawn", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseWithdrawn is a log parse operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_Staker *StakerFilterer) ParseWithdrawn(log types.Log) (*StakerWithdrawn, error) {
	event := new(StakerWithdrawn)
	if err := _Staker.contract.UnpackLog(event, "Withdrawn", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
