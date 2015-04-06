var requester = require('./lib/requester');
var mongoose = require('mongoose');

var Crawler = require('./lib/crawler');
var crawler = new Crawler(requester, mongoose);

var start = 1427885100;
var then = new Date(start);
console.log(then);
crawler.run();

/*
requester.getNurfMatches()
	.then(function () {
		console.log('then');
	})
	.catch(function (err) {
		console.log(err);
	});
	
	
mongoose.connection.on("open", function(ref) {
	
	console.log("Connected to mongo server.");
	crawler.test();
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
});
	
mongoose.connect('mongodb://localhost/nurf');
*/