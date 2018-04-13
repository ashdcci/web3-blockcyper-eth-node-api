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

  pwd = crypto.createHash("md5")
    .update(data.password)
    .digest('hex');


  User.findOne({
      email: data.email,
      password: pwd
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
    address_wif: data.wif
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
