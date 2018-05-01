// File : controller/addressController.js -->

// address controller
function authTokenMiddleware(app){
  data 	= {};
  tomodel = {};
  model 	= require('../model/user_model')
  jwt = require('jsonwebtoken')
  superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_'
  crypto  = require('crypto');
}

authTokenMiddleware.prototype.authToken = function(req, res, next){



    // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        tomodel = {}
        tomodel.access_token = token
        user_model.getUserHashAddressByToken(tomodel,function(err1,doc){

            if(err1){
              return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
            }else if(doc==null){
              return res.status(400).json({ success: 0, message: 'Failed to authenticate token.' });
            }

            req.headers['user_id'] = doc._id
            req.headers['user_address'] = doc.user_address
            req.headers['eth_address'] = doc.eth_address
            req.headers['eth_private_key'] = doc.eth_private_key
            next();

        })
        return
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).json({
        success: 0,
        message: 'No token provided.'
    });

  }

}

module.exports = new authTokenMiddleware();
