// "use strict";
var Tx = require('ethereumjs-tx')
var fs = require('fs')
var web3 = require('../config/web3')
data = {};
tomodel = {};
crypto = require('crypto')
async = require('async')

class ethController{
    
    constructor(web3,Tx, fs, data, tomodel, crypto, async){
        this.web3 = web3
        this.Tx = Tx
        this.fs = fs
        this.data = data
        this.tomodel = tomodel
        this.crypto = crypto
        this.async = async
    }


    async getEthBalance(req, res, next) {
        
        if(!req.headers['eth_address']){
            return res.status(401).json({
                status: 0,
                msg: 'eth address is required'
            })
        }
        try{

            let myAddress = req.headers['eth_address']
            var balance = await web3.eth.getBalance(myAddress)

            return res.status(200).json({
                status: 1,
                msg: 'eth address balance',
                balance: web3.utils.fromWei(balance,'ether')
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                status: 0,
                msg: 'problam in getting balance'
            })
        }

    }

}

module.exports = new ethController(web3,Tx, fs, data, tomodel, crypto, async)