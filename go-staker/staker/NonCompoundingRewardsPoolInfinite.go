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

// LmaasIsMetaData contains all meta data concerning the LmaasIs contract.
var LmaasIsMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"_stakingToken\",\"type\":\"address\"},{\"internalType\":\"address[]\",\"name\":\"_rewardsTokens\",\"type\":\"address[]\"},{\"internalType\":\"uint256\",\"name\":\"_stakeLimit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_contractStakeLimit\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"Claimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Exited\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newStartTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newEndTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"newRewardsPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"Extended\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Staked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"startTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"endTimestamp\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"rewardsPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"Started\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Withdrawn\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"accumulatedRewardMultiplier\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cancel\",\"outputs\":[],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"cancelExtension\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"claim\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"contractStakeLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"endTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"epochCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"epochDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"exit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"name\":\"extend\",\"outputs\":[],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"extensionDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"extensionRewardPerSecond\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_rewardTokenIndex\",\"type\":\"uint256\"}],\"name\":\"getAvailableBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getPreviousCampaignsCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getRewardTokensCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_tokenIndex\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_time\",\"type\":\"uint256\"}],\"name\":\"getUserAccumulatedReward\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getUserOwedTokens\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getUserRewardDebt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"getUserRewardDebtLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_userAddress\",\"type\":\"address\"}],\"name\":\"getUserTokensOwedLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"hasStakingStarted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"previousCampaigns\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"startTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endTimestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"realStartTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardPerSecond\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardTokenDecimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"rewardsTokens\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenAmount\",\"type\":\"uint256\"}],\"name\":\"stake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakeLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakingToken\",\"outputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"stakingTokenDecimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_startTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_endTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"_rewardPerSecond\",\"type\":\"uint256[]\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_epochDuration\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_startTimestamp\",\"type\":\"uint256\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_epochDuration\",\"type\":\"uint256\"}],\"name\":\"start\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"startTimestamp\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalStaked\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"updateRewardMultipliers\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"firstStakedTimestamp\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amountStaked\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"userStakedEpoch\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_tokenAmount\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_recipient\",\"type\":\"address\"}],\"name\":\"withdrawExcessRewards\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_recipient\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_token\",\"type\":\"address\"}],\"name\":\"withdrawTokens\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// LmaasIsABI is the input ABI used to generate the binding from.
// Deprecated: Use LmaasIsMetaData.ABI instead.
var LmaasIsABI = LmaasIsMetaData.ABI

// LmaasIs is an auto generated Go binding around an Ethereum contract.
type LmaasIs struct {
	LmaasIsCaller     // Read-only binding to the contract
	LmaasIsTransactor // Write-only binding to the contract
	LmaasIsFilterer   // Log filterer for contract events
}

// LmaasIsCaller is an auto generated read-only Go binding around an Ethereum contract.
type LmaasIsCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LmaasIsTransactor is an auto generated write-only Go binding around an Ethereum contract.
type LmaasIsTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LmaasIsFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type LmaasIsFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// LmaasIsSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type LmaasIsSession struct {
	Contract     *LmaasIs          // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// LmaasIsCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type LmaasIsCallerSession struct {
	Contract *LmaasIsCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts  // Call options to use throughout this session
}

// LmaasIsTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type LmaasIsTransactorSession struct {
	Contract     *LmaasIsTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// LmaasIsRaw is an auto generated low-level Go binding around an Ethereum contract.
type LmaasIsRaw struct {
	Contract *LmaasIs // Generic contract binding to access the raw methods on
}

// LmaasIsCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type LmaasIsCallerRaw struct {
	Contract *LmaasIsCaller // Generic read-only contract binding to access the raw methods on
}

// LmaasIsTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type LmaasIsTransactorRaw struct {
	Contract *LmaasIsTransactor // Generic write-only contract binding to access the raw methods on
}

// NewLmaasIs creates a new instance of LmaasIs, bound to a specific deployed contract.
func NewLmaasIs(address common.Address, backend bind.ContractBackend) (*LmaasIs, error) {
	contract, err := bindLmaasIs(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &LmaasIs{LmaasIsCaller: LmaasIsCaller{contract: contract}, LmaasIsTransactor: LmaasIsTransactor{contract: contract}, LmaasIsFilterer: LmaasIsFilterer{contract: contract}}, nil
}

// NewLmaasIsCaller creates a new read-only instance of LmaasIs, bound to a specific deployed contract.
func NewLmaasIsCaller(address common.Address, caller bind.ContractCaller) (*LmaasIsCaller, error) {
	contract, err := bindLmaasIs(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &LmaasIsCaller{contract: contract}, nil
}

// NewLmaasIsTransactor creates a new write-only instance of LmaasIs, bound to a specific deployed contract.
func NewLmaasIsTransactor(address common.Address, transactor bind.ContractTransactor) (*LmaasIsTransactor, error) {
	contract, err := bindLmaasIs(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &LmaasIsTransactor{contract: contract}, nil
}

// NewLmaasIsFilterer creates a new log filterer instance of LmaasIs, bound to a specific deployed contract.
func NewLmaasIsFilterer(address common.Address, filterer bind.ContractFilterer) (*LmaasIsFilterer, error) {
	contract, err := bindLmaasIs(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &LmaasIsFilterer{contract: contract}, nil
}

// bindLmaasIs binds a generic wrapper to an already deployed contract.
func bindLmaasIs(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := LmaasIsMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_LmaasIs *LmaasIsRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _LmaasIs.Contract.LmaasIsCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_LmaasIs *LmaasIsRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.Contract.LmaasIsTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_LmaasIs *LmaasIsRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _LmaasIs.Contract.LmaasIsTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_LmaasIs *LmaasIsCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _LmaasIs.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_LmaasIs *LmaasIsTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_LmaasIs *LmaasIsTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _LmaasIs.Contract.contract.Transact(opts, method, params...)
}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) AccumulatedRewardMultiplier(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "accumulatedRewardMultiplier", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsSession) AccumulatedRewardMultiplier(arg0 *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.AccumulatedRewardMultiplier(&_LmaasIs.CallOpts, arg0)
}

// AccumulatedRewardMultiplier is a free data retrieval call binding the contract method 0xfb58cad1.
//
// Solidity: function accumulatedRewardMultiplier(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) AccumulatedRewardMultiplier(arg0 *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.AccumulatedRewardMultiplier(&_LmaasIs.CallOpts, arg0)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) BalanceOf(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "balanceOf", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsSession) BalanceOf(_userAddress common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.BalanceOf(&_LmaasIs.CallOpts, _userAddress)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) BalanceOf(_userAddress common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.BalanceOf(&_LmaasIs.CallOpts, _userAddress)
}

// Cancel is a free data retrieval call binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() pure returns()
func (_LmaasIs *LmaasIsCaller) Cancel(opts *bind.CallOpts) error {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "cancel")

	if err != nil {
		return err
	}

	return err

}

// Cancel is a free data retrieval call binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() pure returns()
func (_LmaasIs *LmaasIsSession) Cancel() error {
	return _LmaasIs.Contract.Cancel(&_LmaasIs.CallOpts)
}

// Cancel is a free data retrieval call binding the contract method 0xea8a1af0.
//
// Solidity: function cancel() pure returns()
func (_LmaasIs *LmaasIsCallerSession) Cancel() error {
	return _LmaasIs.Contract.Cancel(&_LmaasIs.CallOpts)
}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) ContractStakeLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "contractStakeLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_LmaasIs *LmaasIsSession) ContractStakeLimit() (*big.Int, error) {
	return _LmaasIs.Contract.ContractStakeLimit(&_LmaasIs.CallOpts)
}

