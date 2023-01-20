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

// LmaasLmMetaData contains all meta data concerning the LmaasLm contract.
var LmaasLmMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"_stakingToken\",\"type\":\"address\"},{\"internalType\":\"address[]\",\"name\":\"_rewardsTokens\",\"type\":\"address[]\"},{\"internalType\":\"uint256\",\"name\":\"_stakeLimit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_contractStakeLimit\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"Claimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Exited\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newStartTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newEndTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"newRewardsPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"Extended\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Staked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"startTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"endTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"rewardsPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"Started\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Withdrawn\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"accumulatedRewardMultiplier\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cancel\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cancelExtension\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"claim\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"contractStakeLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"endTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"exit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"transferTo\",\"type\":\"address\"}],\"name\":\"exitAndTransfer\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_durationTime\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"_rewardPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"extend\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"extensionDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"extensionRewardPerSecond\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_rewardTokenIndex\",\"type\":\"uint256\"}],\"name\":\"getAvailableBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getPreviousCampaignsCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getRewardTokensCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_tokenIndex\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_time\",\"type\":\"uint256\"}],\"name\":\"getUserAccumulatedReward\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getUserOwedTokens\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getUserRewardDebt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"getUserRewardDebtLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"getUserTokensOwedLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"hasStakingStarted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"previousCampaigns\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"startTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endTimestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"receiversWhitelist\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardPerSecond\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardsTokens\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_receiver\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"_whitelisted\",\"type\":\"bool\"}],\"name\":\"setReceiverWhitelisted\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenAmount\",\"type\":\"uint256\"}],\"name\":\"stake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakeLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakingToken\",\"outputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_startTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_endTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"_rewardPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"startTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalStaked\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"updateRewardMultipliers\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"firstStakedTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amountStaked\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenAmount\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_recipient\",\"type\":\"address\"}],\"name\":\"withdrawExcessRewards\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_recipient\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_token\",\"type\":\"address\"}],\"name\":\"withdrawTokens\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// LmaasLmABI is the input ABI used to generate the binding from.
// Deprecated: Use LmaasLmMetaData.ABI instead.
var LmaasLmABI = LmaasLmMetaData.ABI

// LmaasLm is an auto generated Go binding around an Ethereum contract.
type LmaasLm struct {
	LmaasLmCaller     // Read-only binding to the contract
	LmaasLmTransactor // Write-only binding to the contract
	LmaasLmFilterer   // Log filterer for contract events
}

// LmaasLmCaller is an auto generated read-only Go binding around an Ethereum contract.
type LmaasLmCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LmaasLmTransactor is an auto generated write-only Go binding around an Ethereum contract.
type LmaasLmTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LmaasLmFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type LmaasLmFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LmaasLmSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type LmaasLmSession struct {
	Contract     *LmaasLm          // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// LmaasLmCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type LmaasLmCallerSession struct {
	Contract *LmaasLmCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts  // Call options to use throughout this session
}

// LmaasLmTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type LmaasLmTransactorSession struct {
	Contract     *LmaasLmTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// LmaasLmRaw is an auto generated low-level Go binding around an Ethereum contract.
type LmaasLmRaw struct {
	Contract *LmaasLm // Generic contract binding to access the raw methods on
}

// LmaasLmCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type LmaasLmCallerRaw struct {
	Contract *LmaasLmCaller // Generic read-only contract binding to access the raw methods on
}

// LmaasLmTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type LmaasLmTransactorRaw struct {
	Contract *LmaasLmTransactor // Generic write-only contract binding to access the raw methods on
}

