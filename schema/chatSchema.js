db = require('../config/db');
moment = require('moment');
var Schema = db.Schema;

var MessageSchema = new Schema({
    from: String,
    to: String,
    body: String,
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
    is_deleted: { type:Number, default:0}
  });


var chatSchema = new Schema({
    receipent:  [String],
    message: {
      type: [MessageSchema],
      default: undefined    
    },
    is_deleted: { type:Number, default:0},
    created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
  });
  
  
  module.exports = {
    chatSchema: chatSchema
  }