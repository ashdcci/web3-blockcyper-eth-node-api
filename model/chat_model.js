db = require('../config/db')
var crypto = require('crypto')
var moment = require('moment')
const chatSchema = require('../schema/chatSchema')
var Chat = db.model('Chat', chatSchema.chatSchema)

class chatModel{
    insertMessage(data,callback){
    
        console.log(data)
        Chat.findOne({ 
            '$and':[
                { 'receipent':  data.sender_name },
                { 'receipent':  data.recr_name }
            ]
        }).exec().then((doc) =>{

            if(doc){
                /**
                 *  push into array
                 * */

                let message = {
                    from: data.sender_name,
                    to: data.recr_name,
                    body: data.message
                }
                return Chat.update(
                    { _id: doc._id },
                    { $push: {message:message} }
                )


            }else{
                /**
                 * make new array
                 */

                let msg = {
                    receipent: [data.sender_name, data.recr_name],
                    // sent: new Date(),
                    message: [{
                        from: data.sender_name,
                        to: data.recr_name,
                        body: data.message
                    }],
                }
                //Send a message

                var chat_data = new Chat(msg)

                // return Chat.save(msg)

                chat_data.save()
                return callback(null, data)


            }

        }).then((chat_doc)=>{
            callback(null, chat_doc)
        }).catch(function(err) {

            if (err.err_obj) {
              callback(null, null)
            } else {
      
              callback(err, null)
            }
      
        })


    }
}


module.exports = new chatModel()