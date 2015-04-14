// Load modules
var express = require('express'),
http = require('http'),
bodyParser = require('body-parser');

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
  next();
});

app.set('http-port', process.env.PORT || 5142);

// HTTP
http.createServer(app).listen(app.get('http-port'), function () {
  console.log('Express HTTP server listening on port ' + app.get('http-port'));
});

// Livereload code
var livereload = require('livereload');
server = livereload.createServer();
server.watch(__dirname + "/www");
