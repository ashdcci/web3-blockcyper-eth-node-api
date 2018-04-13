const Web3 = require('web3')
const Tx = require('ethereumjs-tx')

// connect to Infura node
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Eu6qZvhMrNS0ap9G1Qty'))

// the address that will send the test transaction
const addressFrom = '0x3c1fdbEDbC1905D4C53980A535Aa3ff2F0ff40B1'
const privKey = '8a6ad06cd6077acc5a1d9c013318da4f6e9096949b2a07eabd40d272c431f5b8'

// the destination address
const addressTo = '0x213A85d570e3580b18A079602e3fFdD541C6C651'

// Signs the given transaction data and sends it. Abstracts some of the details
// of buffering and serializing the transaction for web3.
function sendSigned(txData, cb) {
  const privateKey = new Buffer(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

// get the number of transactions sent so far so we can create a fresh nonce
web3.eth.getTransactionCount(addressFrom).then(txCount => {

  var gasPriceGwei = 584;
  var gasLimit = 30000;
  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: addressTo,
    from: addressFrom,
    value: web3.utils.toHex(web3.utils.toWei('0.741487', 'ether'))
  }

  // fire away!
  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })

})