// ContractStakeLimit is a free data retrieval call binding the contract method 0x03d1dae0.
//
// Solidity: function contractStakeLimit() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) ContractStakeLimit() (*big.Int, error) {
	return _LmaasIs.Contract.ContractStakeLimit(&_LmaasIs.CallOpts)
}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) EndTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "endTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsSession) EndTimestamp() (*big.Int, error) {
	return _LmaasIs.Contract.EndTimestamp(&_LmaasIs.CallOpts)
}

// EndTimestamp is a free data retrieval call binding the contract method 0xa85adeab.
//
// Solidity: function endTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) EndTimestamp() (*big.Int, error) {
	return _LmaasIs.Contract.EndTimestamp(&_LmaasIs.CallOpts)
}

// EpochCount is a free data retrieval call binding the contract method 0x829965cc.
//
// Solidity: function epochCount() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) EpochCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "epochCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EpochCount is a free data retrieval call binding the contract method 0x829965cc.
//
// Solidity: function epochCount() view returns(uint256)
func (_LmaasIs *LmaasIsSession) EpochCount() (*big.Int, error) {
	return _LmaasIs.Contract.EpochCount(&_LmaasIs.CallOpts)
}

// EpochCount is a free data retrieval call binding the contract method 0x829965cc.
//
// Solidity: function epochCount() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) EpochCount() (*big.Int, error) {
	return _LmaasIs.Contract.EpochCount(&_LmaasIs.CallOpts)
}

// EpochDuration is a free data retrieval call binding the contract method 0x4ff0876a.
//
// Solidity: function epochDuration() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) EpochDuration(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "epochDuration")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// EpochDuration is a free data retrieval call binding the contract method 0x4ff0876a.
//
// Solidity: function epochDuration() view returns(uint256)
func (_LmaasIs *LmaasIsSession) EpochDuration() (*big.Int, error) {
	return _LmaasIs.Contract.EpochDuration(&_LmaasIs.CallOpts)
}

// EpochDuration is a free data retrieval call binding the contract method 0x4ff0876a.
//
// Solidity: function epochDuration() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) EpochDuration() (*big.Int, error) {
	return _LmaasIs.Contract.EpochDuration(&_LmaasIs.CallOpts)
}

// Extend is a free data retrieval call binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 , uint256[] ) pure returns()
func (_LmaasIs *LmaasIsCaller) Extend(opts *bind.CallOpts, arg0 *big.Int, arg1 []*big.Int) error {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "extend", arg0, arg1)

	if err != nil {
		return err
	}

	return err

}

// Extend is a free data retrieval call binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 , uint256[] ) pure returns()
func (_LmaasIs *LmaasIsSession) Extend(arg0 *big.Int, arg1 []*big.Int) error {
	return _LmaasIs.Contract.Extend(&_LmaasIs.CallOpts, arg0, arg1)
}

// Extend is a free data retrieval call binding the contract method 0x6c32bf69.
//
// Solidity: function extend(uint256 , uint256[] ) pure returns()
func (_LmaasIs *LmaasIsCallerSession) Extend(arg0 *big.Int, arg1 []*big.Int) error {
	return _LmaasIs.Contract.Extend(&_LmaasIs.CallOpts, arg0, arg1)
}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) ExtensionDuration(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "extensionDuration")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_LmaasIs *LmaasIsSession) ExtensionDuration() (*big.Int, error) {
	return _LmaasIs.Contract.ExtensionDuration(&_LmaasIs.CallOpts)
}

// ExtensionDuration is a free data retrieval call binding the contract method 0x2037424b.
//
// Solidity: function extensionDuration() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) ExtensionDuration() (*big.Int, error) {
	return _LmaasIs.Contract.ExtensionDuration(&_LmaasIs.CallOpts)
}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) ExtensionRewardPerSecond(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "extensionRewardPerSecond", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsSession) ExtensionRewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.ExtensionRewardPerSecond(&_LmaasIs.CallOpts, arg0)
}

