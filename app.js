// Load modules
var express = require('express'),
http = require('http'),
bodyParser = require('body-parser');

var MONGO_URI = 'mongodb://localhost/urf';
var mongoose = require('mongoose');

var routesStats = require('./api/routes/stats');
var routesData = require('./api/routes/data');

// Configure global path
global.__base = __dirname + '/';

app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve angular app
app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization');
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

/*mongoose.connect(MONGO_URI, function(err) {
  if (!err) {
    console.log('Connected to ' + MONGO_URI);
  } else {
    console.error('Could not connect to ' + MONGO_URI);
  }
});

app.use('/stats', routesStats);
app.use('/random', routesData.Random);*/

app.set('http-port', process.env.PORT || 5142);

// HTTP
http.createServer(app).listen(app.get('http-port'), function () {
  console.log('Express HTTP server listening on port ' + app.get('http-port'));
});

// Livereload code
/*var livereload = require('livereload');
server = livereload.createServer();
server.watch(__dirname + "/www");*/
