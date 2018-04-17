

// File : controller/addressController.js -->

// address controller
function Address(app){
  data 	= {};
  tomodel = {};
  bcapi = require('../config/bcpi')
  // model 	= {};
  async = require('async')
  var userController = require('../controller/userController')
  crypto  = require('crypto');
}
var web3 = require('../config/web3').default

module.exports = new Address();

/**
 * <b>getAddressBalance</b>
 * Get balance information about an Address.
 * @param {(string|number)}    addr       Address you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @method getAddressBalance
 */
Address.prototype.getAddressBalance =  (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  tomodel.access_token = token
user_model.getUserHashAddressByToken(tomodel,function(err, doc){

    if(err){
      return res.json({
        status: 0,
        message: 'problam in fetch data'
      })
    }
    if(doc === null){
      return res.status(500).json({
        status:0,
        message: 'user details not found'
      })
    }

    tomodel.user_address = doc.user_address


    if(doc.user_address){

      bcapi.getAddrBal(tomodel.user_address,{},function(error, body){
        if(error){
          return res.json({
            status: 0,
            message: 'problam in get address balance'
          })
        }



        return res.status(200).json({
          status: 0,
          body: body
        })

      })
    }


    return

})
}

/**
 * <b>getAddressDetails</b>
 * Get information about an address, including concise transaction references.
 * @param {(string|number)}    addr       Address you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @method getAddressDetails
 */
Address.prototype.getAddressDetails =  (req, res, next) => {


      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      tomodel.access_token = token
    user_model.getUserHashAddressByToken(tomodel,function(err, doc){

        if(err){
          return res.json({
            status: 0,
            message: 'problam in fetch data'
          })
        }
        if(doc === null){
          return res.status(500).json({
            status:0,
            message: 'user details not found'
          })
        }

        tomodel.user_address = doc.user_address


        if(doc.user_address){

          bcapi.getAddr(tomodel.user_address,{},function(error, body){
            if(error){
              return res.json({
                status: 0,
                message: 'problam in get address details'
              })
            }



            return res.status(200).json({
              status: 0,
              body: body
            })

          })
        }


        return

    })



}

/**
 * <b>getFullAddressDetails</b>
 * Get information about an address, including full transactions.
 * @param {(string|number)}    addr       Address you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @method getAddrFull
 */
Address.prototype.getFullAddressDetails = (req, res, next) => {



        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        tomodel.access_token = token
      user_model.getUserHashAddressByToken(tomodel,(err, doc) =>{

          if(err){
            return res.json({
              status: 0,
              message: 'problam in fetch data'
            })
          }
          if(doc === null){
            return res.status(500).json({
              status:0,
              message: 'user details not found'
            })
          }

          tomodel.user_address = doc.user_address


          if(doc.user_address){

            bcapi.getAddrFull(tomodel.user_address,{},(error, body) => {
              if(error){
                return res.json({
                  status: 0,
                  message: 'problam in get address details'
                })
              }

              return res.status(200).json({
                status: 0,
                body: body
              })

            })
          }

          return

      })




}

/**
 * <b>fundAddress</b>
 * Funds an Address. Must be used within a test blockchain (bcy-test or btc-test3).
 * @param {string}    addr     Address to be funded.
 * @param {number}    value    Amount to fund.
 * @callback cb
 * @method fundAddress
 */
Address.prototype.fundAddress = (req, res, next) => {

  var data = {"address": "CFqoZmZ3ePwK5wnkhxJjJAQKJ82C7RJdmd", "amount": 100000}

    if(!req.body.amount){
      return res.status(400).json({
        status: 0,
        message: 'amount field is required'
      })
    }
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    tomodel.access_token = token
  user_model.getUserHashAddressByToken(tomodel,(err, doc) => {

      if(err){
        return res.json({
          status: 0,
          message: 'problam in fetch data'
        })
      }
      if(doc === null){
        return res.status(500).json({
          status:0,
          message: 'user details not found'
        })
      }
      tomodel.amount = parseInt(req.body.amount)
      tomodel.user_address = doc.user_address


      if(doc.user_address){

        bcapi.faucet(tomodel.user_address,tomodel.amount,(error, body) => {
          if(error){
            return res.json({
              status: 0,
              message: 'problam in fund address'
            })
          }

          console.log(error,body)

          return res.status(200).json({
            status: 0,
            message: req.body.amount + ' coin funded to address '+tomodel.user_address,
            body: body
          })

        })
      }


      return

  })


}


Address.prototype.newEthAddress = async (req, res, next) =>{
  tomodel._id = req.headers['user_id']
  tomodel.user_address = req.headers['user_address']
  account = await web3.eth.accounts.create(web3.utils.randomHex(32))
  console.log(account.address, account.privateKey)
  if(account.address && account.privateKey){

    tomodel.eth_address = account.address
    tomodel.eth_private_key = account.privateKey
    
    user_model.updateEthAddress(tomodel, (err, doc) =>{
      if(err){
        return res.status(500).json({
          status: 0,
          msg: 'problam in update address'
        })
      }
      
      if(doc!=null){
        return res.status(200).json({
          status: 1,
          msg: 'address generated',
          data: doc
        })
      }

    })


  }else{
    return res.status(500).json({
      status: 0,
      msg: 'problam in generate eth address'
    })
  }





  

  return

}

Address.prototype.checkEthAddress = (req, res, next) =>{
  user_model.checkEthAddress(tomodel, (err, doc) =>{
      if(err){
        return res.status(500).json({
          status: 0,
          msg: 'problam in check address'
        })
      }
      console.log(err, doc)
      if(doc!=null && doc.eth_address!=null){
        return res.status(403).json({
          status: 0,
          msg: 'this account already associated with an eth address'
        })
      }

      next()
  })

  return 

}