// ExtensionRewardPerSecond is a free data retrieval call binding the contract method 0x602e007a.
//
// Solidity: function extensionRewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) ExtensionRewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.ExtensionRewardPerSecond(&_LmaasIs.CallOpts, arg0)
}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetAvailableBalance(opts *bind.CallOpts, _rewardTokenIndex *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getAvailableBalance", _rewardTokenIndex)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetAvailableBalance(_rewardTokenIndex *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetAvailableBalance(&_LmaasIs.CallOpts, _rewardTokenIndex)
}

// GetAvailableBalance is a free data retrieval call binding the contract method 0xaabef0db.
//
// Solidity: function getAvailableBalance(uint256 _rewardTokenIndex) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetAvailableBalance(_rewardTokenIndex *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetAvailableBalance(&_LmaasIs.CallOpts, _rewardTokenIndex)
}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetPreviousCampaignsCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getPreviousCampaignsCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetPreviousCampaignsCount() (*big.Int, error) {
	return _LmaasIs.Contract.GetPreviousCampaignsCount(&_LmaasIs.CallOpts)
}

// GetPreviousCampaignsCount is a free data retrieval call binding the contract method 0x8285d045.
//
// Solidity: function getPreviousCampaignsCount() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetPreviousCampaignsCount() (*big.Int, error) {
	return _LmaasIs.Contract.GetPreviousCampaignsCount(&_LmaasIs.CallOpts)
}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetRewardTokensCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getRewardTokensCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetRewardTokensCount() (*big.Int, error) {
	return _LmaasIs.Contract.GetRewardTokensCount(&_LmaasIs.CallOpts)
}

// GetRewardTokensCount is a free data retrieval call binding the contract method 0x2d9e88e1.
//
// Solidity: function getRewardTokensCount() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetRewardTokensCount() (*big.Int, error) {
	return _LmaasIs.Contract.GetRewardTokensCount(&_LmaasIs.CallOpts)
}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetUserAccumulatedReward(opts *bind.CallOpts, _userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getUserAccumulatedReward", _userAddress, _tokenIndex, _time)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetUserAccumulatedReward(_userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserAccumulatedReward(&_LmaasIs.CallOpts, _userAddress, _tokenIndex, _time)
}

// GetUserAccumulatedReward is a free data retrieval call binding the contract method 0xc97559ce.
//
// Solidity: function getUserAccumulatedReward(address _userAddress, uint256 _tokenIndex, uint256 _time) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetUserAccumulatedReward(_userAddress common.Address, _tokenIndex *big.Int, _time *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserAccumulatedReward(&_LmaasIs.CallOpts, _userAddress, _tokenIndex, _time)
}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetUserOwedTokens(opts *bind.CallOpts, _userAddress common.Address, _index *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getUserOwedTokens", _userAddress, _index)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetUserOwedTokens(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserOwedTokens(&_LmaasIs.CallOpts, _userAddress, _index)
}

// GetUserOwedTokens is a free data retrieval call binding the contract method 0xce415302.
//
// Solidity: function getUserOwedTokens(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetUserOwedTokens(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserOwedTokens(&_LmaasIs.CallOpts, _userAddress, _index)
}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetUserRewardDebt(opts *bind.CallOpts, _userAddress common.Address, _index *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getUserRewardDebt", _userAddress, _index)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetUserRewardDebt(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserRewardDebt(&_LmaasIs.CallOpts, _userAddress, _index)
}

// GetUserRewardDebt is a free data retrieval call binding the contract method 0xf27d0264.
//
// Solidity: function getUserRewardDebt(address _userAddress, uint256 _index) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetUserRewardDebt(_userAddress common.Address, _index *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserRewardDebt(&_LmaasIs.CallOpts, _userAddress, _index)
}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetUserRewardDebtLength(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getUserRewardDebtLength", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetUserRewardDebtLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserRewardDebtLength(&_LmaasIs.CallOpts, _userAddress)
}

// GetUserRewardDebtLength is a free data retrieval call binding the contract method 0x0084c927.
//
// Solidity: function getUserRewardDebtLength(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetUserRewardDebtLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserRewardDebtLength(&_LmaasIs.CallOpts, _userAddress)
}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) GetUserTokensOwedLength(opts *bind.CallOpts, _userAddress common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "getUserTokensOwedLength", _userAddress)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsSession) GetUserTokensOwedLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserTokensOwedLength(&_LmaasIs.CallOpts, _userAddress)
}

// GetUserTokensOwedLength is a free data retrieval call binding the contract method 0xa1292aea.
//
// Solidity: function getUserTokensOwedLength(address _userAddress) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) GetUserTokensOwedLength(_userAddress common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.GetUserTokensOwedLength(&_LmaasIs.CallOpts, _userAddress)
}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_LmaasIs *LmaasIsCaller) HasStakingStarted(opts *bind.CallOpts) (bool, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "hasStakingStarted")

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_LmaasIs *LmaasIsSession) HasStakingStarted() (bool, error) {
	return _LmaasIs.Contract.HasStakingStarted(&_LmaasIs.CallOpts)
}

