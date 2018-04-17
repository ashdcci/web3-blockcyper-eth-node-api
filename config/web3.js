var Web3 = require('web3')
var providers = require('ethers').providers;
var network = providers.networks.rinkeby
var Accounts = require('web3-eth-accounts')

var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'+process.env.BNP_INFURA_KEY));

module.exports = web3