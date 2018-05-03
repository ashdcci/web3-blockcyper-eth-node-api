// File : controller/userController.js -->

// user controller
function Todo(app){
    data 	= {};
    tomodel = {};
    bcapi = require('../config/bcpi')
    user_model  = require('../model/user_model')
    async = require('async')
    crypto  = require('crypto')
}

var ContractController = require('../controller/contractController')
var authToken = require('../middleware/authTokenMiddleware')

Todo.prototype.handleSocket  = (socket) =>{
    // console.log('connected to socket',socket.id) 

        socket.on('faucet_token',function(data){
            console.log(data)
        })

}


Todo.prototype.faucet_token = (io,data) => {
    authToken.authSocketToken(data, function(code ,doc){
        if(code==200){
            ContractController.faucet_token(io,doc)
        }
    })
}

module.exports = new Todo();