// NewLmaasLm creates a new instance of LmaasLm, bound to a specific deployed contract.
func NewLmaasLm(address common.Address, backend bind.ContractBackend) (*LmaasLm, error) {
	contract, err := bindLmaasLm(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &LmaasLm{LmaasLmCaller: LmaasLmCaller{contract: contract}, LmaasLmTransactor: LmaasLmTransactor{contract: contract}, LmaasLmFilterer: LmaasLmFilterer{contract: contract}}, nil
}

// NewLmaasLmCaller creates a new read-only instance of LmaasLm, bound to a specific deployed contract.
func NewLmaasLmCaller(address common.Address, caller bind.ContractCaller) (*LmaasLmCaller, error) {
	contract, err := bindLmaasLm(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &LmaasLmCaller{contract: contract}, nil
}

// NewLmaasLmTransactor creates a new write-only instance of LmaasLm, bound to a specific deployed contract.
func NewLmaasLmTransactor(address common.Address, transactor bind.ContractTransactor) (*LmaasLmTransactor, error) {
	contract, err := bindLmaasLm(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &LmaasLmTransactor{contract: contract}, nil
}

// NewLmaasLmFilterer creates a new log filterer instance of LmaasLm, bound to a specific deployed contract.
func NewLmaasLmFilterer(address common.Address, filterer bind.ContractFilterer) (*LmaasLmFilterer, error) {
	contract, err := bindLmaasLm(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &LmaasLmFilterer{contract: contract}, nil
}

// bindLmaasLm binds a generic wrapper to an already deployed contract.
func bindLmaasLm(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := LmaasLmMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_LmaasLm *LmaasLmRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _LmaasLm.Contract.LmaasLmCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_LmaasLm *LmaasLmRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.Contract.LmaasLmTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_LmaasLm *LmaasLmRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _LmaasLm.Contract.LmaasLmTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_LmaasLm *LmaasLmCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _LmaasLm.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_LmaasLm *LmaasLmTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_LmaasLm *LmaasLmTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _LmaasLm.Contract.contract.Transact(opts, method, params...)
}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) AccumulatedRewardMultiplier(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "accumulatedRewardMultiplier", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmSession) AccumulatedRewardMultiplier(arg0 *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.AccumulatedRewardMultiplier(&_LmaasLm.CallOpts, arg0)
}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) AccumulatedRewardMultiplier(arg0 *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.AccumulatedRewardMultiplier(&_LmaasLm.CallOpts, arg0)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) BalanceOf(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "balanceOf", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmSession) BalanceOf(_userAddress common.Address) (*big.Int, error) {
	return _LmaasLm.Contract.BalanceOf(&_LmaasLm.CallOpts, _userAddress)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) BalanceOf(_userAddress common.Address) (*big.Int, error) {
	return _LmaasLm.Contract.BalanceOf(&_LmaasLm.CallOpts, _userAddress)
}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) ContractStakeLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "contractStakeLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_LmaasLm *LmaasLmSession) ContractStakeLimit() (*big.Int, error) {
	return _LmaasLm.Contract.ContractStakeLimit(&_LmaasLm.CallOpts)
}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) ContractStakeLimit() (*big.Int, error) {
	return _LmaasLm.Contract.ContractStakeLimit(&_LmaasLm.CallOpts)
}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) EndTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "endTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_LmaasLm *LmaasLmSession) EndTimestamp() (*big.Int, error) {
	return _LmaasLm.Contract.EndTimestamp(&_LmaasLm.CallOpts)
}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) EndTimestamp() (*big.Int, error) {
	return _LmaasLm.Contract.EndTimestamp(&_LmaasLm.CallOpts)
}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) ExtensionDuration(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "extensionDuration")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_LmaasLm *LmaasLmSession) ExtensionDuration() (*big.Int, error) {
	return _LmaasLm.Contract.ExtensionDuration(&_LmaasLm.CallOpts)
}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) ExtensionDuration() (*big.Int, error) {
	return _LmaasLm.Contract.ExtensionDuration(&_LmaasLm.CallOpts)
}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) ExtensionRewardPerSecond(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "extensionRewardPerSecond", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmSession) ExtensionRewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.ExtensionRewardPerSecond(&_LmaasLm.CallOpts, arg0)
}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) ExtensionRewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.ExtensionRewardPerSecond(&_LmaasLm.CallOpts, arg0)
}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetAvailableBalance(opts *bind.CallOpts, _rewardTokenIndex *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getAvailableBalance", _rewardTokenIndex)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetAvailableBalance(_rewardTokenIndex *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetAvailableBalance(&_LmaasLm.CallOpts, _rewardTokenIndex)
}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetAvailableBalance(_rewardTokenIndex *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetAvailableBalance(&_LmaasLm.CallOpts, _rewardTokenIndex)
}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetPreviousCampaignsCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getPreviousCampaignsCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetPreviousCampaignsCount() (*big.Int, error) {
	return _LmaasLm.Contract.GetPreviousCampaignsCount(&_LmaasLm.CallOpts)
}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetPreviousCampaignsCount() (*big.Int, error) {
	return _LmaasLm.Contract.GetPreviousCampaignsCount(&_LmaasLm.CallOpts)
}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetRewardTokensCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getRewardTokensCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetRewardTokensCount() (*big.Int, error) {
	return _LmaasLm.Contract.GetRewardTokensCount(&_LmaasLm.CallOpts)
}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetRewardTokensCount() (*big.Int, error) {
	return _LmaasLm.Contract.GetRewardTokensCount(&_LmaasLm.CallOpts)
}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetUserAccumulatedReward(opts *bind.CallOpts, _userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getUserAccumulatedReward", _userAddress, _tokenIndex, _time)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetUserAccumulatedReward(_userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserAccumulatedReward(&_LmaasLm.CallOpts, _userAddress, _tokenIndex, _time)
}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetUserAccumulatedReward(_userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserAccumulatedReward(&_LmaasLm.CallOpts, _userAddress, _tokenIndex, _time)
}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetUserOwedTokens(opts *bind.CallOpts, _userAddress common.Address, _index *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getUserOwedTokens", _userAddress, _index)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetUserOwedTokens(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserOwedTokens(&_LmaasLm.CallOpts, _userAddress, _index)
}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetUserOwedTokens(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserOwedTokens(&_LmaasLm.CallOpts, _userAddress, _index)
}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetUserRewardDebt(opts *bind.CallOpts, _userAddress common.Address, _index *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getUserRewardDebt", _userAddress, _index)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetUserRewardDebt(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserRewardDebt(&_LmaasLm.CallOpts, _userAddress, _index)
}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetUserRewardDebt(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserRewardDebt(&_LmaasLm.CallOpts, _userAddress, _index)
}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetUserRewardDebtLength(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getUserRewardDebtLength", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetUserRewardDebtLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserRewardDebtLength(&_LmaasLm.CallOpts, _userAddress)
}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetUserRewardDebtLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserRewardDebtLength(&_LmaasLm.CallOpts, _userAddress)
}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) GetUserTokensOwedLength(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "getUserTokensOwedLength", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmSession) GetUserTokensOwedLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserTokensOwedLength(&_LmaasLm.CallOpts, _userAddress)
}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) GetUserTokensOwedLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasLm.Contract.GetUserTokensOwedLength(&_LmaasLm.CallOpts, _userAddress)
}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_LmaasLm *LmaasLmCaller) HasStakingStarted(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "hasStakingStarted")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_LmaasLm *LmaasLmSession) HasStakingStarted() (bool, error) {
	return _LmaasLm.Contract.HasStakingStarted(&_LmaasLm.CallOpts)
}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_LmaasLm *LmaasLmCallerSession) HasStakingStarted() (bool, error) {
	return _LmaasLm.Contract.HasStakingStarted(&_LmaasLm.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_LmaasLm *LmaasLmCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_LmaasLm *LmaasLmSession) Name() (string, error) {
	return _LmaasLm.Contract.Name(&_LmaasLm.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_LmaasLm *LmaasLmCallerSession) Name() (string, error) {
	return _LmaasLm.Contract.Name(&_LmaasLm.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LmaasLm *LmaasLmCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LmaasLm *LmaasLmSession) Owner() (common.Address, error) {
	return _LmaasLm.Contract.Owner(&_LmaasLm.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LmaasLm *LmaasLmCallerSession) Owner() (common.Address, error) {
	return _LmaasLm.Contract.Owner(&_LmaasLm.CallOpts)
}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_LmaasLm *LmaasLmCaller) PreviousCampaigns(opts *bind.CallOpts, arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "previousCampaigns", arg0)

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
func (_LmaasLm *LmaasLmSession) PreviousCampaigns(arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	return _LmaasLm.Contract.PreviousCampaigns(&_LmaasLm.CallOpts, arg0)
}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_LmaasLm *LmaasLmCallerSession) PreviousCampaigns(arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	return _LmaasLm.Contract.PreviousCampaigns(&_LmaasLm.CallOpts, arg0)
}

// ReceiversWhitelist is a free data retrieval call binding the contract method 0x363291dc.
//
// Solidity: function receiversWhitelist(address ) view returns(bool)
func (_LmaasLm *LmaasLmCaller) ReceiversWhitelist(opts *bind.CallOpts, arg0 common.Address) (bool, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "receiversWhitelist", arg0)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// ReceiversWhitelist is a free data retrieval call binding the contract method 0x363291dc.
//
// Solidity: function receiversWhitelist(address ) view returns(bool)
func (_LmaasLm *LmaasLmSession) ReceiversWhitelist(arg0 common.Address) (bool, error) {
	return _LmaasLm.Contract.ReceiversWhitelist(&_LmaasLm.CallOpts, arg0)
}

// ReceiversWhitelist is a free data retrieval call binding the contract method 0x363291dc.
//
// Solidity: function receiversWhitelist(address ) view returns(bool)
func (_LmaasLm *LmaasLmCallerSession) ReceiversWhitelist(arg0 common.Address) (bool, error) {
	return _LmaasLm.Contract.ReceiversWhitelist(&_LmaasLm.CallOpts, arg0)
}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmCaller) RewardPerSecond(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "rewardPerSecond", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmSession) RewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.RewardPerSecond(&_LmaasLm.CallOpts, arg0)
}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) RewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasLm.Contract.RewardPerSecond(&_LmaasLm.CallOpts, arg0)
}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_LmaasLm *LmaasLmCaller) RewardsTokens(opts *bind.CallOpts, arg0 *big.Int) (common.Address, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "rewardsTokens", arg0)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_LmaasLm *LmaasLmSession) RewardsTokens(arg0 *big.Int) (common.Address, error) {
	return _LmaasLm.Contract.RewardsTokens(&_LmaasLm.CallOpts, arg0)
}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_LmaasLm *LmaasLmCallerSession) RewardsTokens(arg0 *big.Int) (common.Address, error) {
	return _LmaasLm.Contract.RewardsTokens(&_LmaasLm.CallOpts, arg0)
}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) StakeLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "stakeLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_LmaasLm *LmaasLmSession) StakeLimit() (*big.Int, error) {
	return _LmaasLm.Contract.StakeLimit(&_LmaasLm.CallOpts)
}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) StakeLimit() (*big.Int, error) {
	return _LmaasLm.Contract.StakeLimit(&_LmaasLm.CallOpts)
}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_LmaasLm *LmaasLmCaller) StakingToken(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "stakingToken")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_LmaasLm *LmaasLmSession) StakingToken() (common.Address, error) {
	return _LmaasLm.Contract.StakingToken(&_LmaasLm.CallOpts)
}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_LmaasLm *LmaasLmCallerSession) StakingToken() (common.Address, error) {
	return _LmaasLm.Contract.StakingToken(&_LmaasLm.CallOpts)
}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) StartTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "startTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_LmaasLm *LmaasLmSession) StartTimestamp() (*big.Int, error) {
	return _LmaasLm.Contract.StartTimestamp(&_LmaasLm.CallOpts)
}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) StartTimestamp() (*big.Int, error) {
	return _LmaasLm.Contract.StartTimestamp(&_LmaasLm.CallOpts)
}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_LmaasLm *LmaasLmCaller) TotalStaked(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "totalStaked")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_LmaasLm *LmaasLmSession) TotalStaked() (*big.Int, error) {
	return _LmaasLm.Contract.TotalStaked(&_LmaasLm.CallOpts)
}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_LmaasLm *LmaasLmCallerSession) TotalStaked() (*big.Int, error) {
	return _LmaasLm.Contract.TotalStaked(&_LmaasLm.CallOpts)
}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_LmaasLm *LmaasLmCaller) UserInfo(opts *bind.CallOpts, arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	var out []interface{}
	err := _LmaasLm.contract.Call(opts, &out, "userInfo", arg0)

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
func (_LmaasLm *LmaasLmSession) UserInfo(arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	return _LmaasLm.Contract.UserInfo(&_LmaasLm.CallOpts, arg0)
}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_LmaasLm *LmaasLmCallerSession) UserInfo(arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	return _LmaasLm.Contract.UserInfo(&_LmaasLm.CallOpts, arg0)
}