// HasStakingStarted is a free data retrieval call binding the contract method 0x57b4f01f.
//
// Solidity: function hasStakingStarted() view returns(bool)
func (_LmaasIs *LmaasIsCallerSession) HasStakingStarted() (bool, error) {
	return _LmaasIs.Contract.HasStakingStarted(&_LmaasIs.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_LmaasIs *LmaasIsCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_LmaasIs *LmaasIsSession) Name() (string, error) {
	return _LmaasIs.Contract.Name(&_LmaasIs.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_LmaasIs *LmaasIsCallerSession) Name() (string, error) {
	return _LmaasIs.Contract.Name(&_LmaasIs.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LmaasIs *LmaasIsCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LmaasIs *LmaasIsSession) Owner() (common.Address, error) {
	return _LmaasIs.Contract.Owner(&_LmaasIs.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_LmaasIs *LmaasIsCallerSession) Owner() (common.Address, error) {
	return _LmaasIs.Contract.Owner(&_LmaasIs.CallOpts)
}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_LmaasIs *LmaasIsCaller) PreviousCampaigns(opts *bind.CallOpts, arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "previousCampaigns", arg0)

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
func (_LmaasIs *LmaasIsSession) PreviousCampaigns(arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	return _LmaasIs.Contract.PreviousCampaigns(&_LmaasIs.CallOpts, arg0)
}

// PreviousCampaigns is a free data retrieval call binding the contract method 0x9d662b99.
//
// Solidity: function previousCampaigns(uint256 ) view returns(uint256 startTimestamp, uint256 endTimestamp)
func (_LmaasIs *LmaasIsCallerSession) PreviousCampaigns(arg0 *big.Int) (struct {
	StartTimestamp *big.Int
	EndTimestamp   *big.Int
}, error) {
	return _LmaasIs.Contract.PreviousCampaigns(&_LmaasIs.CallOpts, arg0)
}

// RealStartTimestamp is a free data retrieval call binding the contract method 0x4a74662d.
//
// Solidity: function realStartTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) RealStartTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "realStartTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RealStartTimestamp is a free data retrieval call binding the contract method 0x4a74662d.
//
// Solidity: function realStartTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsSession) RealStartTimestamp() (*big.Int, error) {
	return _LmaasIs.Contract.RealStartTimestamp(&_LmaasIs.CallOpts)
}

// RealStartTimestamp is a free data retrieval call binding the contract method 0x4a74662d.
//
// Solidity: function realStartTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) RealStartTimestamp() (*big.Int, error) {
	return _LmaasIs.Contract.RealStartTimestamp(&_LmaasIs.CallOpts)
}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) RewardPerSecond(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "rewardPerSecond", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsSession) RewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.RewardPerSecond(&_LmaasIs.CallOpts, arg0)
}

// RewardPerSecond is a free data retrieval call binding the contract method 0xfd67fd7c.
//
// Solidity: function rewardPerSecond(uint256 ) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) RewardPerSecond(arg0 *big.Int) (*big.Int, error) {
	return _LmaasIs.Contract.RewardPerSecond(&_LmaasIs.CallOpts, arg0)
}

// RewardTokenDecimals is a free data retrieval call binding the contract method 0xb8ba2430.
//
// Solidity: function rewardTokenDecimals(uint256 ) view returns(uint8)
func (_LmaasIs *LmaasIsCaller) RewardTokenDecimals(opts *bind.CallOpts, arg0 *big.Int) (uint8, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "rewardTokenDecimals", arg0)

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// RewardTokenDecimals is a free data retrieval call binding the contract method 0xb8ba2430.
//
// Solidity: function rewardTokenDecimals(uint256 ) view returns(uint8)
func (_LmaasIs *LmaasIsSession) RewardTokenDecimals(arg0 *big.Int) (uint8, error) {
	return _LmaasIs.Contract.RewardTokenDecimals(&_LmaasIs.CallOpts, arg0)
}

// RewardTokenDecimals is a free data retrieval call binding the contract method 0xb8ba2430.
//
// Solidity: function rewardTokenDecimals(uint256 ) view returns(uint8)
func (_LmaasIs *LmaasIsCallerSession) RewardTokenDecimals(arg0 *big.Int) (uint8, error) {
	return _LmaasIs.Contract.RewardTokenDecimals(&_LmaasIs.CallOpts, arg0)
}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_LmaasIs *LmaasIsCaller) RewardsTokens(opts *bind.CallOpts, arg0 *big.Int) (common.Address, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "rewardsTokens", arg0)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_LmaasIs *LmaasIsSession) RewardsTokens(arg0 *big.Int) (common.Address, error) {
	return _LmaasIs.Contract.RewardsTokens(&_LmaasIs.CallOpts, arg0)
}

// RewardsTokens is a free data retrieval call binding the contract method 0xb6d0dcd8.
//
// Solidity: function rewardsTokens(uint256 ) view returns(address)
func (_LmaasIs *LmaasIsCallerSession) RewardsTokens(arg0 *big.Int) (common.Address, error) {
	return _LmaasIs.Contract.RewardsTokens(&_LmaasIs.CallOpts, arg0)
}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) StakeLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "stakeLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_LmaasIs *LmaasIsSession) StakeLimit() (*big.Int, error) {
	return _LmaasIs.Contract.StakeLimit(&_LmaasIs.CallOpts)
}

// StakeLimit is a free data retrieval call binding the contract method 0x45ef79af.
//
// Solidity: function stakeLimit() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) StakeLimit() (*big.Int, error) {
	return _LmaasIs.Contract.StakeLimit(&_LmaasIs.CallOpts)
}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_LmaasIs *LmaasIsCaller) StakingToken(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "stakingToken")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_LmaasIs *LmaasIsSession) StakingToken() (common.Address, error) {
	return _LmaasIs.Contract.StakingToken(&_LmaasIs.CallOpts)
}

// StakingToken is a free data retrieval call binding the contract method 0x72f702f3.
//
// Solidity: function stakingToken() view returns(address)
func (_LmaasIs *LmaasIsCallerSession) StakingToken() (common.Address, error) {
	return _LmaasIs.Contract.StakingToken(&_LmaasIs.CallOpts)
}

// StakingTokenDecimals is a free data retrieval call binding the contract method 0xb9f7a7b5.
//
// Solidity: function stakingTokenDecimals() view returns(uint8)
func (_LmaasIs *LmaasIsCaller) StakingTokenDecimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "stakingTokenDecimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// StakingTokenDecimals is a free data retrieval call binding the contract method 0xb9f7a7b5.
//
// Solidity: function stakingTokenDecimals() view returns(uint8)
func (_LmaasIs *LmaasIsSession) StakingTokenDecimals() (uint8, error) {
	return _LmaasIs.Contract.StakingTokenDecimals(&_LmaasIs.CallOpts)
}

