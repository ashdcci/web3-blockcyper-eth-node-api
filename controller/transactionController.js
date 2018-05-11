// File : controller/transactionController.js -->

// transaction controller
function Transaction(app) {
  data = {};
  tomodel = {};
  // model 	= {};

  transaction_model = require('../model/transaction_model')
  user_model = require('../model/user_model')
  crypto = require('crypto')
  bitcoin = require("bitcoinjs-lib");
  bigi = require("bigi");
  buffer = require('buffer');

}

module.exports = new Transaction();

/**
 * <b>New Transaction</b>
 * Creates a new transaction skeleton, which returns the transaction along with data that needs to be signed. You can see more information on how this process works here: <a href="http://dev.blockcypher.com/?javascript#creating-transactions">http://dev.blockcypher.com/?javascript#creating-transactions</a>
 * @callback cb
 * @param {Object}     tx      Transaction base you're using to build a TX.
 * @method newTX
 */
Transaction.prototype.createTransaction = function(req, res, next) {
  if (!req.body.to_address || !req.body.amount) {
    return res.status(400).json({
      status: 0,
      message: 'require field are missing'
    })
  }

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  tomodel.access_token = token
  user_model.getUserHashAddressByToken(tomodel, function(err, doc) {

    if (err) {
      return res.json({
        status: 0,
        message: 'problam in fetch data'
      })
    }
    if (doc === null) {
      return res.status(500).json({
        status: 0,
        message: 'user details not found'
      })
    }
    tomodel.amount = parseInt(req.body.amount)
    tomodel.user_address = doc.user_address
    tomodel.private_key = doc.address_private_key

    btc_amount = 100000000 * (parseInt(req.body.amount) + 1 * (parseInt(req.body.amount) / 100));

    var newtx = {
      inputs: [{
        addresses: [doc.user_address]
      }],
      outputs: [{
        addresses: [req.body.to_address],
        value: parseInt(req.body.amount)
      }]
    };


    if (doc.user_address) {

      bcapi.newTX(newtx, function(error, tmptx) {
        if (error) {
          return res.json({
            status: 0,
            message: 'problam in getting temp transaction details',
            error: error,
            body: body
          })
        }

        // signing each of the hex-encoded string required to finalize the transaction
        keys = new bitcoin.ECPair(bigi.fromHex(doc.address_private_key));
        tmptx.pubkeys = [];
        tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
          tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
          return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
        });

        bcapi.sendTX(tmptx, function(error1, finaltx) {
          if (error1 || finaltx.error) {
            return res.status(500).json({
              status: 0,
              message: 'problam in getting final transaction details',
              error: error,
              body: finaltx.error
            })
          }

          tomodel.sender_address = doc.user_address
          tomodel.recr_address = req.body.to_address
          tomodel.sender_id = doc._id
          tomodel.amount = parseInt(req.body.amount)
          tomodel.transaction_hash = finaltx.tx.hash
          tomodel.tx_type = 1
          saveUserTransaction(tomodel, res, next)

          return res.status(200).json({
            status: 1,
            message: "Transaction Created",
            tmptx: tmptx,
            finaltx: finaltx,
            newtx: newtx
          })

        })

      })
    }

    return

  })


  saveUserTransaction = function(tomodel, res, next) {
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

}


/**
 * <b>getTransactionBlockDetails</b>
 * Get info about a block you're querying under your object's coin/chain, with additional parameters. Can use either block height or hash.
 * @param {(string|number)}    hh         Hash or height of the block you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @method getBlock
 */
Transaction.prototype.getTransactionBlockDetails = function(req, res, next) {
  if (!req.params.hash) {
    return res.status(500).json({
      status: 0,
      message: 'hash field is missing',
      error: err
    })
  }


  bcapi.getTX(req.params.hash, {}, function(err, txbody) {
    if (err || txbody.error) { // can send error check to websocket

      return res.status(500).json({
        status: 0,
        message: 'problam in fetch transaction hash block',
        error: err,
        body: txbody.error
      })
    }



    bcapi.getBlock(txbody.block_hash, {}, function(error, body) {
      if (error || body.error) { // can send error check to websocket

        return res.status(500).json({
          status: 0,
          message: 'problam in fetch transaction hash block',
          error: error,
          body: body.error
        })
      }

      return res.status(200).json({
        status: 0,
        message: 'hash block details for transaction ' + req.params.hash,
        body: body
      })


    })


  })



  return
}


Transaction.prototype.getTransactionConfidence = function(req, res, next) {
  if (!req.params.hash) {
    return res.status(500).json({
      status: 0,
      message: 'hash field is missing',
      error: err
    })
  }

  bcapi.getTXConf(req.params.hash, function(error, body) {
    if (error || body.error) { // can send error check to websocket

      return res.status(500).json({
        status: 0,
        message: 'problam in fetch transaction hash block',
        error: error,
        body: body.error
      })
    }

    return res.status(500).json({
      status: 0,
      message: 'hash block details for transaction hash ' + req.params.hash,
      body: body
    })


  })

  return
}


Transaction.prototype.getSendMoney = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  tomodel.access_token = token
  tomodel.user_address = req.headers['user_id'].toString()
  transaction_model.getSendMoney(tomodel, function(err1, doc1){

    if(err1){
      return res.json({
        status: 0,
        message: 'problam in fetch data'
      })
    }
    total_send_amount = (doc1.length > 0) ? doc1[0].total_send : 0
    return res.status(200).json({
      status:1,
      message: 'Total Send Money',
      total_send: total_send_amount
    })

  })

  return
};



Transaction.prototype.getRecdMoney = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  tomodel.access_token = token
  tomodel.user_address = req.headers['user_id'].toString()
  transaction_model.getRecdMoney(tomodel, function(err1, doc1){
      
    if(err1){
      return res.json({
        status: 0,
        message: 'problam in fetch data'
      })
    }
    total_recd_amount = (doc1.length > 0) ? doc1[0].total_send : 0
    return res.status(200).json({
      status:1,
      message: 'Total Send Money',
      total_send: total_recd_amount
    })

  })
  return
};



Transaction.prototype.getTransactions = function(req, res, next){
    if(!req.headers['user_id']){
      return res.status(400).json({
        status: 0,
        message: 'user details not found'
      })
    }
    tomodel._id = req.headers['user_id']
    tomodel.user_address = req.headers['user_address']
    tomodel.tx_type = (req.body.tx_type!==undefined) ? req.body.tx_type : 1
    
    transaction_model.getTransactions(tomodel, function(err, doc){
      
      if(err){
        return res.json({
          status: 0,
          message: 'problam in fetch data'
        })
      }
      return res.status(200).json({
        status:1,
        message: 'transactions Fetch',
        tx_data: doc
      })

    })

    return
}