// Cancel is a paid mutator transaction binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() returns()
func (_LmaasLm *LmaasLmTransactor) Cancel(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "cancel")
}

// Cancel is a paid mutator transaction binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() returns()
func (_LmaasLm *LmaasLmSession) Cancel() (*types.Transaction, error) {
	return _LmaasLm.Contract.Cancel(&_LmaasLm.TransactOpts)
}

// Cancel is a paid mutator transaction binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() returns()
func (_LmaasLm *LmaasLmTransactorSession) Cancel() (*types.Transaction, error) {
	return _LmaasLm.Contract.Cancel(&_LmaasLm.TransactOpts)
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_LmaasLm *LmaasLmTransactor) CancelExtension(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "cancelExtension")
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_LmaasLm *LmaasLmSession) CancelExtension() (*types.Transaction, error) {
	return _LmaasLm.Contract.CancelExtension(&_LmaasLm.TransactOpts)
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_LmaasLm *LmaasLmTransactorSession) CancelExtension() (*types.Transaction, error) {
	return _LmaasLm.Contract.CancelExtension(&_LmaasLm.TransactOpts)
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_LmaasLm *LmaasLmTransactor) Claim(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "claim")
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_LmaasLm *LmaasLmSession) Claim() (*types.Transaction, error) {
	return _LmaasLm.Contract.Claim(&_LmaasLm.TransactOpts)
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_LmaasLm *LmaasLmTransactorSession) Claim() (*types.Transaction, error) {
	return _LmaasLm.Contract.Claim(&_LmaasLm.TransactOpts)
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_LmaasLm *LmaasLmTransactor) Exit(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "exit")
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_LmaasLm *LmaasLmSession) Exit() (*types.Transaction, error) {
	return _LmaasLm.Contract.Exit(&_LmaasLm.TransactOpts)
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_LmaasLm *LmaasLmTransactorSession) Exit() (*types.Transaction, error) {
	return _LmaasLm.Contract.Exit(&_LmaasLm.TransactOpts)
}

