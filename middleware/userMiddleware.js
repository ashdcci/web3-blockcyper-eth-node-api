// File : controller/addressController.js -->

// address controller
function userMiddleware(app){
    data 	= {};
    tomodel = {};
    model 	= require('../model/user_model')
    crypto  = require('crypto');
  }



userMiddleware.prototype.checkUserAddress = function(req, res, next){

    tomodel.address = req.body.to_address

    model.getAddressValidates(tomodel,(err, doc) =>{
        console.log(err, doc)
        if(err){
            return res.status(500).json({
                status: 0,
                message: 'Problem in validate address'
            })
        }else if(doc === null){
            return res.status(400).json({
                status: 0,
                message: 'Sender Address is not Valid'
            })
        }   

        next()
    })

    return
}

userMiddleware.prototype.checkUserName = (req, res, next) =>{
    if(!req.body.recr_name){
        return res.status(400).json({
            status: 0,
            message: 'Receiver Name is missing'
        })
    }
    tomodel.name = req.body.recr_name
    model.getNameValidetes(tomodel,(err, doc) =>{
        if(err){
            return res.status(500).json({
                status: 0,
                mesage: 'Problam in validate username'
            })
        }else if(doc === null){
            return res.status(400).json({
                status: 0,
                message: 'Receiver Name is invalid'
            })
        }else if(req.headers['first_name']===req.body.recr_name){
            return res.status(400).json({
                status: 0,
                message: 'Receiver Name Must not be sender'
            })
        }

        next()
    })


}


module.exports = new userMiddleware()