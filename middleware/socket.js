module.exports = (server) =>{

    global.io = require('socket.io').listen(server);
    
    var todoController = require('../controller/todoController')
    var authTokenMiddleware = require('../middleware/authTokenMiddleware')
    // io.sockets.on('connection', todoController.handleSocket)
    io.sockets.on('connection', (socket) =>{
        // console.log('connected to socket',socket.id)  
        
        socket.on('faucet_token',function(data){
            console.log(data)
            todoController.faucet_token(io,data)
        })

        // socket.emit("unread_notif_"+11,{unread_count :1,user_id:11});
    } );

}