// ExitAndTransfer is a paid mutator transaction binding the contract method 0x2240e63c.
//
// Solidity: function exitAndTransfer(address transferTo) returns()
func (_LmaasLm *LmaasLmTransactor) ExitAndTransfer(opts *bind.TransactOpts, transferTo common.Address) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "exitAndTransfer", transferTo)
}

// ExitAndTransfer is a paid mutator transaction binding the contract method 0x2240e63c.
//
// Solidity: function exitAndTransfer(address transferTo) returns()
func (_LmaasLm *LmaasLmSession) ExitAndTransfer(transferTo common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.ExitAndTransfer(&_LmaasLm.TransactOpts, transferTo)
}

// ExitAndTransfer is a paid mutator transaction binding the contract method 0x2240e63c.
//
// Solidity: function exitAndTransfer(address transferTo) returns()
func (_LmaasLm *LmaasLmTransactorSession) ExitAndTransfer(transferTo common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.ExitAndTransfer(&_LmaasLm.TransactOpts, transferTo)
}

// Extend is a paid mutator transaction binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 _durationTime, uint256[] _rewardPerSecond) returns()
func (_LmaasLm *LmaasLmTransactor) Extend(opts *bind.TransactOpts, _durationTime *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "extend", _durationTime, _rewardPerSecond)
}

