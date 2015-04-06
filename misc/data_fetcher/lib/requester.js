var request = require('request');
var logger = require('./logger').create('Requester');
var Q = require('q');

var KEY = require('./key.js');
var PREFIX_REGION = 'https://{reg}.api.pvp.net/api/lol/';
var PREFIX_GLOBAL = 'https://global.api.pvp.net/api/lol/';
var REGIONS = ['euw', 'na'];

var region = REGIONS[0];

function formatUrl(api, args) {
	var url = api + '?';
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
	logger.info('GET ' + url);
		
	request.get(url, function (err, res, body) {
		if (!err && res.statusCode === 200) {
			deferred.resolve(body);
		} else if (err) {
			deferred.reject(err);
		} else {
			deferred.reject({statusCode: res.statusCode});
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
	return index !== 0;
}
	
/**
 * Return the URF match ids for the given date.
 */
function getUrfMatches(date) {
	return get(PREFIX_REGION + '{reg}/v4.1/game/ids', [{key: 'beginDate', value: date}]);
}

/*
 * Return all the data about the match.
 */
function getMatchInfo(id) {
	return get(PREFIX_REGION + '{reg}/v2.2/match/' + id, [{key: 'includeTimeline', value: true}]);	
}

/*
 * Return the static data about the champions.
 */
function getChampionsInfo() {
	return get(PREFIX_GLOBAL + 'static-data/euw/v1.2/champion', [{key: 'champData', value:'image'}]);
}

/*
 * Return the static data about the items.
 */
function getItemsInfo() {
	return get(PREFIX_GLOBAL + 'static-data/euw/v1.2/item', [{key: 'itemListData', value:'image'}]);
}

/*
 * Return the static data about the champions.
 */
function getSummonerSpellsInfo() {
	return get(PREFIX_GLOBAL + 'static-data/euw/v1.2/summoner-spell', [{key: 'spellData', value:'image'}]);
}

module.exports = {
	changeRegion: changeRegion,
	getUrfMatches: getUrfMatches,
	getMatchInfo: getMatchInfo,
	getChampionsInfo: getChampionsInfo,
	getItemsInfo: getItemsInfo,
	getSummonerSpellsInfo: getSummonerSpellsInfo
}
