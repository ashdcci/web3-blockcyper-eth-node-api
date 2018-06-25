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
        
        Chat.aggregate([
            {
                $match: {
                    receipent: { $elemMatch: { $eq: data.user_name } },
                    // 'is_deleted.$._id':{$not:{$elemMatch:{$eq:data._id}}},
                    'is_deleted._id':{$ne:data._id},
                    // 'message':{$ne:[]}
                    // is_deleted:{$nin:[data._id,"$is_deleted"]}
                    // 'message.is_deleted':{$not:{$elemMatch:{$eq:data._id}}}
                } 
            }, 
        {$unwind: "$message"}, 
        {$sort: {"message.created_at": -1}},
        {$skip: 0},
        {$limit: 10},
        {
            "$group": {
                _id : { 
                    _id: '$_id', 
                    receipent: { $concatArrays : [ "$receipent" ] },
                    is_deleted:"$is_deleted",
                    created_at:"$created_at",
                    updated_at:"$updated_at",
                },
                // message: {"$first":  "$message"}
                message: {$push :  {$cond: { if: { $in: [ data._id, '$message.is_deleted._id'] /*$eq: [ { $size:'$message.is_deleted' } ,0 ]*/ }, then: '$1', else: '$message' } } }//{"$push":  "$message"}
            }
        },
        {
                $project:{
                    "id":1,
                    // "message":{
                    //     $filter: {
                    //         input: "$message",
                    //         as: "message",
                    //         // cond: { $not:{$eq: [data._id, '$$message.is_deleted._id']}}  /*$nin: [ "$message.is_deleted", data._id ]*/ 
                    //         // cond:{$ne: ["$message.is_deleted._id", db.Types.ObjectId(data._id)]}
                    //         cond:{$ne:["$message",[]]}
                    //      }
                    // },
                    is_deleted:"$is_deleted",
                    message1: "$message",
                    message:{$slice:['$message',1]}
                    // message1: {
                    //     $cond: { if: { $in: [ data._id, '$message.is_deleted'] }, then: "$message", else: "$message" }
                    //   },
                    // message2:{ "$setEquals": [
                    //     { "$setIntersection": [ ["$message.is_deleted"], [ {'_id':data._id.toString()} ] ] },
                    //     "$message"
                    // ]}
                }
        },
        

        // { "$project": {
        //     "id":1,
        //     "someArray": {
        //       "$filter": {
        //         "input": {
        //           "$map": {
        //             "input": ["$message"],
        //              "as": "message",
        //              "in": {
        //                "_id": "$$message._id",
        //                "from":"$$message.from",
        //                "to":"$$message.to",
        //                "body":"$message.body",
        //                "created_at":"$message.created_at",
        //                "is_deleted": {
        //                  "$filter": {
        //                    "input": "$$message.is_deleted",
        //                    "as": "is_deleted",
        //                    "cond": { "$ne": [ "$$is_deleted._id", db.Types.ObjectId("5b27a22c6ef9d637f31acec9") ] }
        //                  }
        //                }
        //              }
        //           }
        //         },
        //         "as": "message",
        //         "cond": { "$eq": ['$message.is_deleted', [] ] }
        //       }
        //     }
        //   }}
    
    
    ])
        .exec((err, doc) =>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }

    deleteMessage(data,callback){
        
        Chat.update({'message._id':data.messageId},{$addToSet:{'message.$.is_deleted':data._id}}, (err, doc)=>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })

    }

    deleteThread(data,callback){
        Chat.update({'_id':data.threadId},{$addToSet:{'is_deleted':data._id}}, (err, doc)=>{
            console.log(err,doc)
            if(err){
                callback(err, null)
            }
            callback(null , doc)
        })
    }


    updateUserNameThread(data, callback){

        Chat.aggregate(
        [
            {
                $match:{
                    receipent:data.first_name
                }
            },
            {
                $unwind:"$message"
            },
            {
                $project:{
                    _id:1,
                    message:"$message"
                }
            }
        ], (err, docs) =>{

            if(err){
                callback(err, null)
            }else if(docs==null){
                callback(null, null)
            }

            console.log(docs)

            var ops = [],
            counter = 0;
            docs.forEach( (doc)=>{
                
                if(doc.message.from == data.first_name){
                    var set = { "$set": { "message.$.from": data.user_name } }
                }else{
                    var set = { "$set": { "message.$.to": data.user_name } }
                }
                
                ops.push({
                    "updateOne": {
                        "filter": { "message._id": doc.message._id },
                        "update": set
                    }
                });
            })

            if(ops.length > 0){
                Chat.bulkWrite(ops, function(err1, r1) {
                    if(err1){
                        callback(err1,null)
                    }
                    callback(null, r1)

                });
            }else{
                callback(null, null)
            }
        })
    }


}

//db.getCollection('chats').update({"message.is_deleted": { "$eq": 0 }},{$set:{'message.$.is_deleted' : []}}, {multi : true}) 
module.exports = new chatModel()