// Extend is a paid mutator transaction binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 _durationTime, uint256[] _rewardPerSecond) returns()
func (_LmaasLm *LmaasLmSession) Extend(_durationTime *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Extend(&_LmaasLm.TransactOpts, _durationTime, _rewardPerSecond)
}

// Extend is a paid mutator transaction binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 _durationTime, uint256[] _rewardPerSecond) returns()
func (_LmaasLm *LmaasLmTransactorSession) Extend(_durationTime *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Extend(&_LmaasLm.TransactOpts, _durationTime, _rewardPerSecond)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LmaasLm *LmaasLmTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LmaasLm *LmaasLmSession) RenounceOwnership() (*types.Transaction, error) {
	return _LmaasLm.Contract.RenounceOwnership(&_LmaasLm.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LmaasLm *LmaasLmTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _LmaasLm.Contract.RenounceOwnership(&_LmaasLm.TransactOpts)
}

// SetReceiverWhitelisted is a paid mutator transaction binding the contract method 0xa861a7a3.
//
// Solidity: function setReceiverWhitelisted(address _receiver, bool _whitelisted) returns()
func (_LmaasLm *LmaasLmTransactor) SetReceiverWhitelisted(opts *bind.TransactOpts, _receiver common.Address, _whitelisted bool) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "setReceiverWhitelisted", _receiver, _whitelisted)
}

// SetReceiverWhitelisted is a paid mutator transaction binding the contract method 0xa861a7a3.
//
// Solidity: function setReceiverWhitelisted(address _receiver, bool _whitelisted) returns()
func (_LmaasLm *LmaasLmSession) SetReceiverWhitelisted(_receiver common.Address, _whitelisted bool) (*types.Transaction, error) {
	return _LmaasLm.Contract.SetReceiverWhitelisted(&_LmaasLm.TransactOpts, _receiver, _whitelisted)
}

