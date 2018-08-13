var mongoose = require('mongoose')

mongoose.connect('mongodb://'+process.env.BNP_DB_USER+':'+process.env.BNP_DB_PASS+'@'+process.env.BNP_DB_HOST+':'+process.env.BNP_DB_PORT+'/'+process.env.BNP_DB_NAME,{ useNewUrlParser: true })
.then(() => {
    mongoose.Promise = global.Promise
    console.log('conn establish')
})
.catch(err => { // mongoose connection error will be handled here
    console.error('App starting error:', err.message);
    // process.exit(1);
    return false
});


module.exports = mongoose
