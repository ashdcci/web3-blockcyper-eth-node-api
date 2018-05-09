var mongoose = require('mongoose')

mongoose.connect('mongodb://'+process.env.BNP_DB_HOST+'/'+process.env.BNP_DB_NAME)
.then(() => {
    mongoose.Promise = global.Promise
})
.catch(err => { // mongoose connection error will be handled here
    console.error('App starting error:', err.message);
    // process.exit(1);
    return false
});


module.exports = mongoose
