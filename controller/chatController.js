// "use strict";
let Tx = require('ethereumjs-tx')
let fs = require('fs')
let web3 = require('../config/web3')
let data = {};
let tomodel = {};
crypto = require('crypto')
async = require('async')
chat_model = require('../model/chat_model')

class chatController{

    
    insertMessage(req, res, next){

        if(!req.body.sender_name || !req.body.recr_name || !req.body.message){
            return res.status(401).json({
                status: 0,
                message:'required field missing'
            })
        }

        tomodel.sender_name = req.body.sender_name
        tomodel.recr_name = req.body.recr_name
        tomodel.message = req.body.message

        chat_model.insertMessage(tomodel, (err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message: 'problam in saving data'
                })
            }
            return res.status(200).json({
                status: 1,
                message: 'message saved' 
            })
        })


        return
    }

    fetchSingleThread(req, res, next){

    }

    fetchAllThread(req, res, next){

    }
    
}


module.exports = new chatController()