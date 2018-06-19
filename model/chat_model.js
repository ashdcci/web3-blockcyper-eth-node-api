db = require('../config/db')
var crypto = require('crypto')
var moment = require('moment')
const chatSchema = require('../schema/chatSchema')
var Chat = db.model('Chat', chatSchema.chatSchema)

class chatModel{
    insertMessage(data,callback){
    
        
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
                    body: data.message,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
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
                        body: data.message,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
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

    descendingTimeOrder(loc1, loc2) {
        return loc2.created_at.getTime() - loc1.created_at.getTime()
    }

    fetchSingleThread(data, callback){
        
        // Chat.findOne({
        //     '$and':[
        //         { 'receipent':  data.sender_name },
        //         { 'receipent':  data.recr_name }
        //     ],
        // } , {message: {$slice: [0,2]}}
        // )

        Chat.aggregate([{$match: {
            '$and':[
                { 'receipent':  data.sender_name },
                { 'receipent':  data.recr_name }
            ]
        } }, 
        {$unwind: "$message"}, 
        {$sort: {"message.created_at": -1}},
        {$skip: 0},
        {$limit: 10},
        {"$group": {
            _id : { 
                _id: '$_id', 
                receipent: { $concatArrays : [ "$receipent" ] },
                created_at:"$created_at",
                updated_at:"$updated_at",
            },
            message: {"$push":  "$message"}}},
        {
                $project:{
                    "id":1,
                    "receipent":"$receipent",
                    "message":"$message"
        }
        }])

        .exec((err, doc) =>{
        
            // doc.message.sort(this.descendingTimeOrder).forEach(function(msg) {
            //     console.log('msg: ' + msg.created_at);
            // })
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }

    fetchAllThread(data, callback){
        
        Chat.aggregate([{$match: {
            receipent: { $elemMatch: { $eq: data.user_name } },
            // 'message.is_deleted':0
        } }, 
        {$unwind: "$message"}, 
        {$sort: {"message.created_at": -1}},
        {$skip: 0},
        {$limit: 10},
        {"$group": {
            _id : { 
                _id: '$_id', 
                receipent: { $concatArrays : [ "$receipent" ] },
                created_at:"$created_at",
                updated_at:"$updated_at",
            },
            message: {"$first":  "$message"}}},
        {
                $project:{
                    "id":1,
                    c:22,
                    "message":{
                        $filter: {
                            input: ["$message"],
                            as: "message",
                            cond: { $eq: [ "$message.is_deleted", 0 ] }
                         }
                    },
                    c:1
                    // message: "$message"
        }
        }])
        .exec((err, doc) =>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }


}


module.exports = new chatModel()