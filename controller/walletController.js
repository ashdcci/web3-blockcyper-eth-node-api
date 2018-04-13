// File : controller/admin/walletController.js -->


// Wallet controller
function Wallet(app) {
  data = {};
  tomodel = {};
  bcapi = require('../config/bcpi')
  model = require('../model/user_model')
  crypto = require('crypto')
  async = require('async')
}

module.exports = new Wallet();


Wallet.prototype.listwallet = function(req, res, next) {
  bcapi.listWallets(function(err, response) {
    if (err) {
      return res.status(500).json({
        status: 0,
        msg: 'problam in fetching wallet list'
      })
    }

    return res.status(200).json({
      status: 1,
      data: response
    })

  });

  return
}


Wallet.prototype.createWallet = function(req, res, next) {

  if (!req.body.wallet_name) {
    return res.status(400).json({
      status: 0,
      msg: 'wallet name is missing'
    })
  }

  tomodel = {}
  tomodel.token = process.env.BNP_CYPHER_API_TOKEN
  tomodel.name = req.body.wallet_name
  tomodel.addresses = []


  bcapi.createWallet(tomodel, function(err, response) {

    if (err) {
      return res.status(500).json({
        status: 0,
        msg: 'problam in creating wallet'
      })
    }



    if (response.token) {
      return res.status(200).json({
        status: 1,
        msg: 'wallet created',
        data: response
      })
    } else {
      return res.status(500).json({
        status: 0,
        msg: response.error,
        data: response.error
      })
    }

  });

  return
}


/**
 * <b>Add Addresses to Wallet</b>
 * Add array of addresses to named Wallet.
 * @callback cb
 * @param {string}     name    Name of the wallet you're querying.
 * @param {string[]}   addrs   Array of addresses you're adding.
 * @memberof Blockcy
 * @method addAddrWallet
 */
Wallet.prototype.associateAddress = function(req, res, next) {
  if (!req.body.wallet || !req.body.user_address) {
    return res.status(400).json({
      status: 0,
      message: 'wallet name or user address is required'
    })
  }
  tomodel = {}
  var address_data = []
  tomodel.address = req.body.user_address
  user_model.getAddressValidates(tomodel, function(err, doc) {

    if (err) {
      return res.json({
        status: 0,
        message: 'problam in fetch data'
      })
    }
    if (doc === null) {
      return res.status(500).json({
        status: 0,
        message: 'invalid user address'
      })
    }




    if(doc.user_address){


    address_data.push(doc.user_address)

    bcapi.addAddrWallet(req.body.wallet, address_data, function(error, body) {
      if (error || body.error) { // can send error check to websocket
        return res.status(500).json({
          status: 0,
          message: 'problam in add address into wallet',
          error: error,
          body: body.error
        })
      }

      return res.status(200).json({
        status: 1,
        message: doc.user_address + ' added into wallet ' + req.body.wallet,
        body: body
      })

    })

  }

  })

  return
}


Wallet.prototype.getWalletAddressBalance = function (req, res, next) {
  if(!req.params.wallet){
    return res.status(500).json({
        status: 0,
        message: 'wallet name is missing'
    })
  }
  total_balance = 0
  bal = 0
  total_received = 0
  total_send = 0
  bcapi.getAddrsWallet(req.params.wallet, (error, body) =>{
      if(error || body.error){
        return res.status(500).json({
          status: 0,
          message: body.error
        })
      }



      if(body.addresses.length > 0){
        console.log(8758154)
        i = 0
        async.forEach(body.addresses, function (item, callback){
          // bal = getAddressBalance(item,total_balance)

          bcapi.getAddrBal(item,{}, (err1, addrBody) =>{
                if(!err1 && !addrBody.error){
                      total_balance = total_balance + addrBody.final_balance
                      console.log(total_balance,addrBody.final_balance )

                }
          })

          i++
          // console.log('bal: '+total_balance, i)
          // if(i === body.addresses.length-1){
          //
          // }
          callback();

        }, function(err) {
          console.log(total_balance)
          return res.status(200).json({
            status: 1,
            message:'Address List',
            body: body,
            wallet_name: req.params.wallet,
            wallet_balance: total_balance
          })
        });

        // for(i = 0; i< body.addresses.length;i++){
        //   bal = getAddressBalance(body.addresses[i],total_balance)
        // }
        // if(i === body.addresses.length){
        //
        //   return res.status(200).json({
        //     status: 1,
        //     message:'Address List',
        //     body: body,
        //     wallet_name: req.params.wallet,
        //     wallet_balance: total_balance
        //   })
        // }

      }



  })


  getAddressBalance = function(address,total_balance){
    bcapi.getAddrBal(address,{}, (err1, addrBody) =>{
          if(!err1 && !addrBody.error){
                total_balance = total_balance + addrBody.final_balance
                console.log(total_balance,addrBody.final_balance )
          }
    })

    return total_balance
  }

  return


}
