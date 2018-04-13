module.exports = function(app){
  /**
   * Controller Calling Definations
   */
   var walletController = require('../controller/walletController')
   var addressController = require('../controller/addressController')
   var transactionController = require('../controller/transactionController')
   var userController = require('../controller/userController')
   var mainController = require('../controller/controller')
   var ContractController = require('../controller/contractController')

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
    app.post('/user/login', userController.login)
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
    app.get('/contract/trans_token',ContractController.trans_token)
    app.get('/contract/trans_to_addr',ContractController.trans_addr)
    app.get('/transaction/getSendMoney',authTokenMiddleware.authToken, transactionController.getSendMoney)
    app.get('/transaction/getRecdMoney',authTokenMiddleware.authToken, transactionController.getRecdMoney)
    app.post('/transaction/getTransactions',authTokenMiddleware.authToken , transactionController.getTransactions)
    app.get('*', (req, res, next)=>{
      res.send('not found call')
    })
}
