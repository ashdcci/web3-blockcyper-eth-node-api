db = require('../config/db');
moment = require('moment');
var Schema = db.Schema;


var transactionSchema = new Schema({
  sender_id: {type: String, default: null},
  recr_id: {type: String, default: null},
  sender_address: {type: String, default: null},
  recr_address: {type: String, default: null},
  transaction_hash: {type: String , default: null},
  transaction_tx: {type: String , default: null},
  amount : {type: Number , default: null},
  created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
  updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
  deleted_at: { type: String, default: null },
  is_deleted: { type:Number, default:0},
  tx_type: { type:Number, default:0}
});


module.exports = {
  transactionSchema: transactionSchema
}
