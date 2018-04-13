db = require('../config/db');
moment = require('moment');
var Schema = db.Schema;


var userSchema = new Schema({
  first_name:  String,
  last_name: String,
  email:   { type: String,required: true, index: { unique: true }},
  password: String,
  access_token: String,
  user_address:{type: String, default: null},
  address_private_key: {type: String, default: null},
  address_public_key: {type: String, default: null},
  address_wif: {type: String, default: null},
  created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
  updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
  deleted_at: { type: String, default: null },
  is_deleted: { type:Number, default:0}
});


module.exports = {
  userSchema: userSchema
}
