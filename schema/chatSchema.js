db = require('../config/db');
moment = require('moment');
var Schema = db.Schema;

var chatSchema = new Schema({
    from:  String,
    to: String,
    message: String,
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
    is_deleted: { type:Number, default:0}
  });
  
  
  module.exports = {
    chatSchema: chatSchema
  }