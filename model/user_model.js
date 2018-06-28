// File : models/users.js -->

//Common-parts-of-all-models++++++++++++++++++++++++++++++++++
var user_model = function() {};
db = require('../config/db')
var crypto = require('crypto')
var moment = require('moment')
userSchema = require('../schema/UserSchema')
var User = db.model('User', userSchema.userSchema)
user_model.prototype.constructor = user_model;
module.exports = new user_model();

// user_model.prototype.registerAdmin = function(data, callback) {
user_model.prototype.postRegister = function(data, callback) {

  pwd = crypto.createHash("md5")
    .update(data.password)
    .digest('hex');


  User.findOne({
      email: data.email
    }).exec()
    .then(function(user) {

      if (user != null) {

        throw ({
          err_obj: 2
        })

      } else {

        tomodel = {}
        tomodel.email = data.email
        tomodel.password = pwd
        tomodel.access_token = data.access_token
        data.password = pwd
        tomodel.first_name = (data.firstname !== undefined) ? data.firstname : ''
        tomodel.last_name = (data.lastname !== undefined) ? data.lastname : ''

        var user_data = new User(tomodel)
        user_data.save()
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


user_model.prototype.postLogin = function(data, callback) {

  
  data.pwd = crypto.createHash("md5")
    .update(data.password)
    .digest('hex');

  User.findOne({
      email: data.email,
      password: data.pwd
    }).exec()
    .then(function(doc) {

      if (doc === null) {

        throw ({
          err_obj: 2
        })

      } else {
        return callback(null, doc)
      }

    }).catch(function(err) {
      if (err.err_obj) {
        callback(null, null)
      } else {

        callback(err, null)
      }

    })
}


user_model.prototype.updateHashAddress = function(data, callback) {
  User.findOneAndUpdate({
    email: data.email
  }, {
    user_address: data.user_address,
    address_public_key: data.address_public_key,
    address_private_key: data.address_private_key,
    address_wif: data.wif,
    eth_address: data.eth_address,
    eth_private_key: data.eth_private_key
  }, {
    upsert: false
  },function(err,doc){
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })


}


user_model.prototype.getUserHashAddressByToken = function(data, callback){
    User.findOne({
      access_token: data.access_token
    }, function(err, doc){
        if(err){
          callback(err, null)
        }else{
          callback(null, doc)
        }
    })
}


user_model.prototype.getAddressValidates = function(data, callback){
    User.findOne({
      user_address: data.address
    }, function(err, doc){
        if(err){
          callback(err, null)
        }else{

          callback(null, doc)
        }
    })
}


user_model.prototype.edit_profile = function(data, callback){
  User.findOneAndUpdate({
    access_token: data.access_token
  }, {
    first_name: data.first_name,
    last_name: data.last_name
  }, {
    upsert: false
  },function(err,doc){
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}


user_model.prototype.updateEthAddress = function(data, callback){
  console.log(data)
  User.findOneAndUpdate({
    email: data.email
  }, {
    eth_address: data.eth_address,
    eth_private_key: data.eth_private_key
  }, {
    upsert: false
  },function(err,doc){
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}

user_model.prototype.updateToken = function(data, callback){
  
  User.findOneAndUpdate({
    email: data.email
  }, {
    access_token: data.access_token
  }, {
    upsert: false
  },function(err,doc){
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}

user_model.prototype.updateFaucet = function(data, callback){


  User.findOneAndUpdate({
    email: data
  }, {
    faucet: 1
  }, {
    upsert: false
  },function(err,doc){
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}




user_model.prototype.checkEthAddress = function(data, callback){
  User.findOne({
    access_token: data.access_token,
    eth_address:{$ne:""}
  },function(err,doc){
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}


user_model.prototype.getNameValidetes = (data, callback) =>{
  User.findOne({
    first_name: data.name
  },(err, doc)=>{
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}


user_model.prototype.findUserForRoom = (data, callback) =>{

  User.find({
   $and:[{
          $or:[
            {'first_name':{ $regex:data.search_str, $options: 'g'} },
            {'last_name':{ $regex:data.search_str, $options: 'g'} },
            {'email':{ $regex:data.search_str, $options: 'g'} },
            {'eth_address':{ $regex:data.search_str, $options: 'g'} }
          ],
        },
        {
          $and:[
            {'email':{"$ne":""} },
            {'first_name':{"$nin":[null,""]} },
            {'eth_address':{"$nin":[null,""]} },
          ],
        }
      ] 
  },{_id:1,first_name:1,last_name:1,email:1,eth_address:1}, (err , doc) =>{
    if(err){
      callback(err, null)
    }
    callback(null, doc)
  })
}
