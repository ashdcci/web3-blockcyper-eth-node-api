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

        if(!req.body.recr_name || !req.body.message){
            return res.status(401).json({
                status: 0,
                message:'required field missing'
            })
        }

        tomodel.sender_name = req.headers['first_name']
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
        console.log(req.params.recr_name)
        if(!req.params.recr_name){
            return res.status(401).json({
                status: 0,
                message: 'required fields are missing'
            })
        }
        tomodel.sender_name = req.headers['first_name']
        tomodel.recr_name = req.params.recr_name 

        chat_model.fetchSingleThread(tomodel,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message:'prblam in fetching single thread'
                })
            }

            return res.status(200).json({
                status:1,
                message:'latest message',
                data:rows
            })

        })


    }

    fetchAllThread(req, res, next){
        if(!req.headers['first_name']){
            return res.status(401).json({
                status: 0,
                message: 'required fields are missing'
            })
        }
        tomodel.user_name = req.headers['first_name']
        tomodel._id = req.headers['user_id']
        chat_model.fetchAllThread(tomodel,(err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message:'prblam in fetching single thread'
                })
            }

            return res.status(200).json({
                status:1,
                message:'latest threads',
                data:rows
            })

        })
    }


    deleteThread(req, res, next){
        if(!req.body.threadId){
            return res.status(401).json({
                status:0,
                message:'message_id is missing'
            })
        }

        tomodel.threadId = req.body.threadId
        tomodel._id = req.headers['user_id']
        chat_model.deleteThread(tomodel,(err, rows)=>{
            if(err){
                return res.status(500).json({
                    status:0,
                    message:'problam in deleting message'
                })
            }

            return res.status(200).json({
                status:1,
                message:'message deleted'
            })

        })
    }

    deleteMessage(req, res, next){
        if(!req.body.messageId){
            return res.status(401).json({
                status:0,
                message:'message_id is missing'
            })
        }
        tomodel.messageId = req.body.messageId
        tomodel._id = req.headers['user_id']
        chat_model.deleteMessage(tomodel,(err, rows)=>{
            if(err){
                return res.status(500).json({
                    status:0,
                    message:'problam in deleting message'
                })
            }

            return res.status(200).json({
                status:1,
                message:'message deleted'
            })

        })
        
    }


    readMessage(req, res, next){
        if(!req.body.messageId){
            return res.status(401).json({
                status:0,
                message:'message_id is missing'
            })
        }
        tomodel.messageId = req.body.messageId
        tomodel._id = req.headers['user_id']
        chat_model.readMessage(tomodel,(err, rows)=>{
            if(err){
                return res.status(500).json({
                    status:0,
                    message:'problam in deleting message'
                })
            }

            return res.status(200).json({
                status:1,
                message:'message deleted'
            })

        })
    }



    updateUserNameThread(req, res, next){

        console.log(req.headers)

        if(!req.body.first_name){
            return res.status(401).json({
                status:0,
                message:'first_name is missing'
            })
        }
        tomodel.user_name = req.body.first_name
        tomodel.first_name = req.headers['first_name']
        chat_model.updateUserNameThread(tomodel, (err, rows) =>{
            if(err){
                return res.status(500).json({
                    status: 0,
                    message: 'problam in updation of username'
                })
            }

            return res.status(200).json({
                status:1,
                data:rows
            })
        })

    }
    
}


module.exports = new chatController()