// File : controller/mainController.js -->

// mainController controller
function MainController(app){
  data 	= {};
  tomodel = {};
  // model 	= {};
  crypto  = require('crypto');
}

MainController.prototype.index = function (req, res, next) {
    res.render('index')
}

module.exports = new MainController();