// StakingTokenDecimals is a free data retrieval call binding the contract method 0xb9f7a7b5.
//
// Solidity: function stakingTokenDecimals() view returns(uint8)
func (_LmaasIs *LmaasIsCallerSession) StakingTokenDecimals() (uint8, error) {
	return _LmaasIs.Contract.StakingTokenDecimals(&_LmaasIs.CallOpts)
}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) StartTimestamp(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "startTimestamp")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsSession) StartTimestamp() (*big.Int, error) {
	return _LmaasIs.Contract.StartTimestamp(&_LmaasIs.CallOpts)
}

// StartTimestamp is a free data retrieval call binding the contract method 0xe6fd48bc.
//
// Solidity: function startTimestamp() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) StartTimestamp() (*big.Int, error) {
	return _LmaasIs.Contract.StartTimestamp(&_LmaasIs.CallOpts)
}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_LmaasIs *LmaasIsCaller) TotalStaked(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "totalStaked")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_LmaasIs *LmaasIsSession) TotalStaked() (*big.Int, error) {
	return _LmaasIs.Contract.TotalStaked(&_LmaasIs.CallOpts)
}

// TotalStaked is a free data retrieval call binding the contract method 0x817b1cd2.
//
// Solidity: function totalStaked() view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) TotalStaked() (*big.Int, error) {
	return _LmaasIs.Contract.TotalStaked(&_LmaasIs.CallOpts)
}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_LmaasIs *LmaasIsCaller) UserInfo(opts *bind.CallOpts, arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "userInfo", arg0)

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
func (_LmaasIs *LmaasIsSession) UserInfo(arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	return _LmaasIs.Contract.UserInfo(&_LmaasIs.CallOpts, arg0)
}

// UserInfo is a free data retrieval call binding the contract method 0x1959a002.
//
// Solidity: function userInfo(address ) view returns(uint256 firstStakedTimestamp, uint256 amountStaked)
func (_LmaasIs *LmaasIsCallerSession) UserInfo(arg0 common.Address) (struct {
	FirstStakedTimestamp *big.Int
	AmountStaked         *big.Int
}, error) {
	return _LmaasIs.Contract.UserInfo(&_LmaasIs.CallOpts, arg0)
}

// UserStakedEpoch is a free data retrieval call binding the contract method 0xb7b8e51d.
//
// Solidity: function userStakedEpoch(address ) view returns(uint256)
func (_LmaasIs *LmaasIsCaller) UserStakedEpoch(opts *bind.CallOpts, arg0 common.Address) (*big.Int, error) {
	var out []interface{}
	err := _LmaasIs.contract.Call(opts, &out, "userStakedEpoch", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserStakedEpoch is a free data retrieval call binding the contract method 0xb7b8e51d.
//
// Solidity: function userStakedEpoch(address ) view returns(uint256)
func (_LmaasIs *LmaasIsSession) UserStakedEpoch(arg0 common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.UserStakedEpoch(&_LmaasIs.CallOpts, arg0)
}

// UserStakedEpoch is a free data retrieval call binding the contract method 0xb7b8e51d.
//
// Solidity: function userStakedEpoch(address ) view returns(uint256)
func (_LmaasIs *LmaasIsCallerSession) UserStakedEpoch(arg0 common.Address) (*big.Int, error) {
	return _LmaasIs.Contract.UserStakedEpoch(&_LmaasIs.CallOpts, arg0)
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_LmaasIs *LmaasIsTransactor) CancelExtension(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "cancelExtension")
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_LmaasIs *LmaasIsSession) CancelExtension() (*types.Transaction, error) {
	return _LmaasIs.Contract.CancelExtension(&_LmaasIs.TransactOpts)
}

// CancelExtension is a paid mutator transaction binding the contract method 0x2af9b070.
//
// Solidity: function cancelExtension() returns()
func (_LmaasIs *LmaasIsTransactorSession) CancelExtension() (*types.Transaction, error) {
	return _LmaasIs.Contract.CancelExtension(&_LmaasIs.TransactOpts)
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_LmaasIs *LmaasIsTransactor) Claim(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "claim")
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_LmaasIs *LmaasIsSession) Claim() (*types.Transaction, error) {
	return _LmaasIs.Contract.Claim(&_LmaasIs.TransactOpts)
}

// Claim is a paid mutator transaction binding the contract method 0x4e71d92d.
//
// Solidity: function claim() returns()
func (_LmaasIs *LmaasIsTransactorSession) Claim() (*types.Transaction, error) {
	return _LmaasIs.Contract.Claim(&_LmaasIs.TransactOpts)
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_LmaasIs *LmaasIsTransactor) Exit(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "exit")
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_LmaasIs *LmaasIsSession) Exit() (*types.Transaction, error) {
	return _LmaasIs.Contract.Exit(&_LmaasIs.TransactOpts)
}

