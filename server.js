require('dotenv').config();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var cors            = require('cors');
var port = process.env.BNP_PORT;
var app = express();

// Body Parser MW
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


//morge dev mode set
app.use(morgan('dev'));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
var routes = require('./routes/index')(app);



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


app.listen(port, function(){
  if(process.env.BNP_ENV=='dev'){
    console.log('Server started on port '+port);
  }
});
