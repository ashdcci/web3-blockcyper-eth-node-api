var Web3 = require('web3')
var providers = require('ethers').providers;
var network = providers.networks.rinkeby
var Accounts = require('web3-eth-accounts')
// enode://97e3215df4efc2e7af3e4928970edf5f6b9fa9e408e6fcb78c658ab1a4d0ab5878974b04b4d5e77881c99ab39bf82c5369e876a47dd0e6c5546248a1bb1d8be9@127.0.0.1:30301
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'+process.env.BNP_INFURA_KEY));
// var web3 = new Web3(new Web3.providers.HttpProvider(process.env.BNP_WEB3_URL));
module.exports = web3


/** 
 * geth command
 * geth --datadir "local_geth_data" --networkid 1234 --port 30303 --rpc --rpcport 8545 --rpcaddr="0.0.0.0" --rpcapi "eth,web" --rpccorsdomain "*" console
 */