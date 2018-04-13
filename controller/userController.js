// File : controller/userController.js -->

// user controller
function User(app){
  data 	= {};
  tomodel = {};
  bcapi = require('../config/bcpi')
  jwt = require('jsonwebtoken')
  superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_'
  user_model 	= require('../model/user_model')
  crypto  = require('crypto')
}
module.exports = new User();


User.prototype.register = function (req, res, next) {


      if(!req.body.email || !req.body.password){
        return res.status(400).json({
          status:0,
          msg:'required field are missing'
        })
      }

        req.body.access_token = createToken(req.body.email)
        console.log(req.body)
        tomodel = {}

        user_model.postRegister(req.body,function(err,rows){
            if(err){
                return res.status(500).json({"status":0,"messages":{"location":"body","param":"email","msg":"Internal Error has Occured"}})
            }

            if(rows==null){
              return res.status(401).json({"status":0,"messages":{"location":"body","param":"email","msg":"This Email already Exist into System"}})
            }

            createAddress(rows.email, res)
            return res.json({status:1,messages:"Register Successfully",data:rows})

        });


}


  User.prototype.login = function(req, res, next){
    if(!req.body.email || !req.body.password){
      return res.status(400).json({
        status:0,
        msg:'required field are missing'
      })
    }

    tomodel = {}

    user_model.postLogin(req.body,function(err,rows){
        if(err){
            return res.status(500).json({"status":0,"messages":{"location":"body","param":"email","msg":"Internal Error has Occured"}})
        }

        if(rows==null){
          return res.status(401).json({"status":0,"messages":{"location":"body","param":"email","msg":"This Email is not Exist into System"}})
        }

        return res.status(200).json({status:1,messages:"Login Successfully",data:rows})

    });

  }

/**
 * <b>Gen Addr</b>
 * Generates a new address and associate private/public keys.
 * @param {Object}   data    Optional JSON data, which could be used for generating multisig addresses, for exampl.JSON data, which could be used for generating multisig addresses, for example.
 * @callback cb
 * @method genAddr
 */
createAddress = function(email, res){

  bcapi.genAddr({},function(err, rows){

    if(err){
      return res.json({status: 0,messages: 'error into generating address' })
    }

    tomodel = {}
    tomodel.email = email
    tomodel.user_address = rows.address
    tomodel.address_public_key = rows.public
    tomodel.address_private_key = rows.private
    tomodel.wif = rows.wif
    user_model.updateHashAddress(tomodel,function(err1, doc){
      if(err1){
        return res.json({status: 0,messages: 'error into updaing address' })
      }
    })

  })

  return
}

createToken = function(id) {

  var exp_time = Math.floor(Date.now() / 1000) + (3600 * 3600);
  var token = jwt.sign({
    exp: exp_time,
    data: id + Math.floor((Math.random() * 1000000000) + 1).toString()
  }, superSecret);
  return token;

}


User.prototype.edit_profile = function(req, res, next){

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  tomodel.access_token = token
  tomodel.first_name = (req.body.first_name !== undefined) ? req.body.first_name : '',
  tomodel.last_name = (req.body.last_name !== undefined) ? req.body.last_name : ''

  user_model.edit_profile(tomodel,function(err,rows){
    if(err){
        return res.status(500).json({"status":0,"messages":{"location":"body","param":"email","msg":"Internal Error has Occured"}})
    }
    return res.status(200).json({status:1,messages:"Profile Updated"})
});
}
