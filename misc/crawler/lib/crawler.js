var logger = require('./logger').create('Crawler');

var NURF_GAMES_DELAY = 2000;
var MATCH_INFO_DELAY = 2000;

var requester;
var mongoose;
var ids = [];
var date = 1427865900; // Wed, 01 Apr 2015 05:25:00 GMT

function Crawler(req, mong) {
	requester = req;
	mongoose = mong;
}

Crawler.prototype.test = function () {
	console.log(requester);
	requester.getNurfMatches().then(function (res) {
		
	});
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

Crawler.prototype.run = function () {
	// Date = x
	// Get ids in euw for x
	// Fill db with all ids info
	// Get ids in na for x
	// Fill db with all ids info
	// Date++;
	requester.getNurfMatches();

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