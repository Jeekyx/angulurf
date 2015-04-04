var logger = require('./logger').create('Crawler');

var NURF_GAMES_DELAY = 2000;
var MATCH_INFO_DELAY = 2000;

var requester;
var mongoose;
var ids = [];
// Wed, 01 Apr 2015 10:45:00 GMT
var date = 1427885100;

function Crawler(req, mong) {
	requester = req;
	mongoose = mong;
}


function fillNurfsIds() {
	requester.getNurfMatches().then(function (res) {
		res.ids.forEach(function (id) {
			// Todo check if not present in base
			if (!ids.contains(id)) {
				ids.push(id);
			}
		});
	});
}

function saveMatch() {
	if (!ids.length) {
		return;
	}
	
	//requester.getMatchInfo(ids[0]);
}

// Increment date by 5 minutes
function incrementDate() {
	date += 300;
	logger.info('Increment date to ' + new Date(date * 1000) + ' (' + date + ')');
}

Crawler.prototype.test = function () {
	console.log(requester);
	requester.getNurfMatches().then(function (res) {
		
	});
}

Crawler.prototype.run = function () {
	// Date = x
	// Get ids in euw for x
	// Fill db with all ids info
	// Get ids in na for x
	// Fill db with all ids info
	// Date++;
	requester.getNurfMatches(date)
		.then(function (data) {
			data = JSON.parse(data);
			console.log(data);
			console.log(data.length);
			for (var i = 0; i < data.length; i++) {
				requester.getMatchInfo(data[i]);
			}
		});


	incrementDate();	
	/*
	
	while (true) {
		requester.get
		requester.changeRegion();
	}
	setInterval(requester.changeRegion, 200);
	//setInterval(saveMatch, MATCH_INFO_DELAY);
	*/
}

module.exports = Crawler;