// Exit is a paid mutator transaction binding the contract method 0xe9fad8ee.
//
// Solidity: function exit() returns()
func (_LmaasIs *LmaasIsTransactorSession) Exit() (*types.Transaction, error) {
	return _LmaasIs.Contract.Exit(&_LmaasIs.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LmaasIs *LmaasIsTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LmaasIs *LmaasIsSession) RenounceOwnership() (*types.Transaction, error) {
	return _LmaasIs.Contract.RenounceOwnership(&_LmaasIs.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_LmaasIs *LmaasIsTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _LmaasIs.Contract.RenounceOwnership(&_LmaasIs.TransactOpts)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_LmaasIs *LmaasIsTransactor) Stake(opts *bind.TransactOpts, _tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "stake", _tokenAmount)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_LmaasIs *LmaasIsSession) Stake(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Stake(&_LmaasIs.TransactOpts, _tokenAmount)
}

// Stake is a paid mutator transaction binding the contract method 0xa694fc3a.
//
// Solidity: function stake(uint256 _tokenAmount) returns()
func (_LmaasIs *LmaasIsTransactorSession) Stake(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Stake(&_LmaasIs.TransactOpts, _tokenAmount)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_LmaasIs *LmaasIsTransactor) Start(opts *bind.TransactOpts, _startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "start", _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_LmaasIs *LmaasIsSession) Start(_startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Start(&_LmaasIs.TransactOpts, _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start is a paid mutator transaction binding the contract method 0x869d8ead.
//
// Solidity: function start(uint256 _startTimestamp, uint256 _endTimestamp, uint256[] _rewardPerSecond) returns()
func (_LmaasIs *LmaasIsTransactorSession) Start(_startTimestamp *big.Int, _endTimestamp *big.Int, _rewardPerSecond []*big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Start(&_LmaasIs.TransactOpts, _startTimestamp, _endTimestamp, _rewardPerSecond)
}

// Start0 is a paid mutator transaction binding the contract method 0x8fb4b573.
//
// Solidity: function start(uint256 _epochDuration, uint256 _startTimestamp) returns()
func (_LmaasIs *LmaasIsTransactor) Start0(opts *bind.TransactOpts, _epochDuration *big.Int, _startTimestamp *big.Int) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "start0", _epochDuration, _startTimestamp)
}

// Start0 is a paid mutator transaction binding the contract method 0x8fb4b573.
//
// Solidity: function start(uint256 _epochDuration, uint256 _startTimestamp) returns()
func (_LmaasIs *LmaasIsSession) Start0(_epochDuration *big.Int, _startTimestamp *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Start0(&_LmaasIs.TransactOpts, _epochDuration, _startTimestamp)
}

// Start0 is a paid mutator transaction binding the contract method 0x8fb4b573.
//
// Solidity: function start(uint256 _epochDuration, uint256 _startTimestamp) returns()
func (_LmaasIs *LmaasIsTransactorSession) Start0(_epochDuration *big.Int, _startTimestamp *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Start0(&_LmaasIs.TransactOpts, _epochDuration, _startTimestamp)
}

// Start1 is a paid mutator transaction binding the contract method 0x95805dad.
//
// Solidity: function start(uint256 _epochDuration) returns()
func (_LmaasIs *LmaasIsTransactor) Start1(opts *bind.TransactOpts, _epochDuration *big.Int) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "start1", _epochDuration)
}

// Start1 is a paid mutator transaction binding the contract method 0x95805dad.
//
// Solidity: function start(uint256 _epochDuration) returns()
func (_LmaasIs *LmaasIsSession) Start1(_epochDuration *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Start1(&_LmaasIs.TransactOpts, _epochDuration)
}

// Start1 is a paid mutator transaction binding the contract method 0x95805dad.
//
// Solidity: function start(uint256 _epochDuration) returns()
func (_LmaasIs *LmaasIsTransactorSession) Start1(_epochDuration *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Start1(&_LmaasIs.TransactOpts, _epochDuration)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LmaasIs *LmaasIsTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LmaasIs *LmaasIsSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _LmaasIs.Contract.TransferOwnership(&_LmaasIs.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_LmaasIs *LmaasIsTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _LmaasIs.Contract.TransferOwnership(&_LmaasIs.TransactOpts, newOwner)
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_LmaasIs *LmaasIsTransactor) UpdateRewardMultipliers(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "updateRewardMultipliers")
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_LmaasIs *LmaasIsSession) UpdateRewardMultipliers() (*types.Transaction, error) {
	return _LmaasIs.Contract.UpdateRewardMultipliers(&_LmaasIs.TransactOpts)
}

// UpdateRewardMultipliers is a paid mutator transaction binding the contract method 0xdd2da220.
//
// Solidity: function updateRewardMultipliers() returns()
func (_LmaasIs *LmaasIsTransactorSession) UpdateRewardMultipliers() (*types.Transaction, error) {
	return _LmaasIs.Contract.UpdateRewardMultipliers(&_LmaasIs.TransactOpts)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_LmaasIs *LmaasIsTransactor) Withdraw(opts *bind.TransactOpts, _tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "withdraw", _tokenAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_LmaasIs *LmaasIsSession) Withdraw(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Withdraw(&_LmaasIs.TransactOpts, _tokenAmount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 _tokenAmount) returns()
func (_LmaasIs *LmaasIsTransactorSession) Withdraw(_tokenAmount *big.Int) (*types.Transaction, error) {
	return _LmaasIs.Contract.Withdraw(&_LmaasIs.TransactOpts, _tokenAmount)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_LmaasIs *LmaasIsTransactor) WithdrawExcessRewards(opts *bind.TransactOpts, _recipient common.Address) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "withdrawExcessRewards", _recipient)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_LmaasIs *LmaasIsSession) WithdrawExcessRewards(_recipient common.Address) (*types.Transaction, error) {
	return _LmaasIs.Contract.WithdrawExcessRewards(&_LmaasIs.TransactOpts, _recipient)
}

// WithdrawExcessRewards is a paid mutator transaction binding the contract method 0x2c3f455c.
//
// Solidity: function withdrawExcessRewards(address _recipient) returns()
func (_LmaasIs *LmaasIsTransactorSession) WithdrawExcessRewards(_recipient common.Address) (*types.Transaction, error) {
	return _LmaasIs.Contract.WithdrawExcessRewards(&_LmaasIs.TransactOpts, _recipient)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_LmaasIs *LmaasIsTransactor) WithdrawTokens(opts *bind.TransactOpts, _recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _LmaasIs.contract.Transact(opts, "withdrawTokens", _recipient, _token)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_LmaasIs *LmaasIsSession) WithdrawTokens(_recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _LmaasIs.Contract.WithdrawTokens(&_LmaasIs.TransactOpts, _recipient, _token)
}

