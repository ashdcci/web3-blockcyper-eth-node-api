// "use strict";
let Tx = require('ethereumjs-tx')
let fs = require('fs')
let web3 = require('../config/web3')
data = {};
tomodel = {};
crypto = require('crypto')
async = require('async')
transaction_model = require('../model/transaction_model')
contractController = require('../controller/contractController')

class ethController{
    
    constructor(web3,Tx, fs, data, tomodel, crypto, async){
        this.web3 = web3 
        this.Tx = Tx
        this.fs = fs
        this.data = data
        this.tomodel = tomodel
        this.crypto = crypto
        this.async = async
        this.contract = contractController
    }

    async unlockAccount(req, res, next){
      
        if(!req.headers['eth_address']){
            return res.status(401).json({
                status: 0,
                msg: 'eth address is required'
            })
        }

        try{

        

        let myAddress1 =  req.headers['eth_address']
        let myPassword = req.headers['user_password']
        let myPrivateKey = req.headers['eth_private_key']
        
        if(myPrivateKey.length > 4){
          console.log(myAddress1, myPrivateKey)
          /**
           * for those result if their private key already generated when creating account
           */
          //  let rawKeyResult = await web3.eth.personal.importRawKey(myPrivateKey.replace('0x', ''),myPassword)
        }

        /**
         * unlocking account
         */
        await web3.eth.personal.unlockAccount(myAddress1, myPassword, 260)
        .then((result) => {
          console.log('account unlocked: ',result)

          // next()
          // contractController.prototype.trans_token(req,res, next)
          
          // if (result) {
            
          //   return res.status(200).json({status:1,msg:'account unlocked for 60s'})
          // } else {
          //   return res.status(200).json({status:0,msg:'account not lockes'})
          // }
        })
        .catch(errorResult => {
          console.log(errorResult)
          console.log('problam in unlocking account: ')
          // return res.status(200).json({status:0,msg:'account not locked'})
        })

      }catch(error){
        console.log(error)
        console.log('problam in unlocking account: ')
      }

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
            console.log(myAddress)
            let balance = await web3.eth.getBalance(myAddress)
            let sync = await web3.eth.isSyncing()
            console.log(sync)
            // let importKey = await web3.eth.personal.importRawKey(req.headers['eth_private_key'],'core2duo')

            // let unlock = await web3.eth.personal.unlockAccount(myAddress,'core2duo',0)
            // var unlockResult = await web3.eth.personal.unlockAccount(myAddress, 'core2duo', 120);
                  // .then((rs) =>console.log(rs) )
                  // .catch((er1) =>console.log(er1))


                  //  console.log(unlockResult, importKey)
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
        let myId = req.headers['user_id']
        let privateKey = new Buffer(req.headers['eth_private_key'], 'hex');
        let myAddress = req.headers['eth_address']
        let destAddress = req.body.eth_address
        let amount = req.body.amount
        web3.eth.defaultAccount = myAddress
        let txValue = web3.utils.numberToHex(web3.utils.toWei(amount, 'ether'));
        let txData = web3.utils.asciiToHex('oh hai mark');
        // await web3.personal.unlockAccount(myAddress, 'mypass')

        // let ress = await web3.eth.personal.sign(web3.utils.utf8ToHex("Hello world"),myAddress,"test password!")
        // console.log(` ress:  ${JSON.stringify(ress, null, '\t')}\n------------------------`);
        let count = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
        count = (count == 0) ? 1 : count
        let gasPriceGwei = 12;
        let gasLimit = 100000;
        // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
        let chainId = 4;

        /**
         * unlock account
         */
        await this.unlockAccount(req, res, next)


          /**
           * send normal trasactions
           */
        await web3.eth.sendTransaction({
          from: myAddress,
          to: destAddress,
          value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
        })
        .then(function(receipt){
          console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`)
            global.io.emit('receive_eth_'+destAddress,{status:1,eth_balance: amount});
            global.io.emit('sender_eth_'+myAddress,{status:1,eth_balance: amount});
            // global.io.emit('sender_eth_live_'+myAddress,{status:1,eth_balance: amount,eth_address: myAddress});
            tomodel.sender_address = myAddress
            tomodel.recr_address = destAddress
            tomodel.sender_id = myId
            tomodel.amount = amount
            tomodel.transaction_hash = receipt.transactionHash
            tomodel.tx_type = 2
            this.saveUserTransaction(tomodel, res, next)

            return false
        }).catch((err) => {
          console.log('send trans err: ' + err)
          global.io.emit('sender_eth_'+myAddress,{status:0,eth_balance: amount});
          return false
        });
          

        /**
         * @deprecated code used when send sign transaction using private key start here 
         */
        // let rawTx = {
        //   nonce: web3.utils.toHex(count),
        //   gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
        //   gasLimit: web3.utils.toHex(gasLimit),
        //   to: destAddress,
        //   from: myAddress,
        //   value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
        //   chainId: chainId
        // }
      
        // let tx = new Tx(rawTx);
        // tx.sign(privateKey);
        
        // let serializedTx = tx.serialize();
        // console.log(` tx:  ${JSON.stringify(rawTx, null, '\t')}\n------------------------`);
        // console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
      
        // await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        //   .then((receipt) =>{
        //     console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`)
        //     global.io.emit('receive_eth_'+destAddress,{status:1,eth_balance: amount});
        //     global.io.emit('sender_eth_'+myAddress,{status:1,eth_balance: amount});
        //     // global.io.emit('sender_eth_live_'+myAddress,{status:1,eth_balance: amount,eth_address: myAddress});
        //     tomodel.sender_address = myAddress
        //     tomodel.recr_address = destAddress
        //     tomodel.sender_id = myId
        //     tomodel.amount = amount
        //     tomodel.transaction_hash = receipt.transactionHash
        //     tomodel.tx_type = 2
        //     this.saveUserTransaction(tomodel, res, next)

        //     return false
            
        //   } )
        //   .catch((err) => {
        //     console.log('send trans err: ' + err)
        //     global.io.emit('sender_eth_'+myAddress,{status:0,eth_balance: amount});
        //     return false
        //   });
        
        /**
         * @deprecated code used when send sign transaction using private key end here 
         */

        }catch(error){
          console.log(error)
          global.io.emit('sender_eth_err_'+myAddress,{status:0,eth_balance: amount});
          return false           
        } 
      
        return
      
      }


      saveUserTransaction(tomodel, res, next) {

        
        transaction_model.saveUserTransaction(tomodel, (err, doc) => {
          if (err) { // can send error check to websocket
            
            return res.status(500).json({
              status: 0,
              message: 'problam in saving transaction details',
              error: err
            })
          }
        })
      
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

    checkMethod(){
      console.log('hello from check method')
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