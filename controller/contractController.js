// File : controller/ContractController.js -->

// ContractController controller
function ContractController(app) {
  data = {};
  tomodel = {};
  // model 	= {};
  crypto = require('crypto');
  async = require('async')
}
var Tx = require('ethereumjs-tx');
var fs = require('fs')
var providers = require('ethers').providers;
var Web3 = require('web3')
var network = providers.networks.rinkeby;
var etherscanProvider = new providers.EtherscanProvider(network);
// var Eth = require('web3-eth')
// var eth = new Eth(Eth.givenProvider || 'ws://192.168.1.72:8546');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Eu6qZvhMrNS0ap9G1Qty'));
// var web3 = new Web3('ws://127.0.0.1:8545');
// var web3 = new Web3('enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303')
// var web3 = new Web3('https://rinkeby.etherscan.io/api?apikey=F8P7XVRRGPTA3CMY3IT4334RK3SK8PBN9P');

var wallet_json_interface = '[{\"constant\":true,\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"name\":\"\",\"type\":\"uint8\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"burnFrom\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"},{\"name\":\"_extraData\",\"type\":\"bytes\"}],\"name\":\"approveAndCall\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"},{\"name\":\"\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"initialSupply\",\"type\":\"uint256\"},{\"name\":\"tokenName\",\"type\":\"string\"},{\"name\":\"tokenSymbol\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Burn\",\"type\":\"event\"}]';

ContractController.prototype.index = function(req, res, next) {
  // return res.json(web3.isConnected())


  var myContract = new web3.eth.Contract(JSON.parse(wallet_json_interface), '0xde2eeb9618062028dfe2d7eeef781d1d71b8a87d', {
    from: '0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
  });

  // {from: '0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1',to:'0x213A85d570e3580b18A079602e3fFdD541C6C651',value:99000}
  // myContract.methods.transfer().call()
  myContract.methods.transfer("0x213A85d570e3580b18A079602e3fFdD541C6C651", 90000).call({
      from: '0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1'
    })
    .then(function(receipt) {
      console.log(1, receipt)
      return res.json(receipt)
      // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
    }).catch(function(err) {
      console.log(err)
      return res.json(err)
    });

  // var trans = myContract.methods.transfer("0x213A85d570e3580b18A079602e3fFdD541C6C651",90000).call()
  // console.log(9479845,trans)

  return
  web3.eth.call({
    to: '0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1',
    data: myContract.methods.balanceOf("0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1").encodeABI()
  }).then(balance => {
    console.log(151, balance)
  }).catch(err1 => {
    console.log(33, err1)
  })

  var bal = myContract.methods.balanceOf("0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1").call();
  console.log('bal' + bal)



  myContract.methods.balanceOf("0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1").call()
    .then(function(receipt) {
      console.log(1, receipt)
      return res.json(receipt)
      // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
    }).catch(function(err) {
      console.log(0, err)
      return res.json(err)
    });


  return

}


ContractController.prototype.trans_token = async function(req, res, next) {

  console.log(`web3 version: ${web3.version}`)

  myAddress = process.env.BNP_ETH_MY_ADDR;
  destAddress = '0x213A85d570e3580b18A079602e3fFdD541C6C651';
  contractAddress = process.env.BNP_ETH_CONTRACT_ADDR;

  transferAmount = 54500000000;
  web3.eth.defaultAccount = myAddress;


  count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  var abiArray = JSON.parse(wallet_json_interface);

  var contract = new web3.eth.Contract(abiArray, contractAddress, {
    from: myAddress
  });

  // burnTx = await contract.methods.burn('10').call()
  // console.log(`Burn of Transaction: \n${JSON.stringify(burnTx, null, '\t')}\n------------------------`);

  // How many tokens do I have before sending?
    var balanceBefore = await contract.methods.balanceOf(myAddress).call();
    console.log(`Balance before send: ${balanceBefore} ,${financialMfil(balanceBefore)} MFIL\n------------------------`);

  // senddata  = await contract.methods.transfer(destAddress, transferAmount).call()
  // console.log(`sendData: \n${JSON.stringify(senddata, null, '\t')} `)
  // return res.send('54545');

  // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
  // Use Gwei for the unit of gas price
  var gasPriceGwei = '0.005252';
  var gasLimit = 52968;
  // Chain ID of RinkeBy Test Net is 4, replace it to 1 for Main Net
  var chainId = 4;

  var rawTransaction = {
    nonce: web3.utils.toHex(count),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: contractAddress,
    from: myAddress,
    value: "0x0",//web3.utils.toHex(web3.utils.toWei('0.84487', 'ether')),
    data: contract.methods.transfer(destAddress, transferAmount).encodeABI(),
    chainId: chainId
  }

  console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);


  // The private key for myAddress in .env
  var privKey = new Buffer(process.env.BNP_PRIVATE_KEY, 'hex');
  var tx = new Tx(rawTransaction);
  tx.sign(privKey);
  var serializedTx = tx.serialize();

  // Comment out these four lines if you don't really want to send the TX right now
  console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
  var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  // The receipt info of transaction, Uncomment for debug
  console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
  // The balance may not be updated yet, but let's check
  balanceAfter = await contract.methods.balanceOf(myAddress).call();
  console.log(`Balance after send: ${balanceAfter} , ${financialMfil(balanceAfter)} MFIL`);

  return res.json({
    tx_count: count,
    rawTx: rawTransaction,
    balancebefore: balanceBefore,
    balanceafter: balanceAfter,
    signTx: serializedTx.toString('hex'),
    tx_receipt: receipt
  })

};


ContractController.prototype.trans_addr = async function(req, res, next) {

  console.log(`web3 version: ${web3.version}`)
  var privateKey = new Buffer(process.env.BNP_PRIVATE_KEY, 'hex');
  myAddress = '0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1';
  destAddress = '0x213A85d570e3580b18A079602e3fFdD541C6C651';

  var txValue = web3.utils.numberToHex(web3.utils.toWei('0.7854', 'ether'));
  var txData = web3.utils.asciiToHex('oh hai mark');

  var count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);



  // web3.eth.sendTransaction({
  //     from: myAddress,
  //     to: destAddress,
  //     value: txValue
  // })
  // .then(receipt => console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`) )
  // .catch(err => console.log('send trans err: '+ err));



  var gasPriceGwei = 584;
  var gasLimit = 30000;
  // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
  var chainId = 3;
  // var rawTx = {
  //     "from": myAddress,
  //     "nonce": "0x" + count.toString(16),
  //     "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
  //     "gasLimit": web3.utils.toHex(gasLimit),
  //     "to": destAddress,
  //     "value": "0x0",
  //     "data": txData,
  //     "chainId": chainId
  // };

  var rawTx = {
    nonce: web3.utils.toHex(count),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: destAddress,
    from: myAddress,
    value: web3.utils.toHex(web3.utils.toWei('0.84487', 'ether'))
  }
  console.log(`Raw of Transaction: \n${JSON.stringify(rawTx, null, '\t')}\n------------------------`);

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .then(receipt => console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`))
    .catch(err => console.log('send trans err: ' + err));

  // console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
  return res.send('api process done')

};

function financialMfil(numMfil) {
  return Number.parseFloat(numMfil / 1e3).toFixed(3);
}



module.exports = new ContractController();