// WithdrawTokens is a paid mutator transaction binding the contract method 0xa522ad25.
//
// Solidity: function withdrawTokens(address _recipient, address _token) returns()
func (_LmaasIs *LmaasIsTransactorSession) WithdrawTokens(_recipient common.Address, _token common.Address) (*types.Transaction, error) {
	return _LmaasIs.Contract.WithdrawTokens(&_LmaasIs.TransactOpts, _recipient, _token)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LmaasIs *LmaasIsTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _LmaasIs.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LmaasIs *LmaasIsSession) Receive() (*types.Transaction, error) {
	return _LmaasIs.Contract.Receive(&_LmaasIs.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_LmaasIs *LmaasIsTransactorSession) Receive() (*types.Transaction, error) {
	return _LmaasIs.Contract.Receive(&_LmaasIs.TransactOpts)
}

// LmaasIsClaimedIterator is returned from FilterClaimed and is used to iterate over the raw logs and unpacked data for Claimed events raised by the LmaasIs contract.
type LmaasIsClaimedIterator struct {
	Event *LmaasIsClaimed // Event containing the contract specifics and raw log

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
func (it *LmaasIsClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsClaimed)
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
		it.Event = new(LmaasIsClaimed)
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
func (it *LmaasIsClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsClaimed represents a Claimed event raised by the LmaasIs contract.
type LmaasIsClaimed struct {
	User   common.Address
	Amount *big.Int
	Token  common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterClaimed is a free log retrieval operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_LmaasIs *LmaasIsFilterer) FilterClaimed(opts *bind.FilterOpts, user []common.Address) (*LmaasIsClaimedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "Claimed", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasIsClaimedIterator{contract: _LmaasIs.contract, event: "Claimed", logs: logs, sub: sub}, nil
}

// WatchClaimed is a free log subscription operation binding the contract event 0x7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e.
//
// Solidity: event Claimed(address indexed user, uint256 amount, address token)
func (_LmaasIs *LmaasIsFilterer) WatchClaimed(opts *bind.WatchOpts, sink chan<- *LmaasIsClaimed, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "Claimed", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsClaimed)
				if err := _LmaasIs.contract.UnpackLog(event, "Claimed", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseClaimed(log types.Log) (*LmaasIsClaimed, error) {
	event := new(LmaasIsClaimed)
	if err := _LmaasIs.contract.UnpackLog(event, "Claimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasIsExitedIterator is returned from FilterExited and is used to iterate over the raw logs and unpacked data for Exited events raised by the LmaasIs contract.
type LmaasIsExitedIterator struct {
	Event *LmaasIsExited // Event containing the contract specifics and raw log

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
func (it *LmaasIsExitedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsExited)
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
		it.Event = new(LmaasIsExited)
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
func (it *LmaasIsExitedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsExitedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsExited represents a Exited event raised by the LmaasIs contract.
type LmaasIsExited struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterExited is a free log retrieval operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_LmaasIs *LmaasIsFilterer) FilterExited(opts *bind.FilterOpts, user []common.Address) (*LmaasIsExitedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "Exited", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasIsExitedIterator{contract: _LmaasIs.contract, event: "Exited", logs: logs, sub: sub}, nil
}

// WatchExited is a free log subscription operation binding the contract event 0x920bb94eb3842a728db98228c375ff6b00c5bc5a54fac6736155517a0a20a61a.
//
// Solidity: event Exited(address indexed user, uint256 amount)
func (_LmaasIs *LmaasIsFilterer) WatchExited(opts *bind.WatchOpts, sink chan<- *LmaasIsExited, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "Exited", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsExited)
				if err := _LmaasIs.contract.UnpackLog(event, "Exited", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseExited(log types.Log) (*LmaasIsExited, error) {
	event := new(LmaasIsExited)
	if err := _LmaasIs.contract.UnpackLog(event, "Exited", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasIsExtendedIterator is returned from FilterExtended and is used to iterate over the raw logs and unpacked data for Extended events raised by the LmaasIs contract.
type LmaasIsExtendedIterator struct {
	Event *LmaasIsExtended // Event containing the contract specifics and raw log

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
func (it *LmaasIsExtendedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsExtended)
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
		it.Event = new(LmaasIsExtended)
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
func (it *LmaasIsExtendedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsExtendedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsExtended represents a Extended event raised by the LmaasIs contract.
type LmaasIsExtended struct {
	NewStartTimestamp   *big.Int
	NewEndTimestamp     *big.Int
	NewRewardsPerSecond []*big.Int
	Raw                 types.Log // Blockchain specific contextual infos
}

// FilterExtended is a free log retrieval operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_LmaasIs *LmaasIsFilterer) FilterExtended(opts *bind.FilterOpts) (*LmaasIsExtendedIterator, error) {

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "Extended")
	if err != nil {
		return nil, err
	}
	return &LmaasIsExtendedIterator{contract: _LmaasIs.contract, event: "Extended", logs: logs, sub: sub}, nil
}

// WatchExtended is a free log subscription operation binding the contract event 0xd363ac13638f68e7284bc244076ff171a95616bfe30c8c7629980906a9db0363.
//
// Solidity: event Extended(uint256 newStartTimestamp, uint256 newEndTimestamp, uint256[] newRewardsPerSecond)
func (_LmaasIs *LmaasIsFilterer) WatchExtended(opts *bind.WatchOpts, sink chan<- *LmaasIsExtended) (event.Subscription, error) {

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "Extended")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsExtended)
				if err := _LmaasIs.contract.UnpackLog(event, "Extended", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseExtended(log types.Log) (*LmaasIsExtended, error) {
	event := new(LmaasIsExtended)
	if err := _LmaasIs.contract.UnpackLog(event, "Extended", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasIsOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the LmaasIs contract.
type LmaasIsOwnershipTransferredIterator struct {
	Event *LmaasIsOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *LmaasIsOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsOwnershipTransferred)
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
		it.Event = new(LmaasIsOwnershipTransferred)
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
func (it *LmaasIsOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsOwnershipTransferred represents a OwnershipTransferred event raised by the LmaasIs contract.
type LmaasIsOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_LmaasIs *LmaasIsFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*LmaasIsOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &LmaasIsOwnershipTransferredIterator{contract: _LmaasIs.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_LmaasIs *LmaasIsFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *LmaasIsOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsOwnershipTransferred)
				if err := _LmaasIs.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseOwnershipTransferred(log types.Log) (*LmaasIsOwnershipTransferred, error) {
	event := new(LmaasIsOwnershipTransferred)
	if err := _LmaasIs.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasIsStakedIterator is returned from FilterStaked and is used to iterate over the raw logs and unpacked data for Staked events raised by the LmaasIs contract.
type LmaasIsStakedIterator struct {
	Event *LmaasIsStaked // Event containing the contract specifics and raw log

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
func (it *LmaasIsStakedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsStaked)
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
		it.Event = new(LmaasIsStaked)
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
func (it *LmaasIsStakedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsStakedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsStaked represents a Staked event raised by the LmaasIs contract.
type LmaasIsStaked struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterStaked is a free log retrieval operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_LmaasIs *LmaasIsFilterer) FilterStaked(opts *bind.FilterOpts, user []common.Address) (*LmaasIsStakedIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "Staked", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasIsStakedIterator{contract: _LmaasIs.contract, event: "Staked", logs: logs, sub: sub}, nil
}

// WatchStaked is a free log subscription operation binding the contract event 0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d.
//
// Solidity: event Staked(address indexed user, uint256 amount)
func (_LmaasIs *LmaasIsFilterer) WatchStaked(opts *bind.WatchOpts, sink chan<- *LmaasIsStaked, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "Staked", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsStaked)
				if err := _LmaasIs.contract.UnpackLog(event, "Staked", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseStaked(log types.Log) (*LmaasIsStaked, error) {
	event := new(LmaasIsStaked)
	if err := _LmaasIs.contract.UnpackLog(event, "Staked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasIsStartedIterator is returned from FilterStarted and is used to iterate over the raw logs and unpacked data for Started events raised by the LmaasIs contract.
type LmaasIsStartedIterator struct {
	Event *LmaasIsStarted // Event containing the contract specifics and raw log

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
func (it *LmaasIsStartedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsStarted)
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
		it.Event = new(LmaasIsStarted)
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
func (it *LmaasIsStartedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsStartedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsStarted represents a Started event raised by the LmaasIs contract.
type LmaasIsStarted struct {
	StartTimestamp   *big.Int
	EndTimestamp     *big.Int
	RewardsPerSecond []*big.Int
	Raw              types.Log // Blockchain specific contextual infos
}

// FilterStarted is a free log retrieval operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_LmaasIs *LmaasIsFilterer) FilterStarted(opts *bind.FilterOpts) (*LmaasIsStartedIterator, error) {

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "Started")
	if err != nil {
		return nil, err
	}
	return &LmaasIsStartedIterator{contract: _LmaasIs.contract, event: "Started", logs: logs, sub: sub}, nil
}

// WatchStarted is a free log subscription operation binding the contract event 0x74e89788dfd5b96dd5e9c38139638937b89fc0d4863da5644783b5d7f876b87a.
//
// Solidity: event Started(uint256 startTimestamp, uint256 endTimestamp, uint256[] rewardsPerSecond)
func (_LmaasIs *LmaasIsFilterer) WatchStarted(opts *bind.WatchOpts, sink chan<- *LmaasIsStarted) (event.Subscription, error) {

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "Started")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsStarted)
				if err := _LmaasIs.contract.UnpackLog(event, "Started", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseStarted(log types.Log) (*LmaasIsStarted, error) {
	event := new(LmaasIsStarted)
	if err := _LmaasIs.contract.UnpackLog(event, "Started", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// LmaasIsWithdrawnIterator is returned from FilterWithdrawn and is used to iterate over the raw logs and unpacked data for Withdrawn events raised by the LmaasIs contract.
type LmaasIsWithdrawnIterator struct {
	Event *LmaasIsWithdrawn // Event containing the contract specifics and raw log

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
func (it *LmaasIsWithdrawnIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(LmaasIsWithdrawn)
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
		it.Event = new(LmaasIsWithdrawn)
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
func (it *LmaasIsWithdrawnIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *LmaasIsWithdrawnIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// LmaasIsWithdrawn represents a Withdrawn event raised by the LmaasIs contract.
type LmaasIsWithdrawn struct {
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterWithdrawn is a free log retrieval operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_LmaasIs *LmaasIsFilterer) FilterWithdrawn(opts *bind.FilterOpts, user []common.Address) (*LmaasIsWithdrawnIterator, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.FilterLogs(opts, "Withdrawn", userRule)
	if err != nil {
		return nil, err
	}
	return &LmaasIsWithdrawnIterator{contract: _LmaasIs.contract, event: "Withdrawn", logs: logs, sub: sub}, nil
}

// WatchWithdrawn is a free log subscription operation binding the contract event 0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5.
//
// Solidity: event Withdrawn(address indexed user, uint256 amount)
func (_LmaasIs *LmaasIsFilterer) WatchWithdrawn(opts *bind.WatchOpts, sink chan<- *LmaasIsWithdrawn, user []common.Address) (event.Subscription, error) {

	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _LmaasIs.contract.WatchLogs(opts, "Withdrawn", userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(LmaasIsWithdrawn)
				if err := _LmaasIs.contract.UnpackLog(event, "Withdrawn", log); err != nil {
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
func (_LmaasIs *LmaasIsFilterer) ParseWithdrawn(log types.Log) (*LmaasIsWithdrawn, error) {
	event := new(LmaasIsWithdrawn)
	if err := _LmaasIs.contract.UnpackLog(event, "Withdrawn", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
