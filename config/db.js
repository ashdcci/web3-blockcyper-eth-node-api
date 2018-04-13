var mongoose = require('mongoose')

mongoose.connect('mongodb://'+process.env.BNP_DB_HOST+'/'+process.env.BNP_DB_NAME)
mongoose.Promise = global.Promise
module.exports = mongoose
