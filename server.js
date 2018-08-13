'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan      = require('morgan');
const cors            = require('cors');
const passport = require('passport');
const port = process.env.PORT || 3000;
const http	 	= require('http');
const app = express();
const server = http.createServer(app);
// Body Parser MW
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

console.log(app.get('views'))
//morge dev mode set
app.use(morgan('dev'));


// Init passport
app.use(passport.initialize());
require('./config/passport')(passport);


// Set Static Folder
app.use(express.static(path.join(__dirname, 'views')));
const routes = require('./routes/index')(app);


const io = require('./middleware/socket.js')(server);

if(process.env.BNP_ENV=='dev'){
  // error handling for dev mode
  app.use(function(err, req, res, next) {

      console.log(err);

      res.status(err.status || 500);
      res.json({
          message: err.message,
          error: err
      });
  });
}


server.listen(port, () => {
  console.log('Express server listening on port', port)
});

// server.listen(port, function(){
//   if(process.env.BNP_ENV=='dev'){
//     console.log('Server started on port '+port);
//   }
// });
