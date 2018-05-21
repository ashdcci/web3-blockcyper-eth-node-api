// File : models/users.js -->

//Common-parts-of-all-models++++++++++++++++++++++++++++++++++
var transaction_model = function() {};
db = require('../config/db')
var crypto = require('crypto')
var moment = require('moment')
transactionSchema = require('../schema/transactionSchema')
userSchema = require('../schema/UserSchema')
User = db.model('User',userSchema.userSchema)
var Transaction = db.model('Transaction', transactionSchema.transactionSchema)
transaction_model.prototype.constructor = transaction_model;
module.exports = new transaction_model();
var NumberInt = require('mongoose-int32');

transaction_model.prototype.saveUserTransaction = function(data, callback){

  
  condition = {}
  if(data.tx_type==1){
    condition = { user_address: data.recr_address }
  }else{
    condition = { eth_address: data.recr_address }
  }
  

  User.findOne(condition).exec()
    .then(function(user) {
      
      if (user == null) {

        throw ({
          err_obj: 2
        })

      } else {
        
        tomodel = {}
        tomodel.sender_address = data.sender_address
        tomodel.recr_address = data.recr_address
        tomodel.recr_address = data.recr_address
        tomodel.sender_id = data.sender_id
        tomodel.recr_id = user._id
        tomodel.amount = data.amount
        tomodel.transaction_hash = data.transaction_hash
        tomodel.tx_type = data.tx_type

        var transaction_data = new Transaction(tomodel)
        
        transaction_data.save()
        return callback(null, data)

      }

    }).catch(function(err) {

      if (err.err_obj) {
        callback(null, null)
      } else {

        callback(err, null)
      }

    })
}

transaction_model.prototype.getSendMoney = function (data, callback) {
    Transaction.aggregate([
      {
        $match:{
          sender_id:data.user_address
        }
      },
      {
        $group:{
           _id:null,
           amount:{$sum:"$amount"}
       }
      },
      {
        $project:{
            _id: 0,
            total_send:"$amount"
        }
      }
    ]).exec().then(function(tx){
        return callback(null, tx)
    }).catch(function(err){
      if (err.err_obj) {
        callback(null, null)
      } else {

        callback(err, null)
      }
    })
};


transaction_model.prototype.getRecdMoney = function (data, callback) {
  Transaction.aggregate([
    {
      $match:{
        recr_id:data.user_address
      }
    },
    {
      $group:{
         _id:null,
         amount:{$sum:"$amount"}
     }
    },
    {
      $project:{
          _id: 0,
          total_send:"$amount"
      }
    }
  ]).exec().then(function(tx){

      return callback(null, tx)
  }).catch(function(err){
    if (err.err_obj) {
      callback(null, null)
    } else {

      callback(err, null)
    }
  })
};



transaction_model.prototype.getTransactions = function(data,callback){
    
    Transaction.aggregate([
      {
        $match: {
          "$or": [{
              "sender_address": data.user_address
            },
            {
              "recr_address": data.user_address
            }
          ],
          $and:[{
            "tx_type":data.tx_type
          }]
        }
      },
      {
        $lookup: {
          "from": "users",
          "localField": "sender_address",
          "foreignField": "user_address",
          "as": "user"
        }
      },
      {
        $lookup: {
          "from": "users",
          "localField": "recr_address",
          "foreignField": "user_address",
          "as": "user_receive"
        }
      },
      {
        $unwind: {
          'path': '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          'path': '$user_receive',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          "amount": "$amount",
          "tx_hash":"$transaction_hash",
          "payment_dated": {
            $dateToString: {
              format: '%Y-%m-%d %H:%m',
              date: {$ifNull: ["$created_at", new Date("1970-01-01T00:00:00.000Z")]}
            }
          },
          "type": {
            "$switch": {
              "branches": [{
                  "case": {
                    $eq: ["$sender_address", data.user_address]
                  },
                  then: "1"
                },
                {
                  "case": {
                    $eq: ["$recr_address", data.user_address]
                  },
                  then: "2"
                }
              ],
              "default": "0"
            }
          },
          "user_id": {
            $cond: {
              if: {
                $eq: ["$sender_address", data.user_address]
              },
              then: "$user_receive._id",
              else: "$user._id"
            }
          },
          "first_name": {
            $cond: {
              if: {
                $eq: ["$sender_address", data.user_address]
              },
              then: "$user_receive.first_name",
              else: "$user.first_name"
            }
          },
          "last_name": {
            $cond: {
              if: {
                $eq: ["$sender_address", data.user_address]
              },
              then: "$user_receive.last_name",
              else: "$user.last_name"
            }
          },
          "address": {
            $cond: {
              if: {
                $eq: ["$sender_address", data.user_address]
              },
              then: "$user_receive.user_address",
              else: "$user.user_address"
            }
          }
        }
      },{
        $sort:{
          "virtual_sender": -1
        }
      }    
    ]).exec().then(function(tx){
      if(tx==null){
        throw ({
          err_obj: 2
        })
      }
      callback(null, tx)

    }).catch(function(err){
      if (err.err_obj) {
        callback(null, null)
      } else {
        callback(err, null)
      }
    })
    
}




transaction_model.prototype.getEthTransactions = function(data,callback){

  Transaction.aggregate([
    {
      $match: {
        "$or": [{
            "sender_address": data.eth_address
          },
          {
            "recr_address": data.eth_address
          }
        ],
        $and:[{
          "tx_type":data.tx_type
        }]
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "sender_address",
        "foreignField": "eth_address",
        "as": "user"
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "recr_address",
        "foreignField": "eth_address",
        "as": "user_receive"
      }
    },
    {
      $unwind: {
        'path': '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        'path': '$user_receive',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        "amount": "$amount",
        "tx_hash":"$transaction_hash",
        "payment_dated": {
          $dateToString: {
            format: '%Y-%m-%d %H:%m',
            date: {$ifNull: ["$created_at", new Date("1970-01-01T00:00:00.000Z")]}
          }
        },
        "type": {
          "$switch": {
            "branches": [{
                "case": {
                  $eq: ["$sender_address", data.eth_address]
                },
                then: "1"
              },
              {
                "case": {
                  $eq: ["$recr_address", data.eth_address]
                },
                then: "2"
              }
            ],
            "default": "0"
          }
        },
        "user_id": {
          $cond: {
            if: {
              $eq: ["$sender_address", data.eth_address]
            },
            then: "$user_receive._id",
            else: "$user._id"
          }
        },
        "first_name": {
          $cond: {
            if: {
              $eq: ["$sender_address", data.eth_address]
            },
            then: "$user_receive.first_name",
            else: "$user.first_name"
          }
        },
        "last_name": {
          $cond: {
            if: {
              $eq: ["$sender_address", data.eth_address]
            },
            then: "$user_receive.last_name",
            else: "$user.last_name"
          }
        },
        "address": {
          $cond: {
            if: {
              $eq: ["$sender_address", data.eth_address]
            },
            then: "$user_receive.eth_address",
            else: "$user.eth_address"
          }
        }
      }
    },{
      $sort:{
        "virtual_sender": -1
      }
    }    
  ]).exec().then(function(tx){
    if(tx==null){
      throw ({
        err_obj: 2
      })
    }
    callback(null, tx)

  }).catch(function(err){
    if (err.err_obj) {
      callback(null, null)
    } else {
      callback(err, null)
    }
  })
  
}
