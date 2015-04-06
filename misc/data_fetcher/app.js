var argv = require('minimist')(process.argv.slice(2));

var requester = require('./lib/requester');
var mongoose = require('mongoose');
var logger = require('./lib/logger').create('App');

var MONGO_URI = 'mongodb://localhost/urf';

function fetchStaticData() {
	logger.info('Fetching static data');
	var staticMgr = require('./lib/static').init(requester, mongoose);
	staticMgr.run();
}

function startCrawler() {
	logger.info('Starting crawler');
	var crawler = require('./lib/crawler').init(requester, mongoose);
	crawler.run();
}

function printHelp() {
	console.log('usage: node app.js module');
	console.log('modules:');
	console.log(' *crawler : fetch the URF games data from the beginning and store them in the database');
	console.log(' *static  : fetch LoL static data and store them in the database');
}

function startMongo(callback) {
	mongoose.connect(MONGO_URI, function(err) {
		if (!err) {
			logger.info('Connected to ' + MONGO_URI);
			callback();
		} else {
			logger.error('Could not connect to ' + MONGO_URI);
		}
	});
}

var module = argv._[0];
if (module === 'crawler') {
	startMongo(startCrawler);
} else if (module === 'static') {
	startMongo(fetchStaticData);
} else {
		printHelp();	
}