// SetReceiverWhitelisted is a paid mutator transaction binding the contract method 0xa861a7a3.
//
// Solidity: function setReceiverWhitelisted(address _receiver, bool _whitelisted) returns()
func (_LmaasLm *LmaasLmTransactorSession) SetReceiverWhitelisted(_receiver common.Address, _whitelisted bool) (*types.Transaction, error) {
	return _LmaasLm.Contract.SetReceiverWhitelisted(&_LmaasLm.TransactOpts, _receiver, _whitelisted)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_LmaasLm *LmaasLmTransactor) Stake(opts *bind.TransactOpts, _tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "stake", _tokenAmount)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_LmaasLm *LmaasLmSession) Stake(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Stake(&_LmaasLm.TransactOpts, _tokenAmount)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_LmaasLm *LmaasLmTransactorSession) Stake(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Stake(&_LmaasLm.TransactOpts, _tokenAmount)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_LmaasLm *LmaasLmTransactor) Start(opts *bind.TransactOpts, _startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "start", _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_LmaasLm *LmaasLmSession) Start(_startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Start(&_LmaasLm.TransactOpts, _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_LmaasLm *LmaasLmTransactorSession) Start(_startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Start(&_LmaasLm.TransactOpts, _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LmaasLm *LmaasLmTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LmaasLm *LmaasLmSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.TransferOwnership(&_LmaasLm.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LmaasLm *LmaasLmTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.TransferOwnership(&_LmaasLm.TransactOpts, newOwner)
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_LmaasLm *LmaasLmTransactor) UpdateRewardMultipliers(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "updateRewardMultipliers")
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_LmaasLm *LmaasLmSession) UpdateRewardMultipliers() (*types.Transaction, error) {
	return _LmaasLm.Contract.UpdateRewardMultipliers(&_LmaasLm.TransactOpts)
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_LmaasLm *LmaasLmTransactorSession) UpdateRewardMultipliers() (*types.Transaction, error) {
	return _LmaasLm.Contract.UpdateRewardMultipliers(&_LmaasLm.TransactOpts)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_LmaasLm *LmaasLmTransactor) Withdraw(opts *bind.TransactOpts, _tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "withdraw", _tokenAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_LmaasLm *LmaasLmSession) Withdraw(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Withdraw(&_LmaasLm.TransactOpts, _tokenAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_LmaasLm *LmaasLmTransactorSession) Withdraw(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasLm.Contract.Withdraw(&_LmaasLm.TransactOpts, _tokenAmount)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_LmaasLm *LmaasLmTransactor) WithdrawExcessRewards(opts *bind.TransactOpts, _recipient common.Address) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "withdrawExcessRewards", _recipient)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_LmaasLm *LmaasLmSession) WithdrawExcessRewards(_recipient common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.WithdrawExcessRewards(&_LmaasLm.TransactOpts, _recipient)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_LmaasLm *LmaasLmTransactorSession) WithdrawExcessRewards(_recipient common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.WithdrawExcessRewards(&_LmaasLm.TransactOpts, _recipient)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_LmaasLm *LmaasLmTransactor) WithdrawTokens(opts *bind.TransactOpts, _recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _LmaasLm.contract.Transact(opts, "withdrawTokens", _recipient, _token)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_LmaasLm *LmaasLmSession) WithdrawTokens(_recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.WithdrawTokens(&_LmaasLm.TransactOpts, _recipient, _token)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_LmaasLm *LmaasLmTransactorSession) WithdrawTokens(_recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _LmaasLm.Contract.WithdrawTokens(&_LmaasLm.TransactOpts, _recipient, _token)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LmaasLm *LmaasLmTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasLm.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LmaasLm *LmaasLmSession) Receive() (*types.Transaction, error) {
	return _LmaasLm.Contract.Receive(&_LmaasLm.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LmaasLm *LmaasLmTransactorSession) Receive() (*types.Transaction, error) {
	return _LmaasLm.Contract.Receive(&_LmaasLm.TransactOpts)
}

// LmaasLmClaimedIterator is returned from FilterClaimed and is used to iterate over the raw logs and unpacked data for Claimed events raised by the LmaasLm contract.
type LmaasLmClaimedIterator struct {
	Event *LmaasLmClaimed // Event containing the contract specifics and raw log

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
func (it *LmaasLmClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmClaimed)
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
		it.Event = new(LmaasLmClaimed)
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
func (it *LmaasLmClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmClaimed represents a Claimed event raised by the LmaasLm contract.
type LmaasLmClaimed struct {
	User   common.Address
	Amount *big.Int
	Token  common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterClaimed is a free log retrieval operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_LmaasLm *LmaasLmFilterer) FilterClaimed(opts *bind.FilterOpts, user []common.Address) (*LmaasLmClaimedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "Claimed", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasLmClaimedIterator{contract: _LmaasLm.contract, event: "Claimed", logs: logs, sub: sub}, nil
}

// WatchClaimed is a free log subscription operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_LmaasLm *LmaasLmFilterer) WatchClaimed(opts *bind.WatchOpts, sink chan<- *LmaasLmClaimed, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "Claimed", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmClaimed)
				if err := _LmaasLm.contract.UnpackLog(event, "Claimed", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseClaimed(log types.Log) (*LmaasLmClaimed, error) {
	event := new(LmaasLmClaimed)
	if err := _LmaasLm.contract.UnpackLog(event, "Claimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasLmExitedIterator is returned from FilterExited and is used to iterate over the raw logs and unpacked data for Exited events raised by the LmaasLm contract.
type LmaasLmExitedIterator struct {
	Event *LmaasLmExited // Event containing the contract specifics and raw log

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
func (it *LmaasLmExitedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmExited)
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
		it.Event = new(LmaasLmExited)
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
func (it *LmaasLmExitedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmExitedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmExited represents a Exited event raised by the LmaasLm contract.
type LmaasLmExited struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterExited is a free log retrieval operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_LmaasLm *LmaasLmFilterer) FilterExited(opts *bind.FilterOpts, user []common.Address) (*LmaasLmExitedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "Exited", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasLmExitedIterator{contract: _LmaasLm.contract, event: "Exited", logs: logs, sub: sub}, nil
}

// WatchExited is a free log subscription operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_LmaasLm *LmaasLmFilterer) WatchExited(opts *bind.WatchOpts, sink chan<- *LmaasLmExited, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "Exited", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmExited)
				if err := _LmaasLm.contract.UnpackLog(event, "Exited", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseExited(log types.Log) (*LmaasLmExited, error) {
	event := new(LmaasLmExited)
	if err := _LmaasLm.contract.UnpackLog(event, "Exited", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasLmExtendedIterator is returned from FilterExtended and is used to iterate over the raw logs and unpacked data for Extended events raised by the LmaasLm contract.
type LmaasLmExtendedIterator struct {
	Event *LmaasLmExtended // Event containing the contract specifics and raw log

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
func (it *LmaasLmExtendedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmExtended)
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
		it.Event = new(LmaasLmExtended)
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
func (it *LmaasLmExtendedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmExtendedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmExtended represents a Extended event raised by the LmaasLm contract.
type LmaasLmExtended struct {
	NewStartTimestamp   *big.Int
	NewEndTimestamp     *big.Int
	NewRewardsPerSecond []*big.Int
	Raw                 types.Log // Blockchain specific contextual infos
}

// FilterExtended is a free log retrieval operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_LmaasLm *LmaasLmFilterer) FilterExtended(opts *bind.FilterOpts) (*LmaasLmExtendedIterator, error) {

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "Extended")
	if err != nil {
		return nil, err
	}
	return &LmaasLmExtendedIterator{contract: _LmaasLm.contract, event: "Extended", logs: logs, sub: sub}, nil
}

// WatchExtended is a free log subscription operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_LmaasLm *LmaasLmFilterer) WatchExtended(opts *bind.WatchOpts, sink chan<- *LmaasLmExtended) (event.Subscription, error) {

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "Extended")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmExtended)
				if err := _LmaasLm.contract.UnpackLog(event, "Extended", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseExtended(log types.Log) (*LmaasLmExtended, error) {
	event := new(LmaasLmExtended)
	if err := _LmaasLm.contract.UnpackLog(event, "Extended", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasLmOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the LmaasLm contract.
type LmaasLmOwnershipTransferredIterator struct {
	Event *LmaasLmOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *LmaasLmOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmOwnershipTransferred)
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
		it.Event = new(LmaasLmOwnershipTransferred)
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
func (it *LmaasLmOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmOwnershipTransferred represents a OwnershipTransferred event raised by the LmaasLm contract.
type LmaasLmOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_LmaasLm *LmaasLmFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*LmaasLmOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &LmaasLmOwnershipTransferredIterator{contract: _LmaasLm.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_LmaasLm *LmaasLmFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *LmaasLmOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmOwnershipTransferred)
				if err := _LmaasLm.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseOwnershipTransferred(log types.Log) (*LmaasLmOwnershipTransferred, error) {
	event := new(LmaasLmOwnershipTransferred)
	if err := _LmaasLm.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasLmStakedIterator is returned from FilterStaked and is used to iterate over the raw logs and unpacked data for Staked events raised by the LmaasLm contract.
type LmaasLmStakedIterator struct {
	Event *LmaasLmStaked // Event containing the contract specifics and raw log

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
func (it *LmaasLmStakedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmStaked)
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
		it.Event = new(LmaasLmStaked)
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
func (it *LmaasLmStakedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmStakedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmStaked represents a Staked event raised by the LmaasLm contract.
type LmaasLmStaked struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterStaked is a free log retrieval operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_LmaasLm *LmaasLmFilterer) FilterStaked(opts *bind.FilterOpts, user []common.Address) (*LmaasLmStakedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "Staked", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasLmStakedIterator{contract: _LmaasLm.contract, event: "Staked", logs: logs, sub: sub}, nil
}

// WatchStaked is a free log subscription operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_LmaasLm *LmaasLmFilterer) WatchStaked(opts *bind.WatchOpts, sink chan<- *LmaasLmStaked, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "Staked", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmStaked)
				if err := _LmaasLm.contract.UnpackLog(event, "Staked", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseStaked(log types.Log) (*LmaasLmStaked, error) {
	event := new(LmaasLmStaked)
	if err := _LmaasLm.contract.UnpackLog(event, "Staked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasLmStartedIterator is returned from FilterStarted and is used to iterate over the raw logs and unpacked data for Started events raised by the LmaasLm contract.
type LmaasLmStartedIterator struct {
	Event *LmaasLmStarted // Event containing the contract specifics and raw log

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
func (it *LmaasLmStartedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmStarted)
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
		it.Event = new(LmaasLmStarted)
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
func (it *LmaasLmStartedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmStartedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmStarted represents a Started event raised by the LmaasLm contract.
type LmaasLmStarted struct {
	StartTimestamp   *big.Int
	EndTimestamp     *big.Int
	RewardsPerSecond []*big.Int
	Raw              types.Log // Blockchain specific contextual infos
}

// FilterStarted is a free log retrieval operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_LmaasLm *LmaasLmFilterer) FilterStarted(opts *bind.FilterOpts) (*LmaasLmStartedIterator, error) {

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "Started")
	if err != nil {
		return nil, err
	}
	return &LmaasLmStartedIterator{contract: _LmaasLm.contract, event: "Started", logs: logs, sub: sub}, nil
}

// WatchStarted is a free log subscription operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_LmaasLm *LmaasLmFilterer) WatchStarted(opts *bind.WatchOpts, sink chan<- *LmaasLmStarted) (event.Subscription, error) {

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "Started")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmStarted)
				if err := _LmaasLm.contract.UnpackLog(event, "Started", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseStarted(log types.Log) (*LmaasLmStarted, error) {
	event := new(LmaasLmStarted)
	if err := _LmaasLm.contract.UnpackLog(event, "Started", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasLmWithdrawnIterator is returned from FilterWithdrawn and is used to iterate over the raw logs and unpacked data for Withdrawn events raised by the LmaasLm contract.
type LmaasLmWithdrawnIterator struct {
	Event *LmaasLmWithdrawn // Event containing the contract specifics and raw log

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
func (it *LmaasLmWithdrawnIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasLmWithdrawn)
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
		it.Event = new(LmaasLmWithdrawn)
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
func (it *LmaasLmWithdrawnIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasLmWithdrawnIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasLmWithdrawn represents a Withdrawn event raised by the LmaasLm contract.
type LmaasLmWithdrawn struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterWithdrawn is a free log retrieval operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_LmaasLm *LmaasLmFilterer) FilterWithdrawn(opts *bind.FilterOpts, user []common.Address) (*LmaasLmWithdrawnIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.FilterLogs(opts, "Withdrawn", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasLmWithdrawnIterator{contract: _LmaasLm.contract, event: "Withdrawn", logs: logs, sub: sub}, nil
}

// WatchWithdrawn is a free log subscription operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_LmaasLm *LmaasLmFilterer) WatchWithdrawn(opts *bind.WatchOpts, sink chan<- *LmaasLmWithdrawn, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasLm.contract.WatchLogs(opts, "Withdrawn", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasLmWithdrawn)
				if err := _LmaasLm.contract.UnpackLog(event, "Withdrawn", log); err != nil {
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
func (_LmaasLm *LmaasLmFilterer) ParseWithdrawn(log types.Log) (*LmaasLmWithdrawn, error) {
	event := new(LmaasLmWithdrawn)
	if err := _LmaasLm.contract.UnpackLog(event, "Withdrawn", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
