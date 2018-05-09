// "use strict";
let Tx = require('ethereumjs-tx')
let fs = require('fs')
let web3 = require('../config/web3')
data = {};
tomodel = {};
crypto = require('crypto')
async = require('async')

class ethController{
    
    constructor(web3,Tx, fs, data, tomodel, crypto, async){
        this.web3 = web3
        this.Tx = Tx
        this.fs = fs
        this.data = data
        this.tomodel = tomodel
        this.crypto = crypto
        this.async = async
    }


    async getEthBalance(req, res, next) {
        
        if(!req.headers['eth_address']){
            return res.status(401).json({
                status: 0,
                msg: 'eth address is required'
            })
        }
        try{            
            let myAddress = req.headers['eth_address']
            let balance = await web3.eth.getBalance(myAddress)

            return res.status(200).json({
                status: 1,
                msg: 'eth address balance',
                balance: web3.utils.fromWei(balance,'ether')
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                status: 0,
                msg: 'problam in getting balance'
            })
        }

    }


     async trans_addr(req, res, next) {
        try {

        let private_key_str = req.headers['eth_private_key']
        req.headers['eth_private_key'] = private_key_str.replace('0x', '');
      
      console.log(req.headers)
        let privateKey = new Buffer(req.headers['eth_private_key'], 'hex');
        let myAddress = req.headers['eth_address']
        let destAddress = req.body.eth_address
        let amount = req.body.amount
      
        let txValue = web3.utils.numberToHex(web3.utils.toWei(amount, 'ether'));
        let txData = web3.utils.asciiToHex('oh hai mark');
      
        let count = await web3.eth.getTransactionCount(myAddress);
        count = (count == 0) ? 1 : count
        let gasPriceGwei = '5';
        let gasLimit = 100000;
        // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
        let chainId = 4;
      
          
        let rawTx = {
          nonce: web3.utils.toHex(count),
          gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
          gasLimit: web3.utils.toHex(gasLimit),
          to: destAddress,
          from: myAddress,
          value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
          chainId: chainId
        }
      
        let tx = new Tx(rawTx);
        tx.sign(privateKey);
      
        let serializedTx = tx.serialize();
        
        console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
      
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .then((receipt) =>{
            console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`)
            global.io.emit('receive_eth_'+destAddress,{status:1,eth_balance: amount});
            global.io.emit('sender_eth_'+myAddress,{status:1,eth_balance: amount});
            // global.io.emit('sender_eth_live_'+myAddress,{status:1,eth_balance: amount,eth_address: myAddress});
            return false
            
          } )
          .catch((err) => {
            console.log('send trans err: ' + err)
            global.io.emit('sender_eth_'+myAddress,{status:0,eth_balance: amount});
            return false
          });
      
        }catch(error){
          console.log(error)
          global.io.emit('sender_eth_err_'+myAddress,{status:0,eth_balance: amount});
          return false           
        } 
      
        return
      
      }

       async isAddress(req, res, next){

        if(!req.body.eth_address){
          return res.status(400).json({
            status: 0,
            message: 'eth address is required'
          })
        }else if(req.body.eth_address === req.headers['eth_address']){
          return res.status(402).json({
            status: 0,
            message: 'cant send eth to self address'
          })
        }
    
        let address = req.body.eth_address
        
        
        let checkAddress = await web3.utils.isAddress(address)
        
        if(checkAddress){
          next()
        }else{
          return res.status(401).json({
            status: 0,
            message: 'Address is invalid'
          })
        }
        
      }

    async checkBalance(req,res, next){

        let myAddress = req.headers['eth_address']
        let amount = req.body.amount
        let balance = await web3.eth.getBalance(myAddress)
        let AddressBalanceWei = parseInt(web3.utils.toWei(balance, 'ether'))
        let AmountWei = parseInt(web3.utils.toWei(amount, 'ether'))
    
        if(AddressBalanceWei < AmountWei){
          return res.status(400).json({
            'status': 0,
            'message': 'Insufficient Balance'
          })
          
        }else{

          ethController.prototype.trans_addr(req, res, next)
          return res.status(200).json({
              status: 1,
              message: ' transaction initiated'
            })

          // next()
        }
      
        return false
    }

}

module.exports = new ethController(web3,Tx, fs, data, tomodel, crypto, async)