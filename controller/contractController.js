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
var web3 = require('../config/web3')


ContractController.prototype.index = function(req, res, next) {
  // return res.json(web3.isConnected())

  var walletObj =  JSON.parse(fs.readFileSync('../config/wallet.json', 'utf8'));
  var myContract = new web3.eth.Contract(walletObj, '0xde2eeb9618062028dfe2d7eeef781d1d71b8a87d', {
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
  destAddress = req.body.dest_address;
  contractAddress = process.env.BNP_ETH_CONTRACT_ADDR;

  transferAmount = 54500000000;
  web3.eth.defaultAccount = myAddress;


  count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  var abiArray = JSON.parse(fs.readFileSync('./config/wallet.json', 'utf8'));

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
  var gasPriceGwei = '584';
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
