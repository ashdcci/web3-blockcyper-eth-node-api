

module.exports = function(app, server){
  var path = require('path');
  var http	 	= require('http');
  var request_obj = require('request');
  var url = require('url');
  var server = http.createServer(app);
  var io = require('socket.io').listen(server);
  var passport = require('passport');
  var jwt = require('jsonwebtoken');

// Example of required auth: protect dashboard route with JWT
app.get('/dashboard', passport.authenticate('jwt', {
  session: false
}), function(req, res, next) {
  res.json({'It worked! User id is: ': req.user._id});
});


  /**
   * Controller Calling Definations
   */
   var walletController = require('../controller/walletController')
   var addressController = require('../controller/addressController')
   var transactionController = require('../controller/transactionController')
   var userController = require('../controller/userController')
   var mainController = require('../controller/controller')
   var ContractController = require('../controller/contractController')
  var chatController = require('../controller/chatController')
  var ethController = require("../controller/ethController");

   
   /**
    * Middleware calling definations
    */
   var authTokenMiddleware = require('../middleware/authTokenMiddleware')
   var userMiddleware = require('../middleware/userMiddleware')

   /**
    * Routes Definations
    */
    app.get('/',mainController.index)
    app.get('/wallet/listwallet', walletController.listwallet)
    app.post('/wallet/createWallet', walletController.createWallet)
    app.post('/wallet/addAddress',walletController.associateAddress)
    app.post('/user/register', userController.register)
    app.post('/user/login', userController.login, userController.updateToken)
    app.put('/user/edit-profile',authTokenMiddleware.authToken,userController.edit_profile)
    app.post('/address/fundAddress', authTokenMiddleware.authToken, addressController.fundAddress)
    app.post('/address/getAddressDetails', authTokenMiddleware.authToken, addressController.getAddressDetails)
    app.post('/address/getAddressBalance', authTokenMiddleware.authToken, addressController.getAddressBalance)
    app.post('/address/getFullAddressDetails', authTokenMiddleware.authToken, addressController.getFullAddressDetails)
    app.post('/transaction/create',authTokenMiddleware.authToken,userMiddleware.checkUserAddress, transactionController.createTransaction)
    app.get('/transaction/block/:hash', transactionController.getTransactionBlockDetails)
    app.get('/transaction/getConfidence/:hash', transactionController.getTransactionConfidence)
    app.get('/wallet/balance/:wallet',walletController.getWalletAddressBalance)
    app.get('/contract/index',ContractController.index)
    app.post('/contract/trans_token',authTokenMiddleware.authToken, ContractController.isAddress,ContractController.checkEthBalance, ContractController.checkTokenBalance) // , ContractController.trans_token
    app.post('/eth/trans_to_addr',authTokenMiddleware.authToken, ethController.isAddress, ethController.checkBalance,ethController.trans_addr)
    app.get('/transaction/getSendMoney',authTokenMiddleware.authToken, transactionController.getSendMoney)
    app.get('/transaction/getRecdMoney',authTokenMiddleware.authToken, transactionController.getRecdMoney)
    app.post('/transaction/getTransactions',authTokenMiddleware.authToken , transactionController.getTransactions)
    app.post('/transaction/getEthTransactions',authTokenMiddleware.authToken , transactionController.getEthTransactions)
    app.post('/contract/new-eth-address',authTokenMiddleware.authToken,addressController.checkEthAddress, addressController.newEthAddress )
    app.post('/contract/getTokenBalance', authTokenMiddleware.authToken, ContractController.getTokenBalance)
    app.post('/eth/getBalance',authTokenMiddleware.authToken,ethController.getEthBalance)
    app.post('/eth/unlockAccount',authTokenMiddleware.authToken,ethController.unlockAccount)
    app.post('/chat/insert',authTokenMiddleware.authToken,userMiddleware.checkUserName,chatController.insertMessage)
    app.get('/chat/get-single-thread/:recr_name',authTokenMiddleware.authToken,chatController.fetchSingleThread)
    app.get('/chat/get-threads-list',authTokenMiddleware.authToken,chatController.fetchAllThread)
    app.delete('/chat/delete-message',authTokenMiddleware.authToken,chatController.deleteMessage)
    // app.put('/chat/update-username',authTokenMiddleware.authToken,chatController.updateUserNameThread)
    app.post('/chat/search-user', authTokenMiddleware.authToken, chatController.searchUserForRoom)

    app.post('/chat/shhMessage',chatController.postMessage)

    app.post('/address/new-address', (req,res,next)=>{
        
      // var options = {
      //   host: 'https://api.blockcypher.com/',
      //   port: null,
      //   path: '/v1/beth/test/addrs?token='+process.env.BNP_CYPHER_API_TOKEN,
      //   method: 'POST'
      // };

      // // var options = new URL('https://api.blockcypher.com/v1/beth/test/addrs?token='+process.env.BNP_CYPHER_API_TOKEN);

      // console.log(options)
      // var req = http.request(options, function(res) {
      //   console.log(945154)
      //   console.log('STATUS: ' + res.statusCode);
      //   console.log('HEADERS: ' + JSON.stringify(res.headers));
      //   res.setEncoding('utf8');
      //   res.on('data', function (chunk) {
      //     console.log('BODY: ' + chunk);
      //   });
      // });

      request_obj('https://api.blockcypher.com/v1/beth/test/addrs?token='+process.env.BNP_CYPHER_API_TOKEN, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
      });

      
      res.status(200).json(54585412)
    })

    app.use('*', (req, res, next)=>{
      res.status(404).json({status:0,msg:'api call undefined'})
      // res.sendFile(path.join(__dirname, '../dist/index.html'))
      // next()
    })
}
