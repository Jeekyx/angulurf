var request = require('request');
var logger = require('./logger').create('Requester');
var Q = require('q');

var KEY = require('./key.js');
var PREFIX = 'https://{reg}.api.pvp.net/api/lol/';
var REGIONS = ['euw', 'na'];

var region = REGIONS[0];

function formatUrl(api, args) {
	var url = PREFIX + api + '?';
	if (!args) {
		args = [];
	}
	args.push({ key: 'api_key', value: KEY});
	
	for (var i = 0; i < args.length - 1; i++) {
		url += args[i].key + '=' + args[i].value + '&';
	}
	url += args[args.length - 1].key + '=' + args[args.length - 1].value;

	return url.replace(/{reg}/g, region);
}

function get(api, args) {
	var deferred = Q.defer();
	var url = formatUrl(api, args);
	logger.debug('GET ' + url);
		
	request.get(url, function (err, res, body) {
		if (!err && res.statusCode === 200) {
			deferred.resolve(body);
			console.log('OK');
			console.log(body);
		} else {
			console.log('NOT');
			logger.error(body);
			deferred.reject(new Error(body));
		}
	});
	
	return deferred.promise;
}

/**
 * Change the region of the API endpoint.
 * return false if it was the last region, true otherwise.
 */
function changeRegion() {
	var index = (REGIONS.indexOf(region) + 1) % REGIONS.length;
	region = REGIONS[index];
	logger.debug('Changing region to ' + region);
	return index !== 0;
}
	

function getNurfMatches() {
	return get('{reg}/v2.2/match/2020461847');
}

function getMatchInfo(id) {
	return get('{reg}/v2.2/match/' + id);	
}

module.exports = {
	changeRegion: changeRegion,
	getNurfMatches: getNurfMatches
}
