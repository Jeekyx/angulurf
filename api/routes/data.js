var Global = require('../models/models.js').Global;
var Item = require('../models/models.js').Item;
var Champion = require('../models/models.js').Champion;
var SummonerSpell = require('../models/models.js').SummonerSpell;

var LEAGUES = [
	'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger'
];

var express = require('express');
var routerRandom = express.Router();

var global;
var items;
var champions;
var spells;

// Return the element of the collection with the given id
function getData(collection, id) {
	for (var i = 0; i < collection.length; i++) {
		if (collection[i].id === id) {
			return collection[i];
		}
	}
	return null;
}

// Return a random element of the given collection
function randomElement(collection) {
	return collection[Math.floor(Math.random() * collection.length)];
}

function random(max) {
	return Math.floor(Math.random() * max);
}

function getValueFromObject(category, property) {
	var res = { data: {}};
	var item;
	console.log(category + ' ' + property);
	LEAGUES.forEach(function (league) {
		if (category) {
			item = global[league][category][property];
		} else {
			item = global[league][property];
		}

		if (property === 'kills') {
			res.data[league] = item ? {total: item, perPlayer: item / global[league].total} : null;
			res.icon = 'http://img2.wikia.nocookie.net/__cb20150222114542/leagueoflegends/images/9/9d/SummonerIcon_Honorable_unused.png';
		} else if (property === 'double' || property === 'triple' || property === 'quadra' || property === 'penta') {
			res.data[league] = item ? {total: item, perPlayer: item / global[league].total} : null;
			res.icon = 'http://img1.wikia.nocookie.net/__cb20110527180009/leagueoflegends/images/thumb/6/67/ProfileIcon10.jpg/64px-ProfileIcon10.webp';
		} else {
			res.data[league] = item ? {total: item, avg: item} : null;
			if (property === 'firstDrake') {
				res.icon = 'http://img1.wikia.nocookie.net/__cb20141030171151/leagueoflegends/fr/images/thumb/4/44/DragonPortrait.png/120px-DragonPortrait.png';
			} else if (property === 'firstBaron') {
				res.icon = 'http://img2.wikia.nocookie.net/__cb20141026123952/leagueoflegends/fr/images/d/df/BaronNashorPortrait.png';
			} else if (property === 'firstLevel6') {
				res.icon = 'http://img3.wikia.nocookie.net/__cb20150222114543/leagueoflegends/images/8/8b/SummonerIcon_Mentor_unused.png';
			} else {
				res.icon = 'http://img3.wikia.nocookie.net/__cb20140607013331/leagueoflegends/images/thumb/3/39/Assassin_icon.jpg/64px-Assassin_icon.webp';
			}
		}
	});
	return res;
}

// Todo : case where the item was never picked in another league
function getValueFromArray(property) {
	var id = randomElement(global.unranked[property]).id;
	var res = { data: {}};
	var item;
	LEAGUES.forEach(function (league) {
		item = getData(global[league][property], id);
		res.data[league] = item ? {total: item.count, percent: 100 * item.count / global[league].total} : null;
	});
	
	if (property === 'bans' || property === 'picks') {
		res.object = getData(champions, id);
	} else if (property === 'items') {
		res.object = getData(items, id);
	} else if (property === 'spells') {
		res.object = getData(spells, id);
	}
	res.icon = res.object.image;
	return res;
}

function sendResponse(res) {
	var property;
	var result;
	// We first random a category (everything but "total")
	var category;
	do {
		category = randomElement(Object.keys(global.unranked));
	} while (category === 'total');
	
	switch (global.unranked[category].constructor) {
		case Array:
			property = category;
			result = getValueFromArray(property);
			break;
		case Object:
			property = randomElement(Object.keys(global.unranked[category]));
			result = getValueFromObject(category, property);
			break;
		// Match duration
		default:
			property = category;
			result = getValueFromObject(null, property);
			break;
	}
	
	result.type = property;
	console.log(result);
	console.log();
	res.send(result);
}

// Retrive all the static data and the global data of all the urf games
Global.findOne({}, '-_id -__v',function (err, doc) {
	global = doc.toObject();
	LEAGUES.forEach(function (league) {
		// To simplify the object structure
		global[league].picks = global[league].champions.picks;
		global[league].bans = global[league].champions.bans;
		delete global[league].champions;
	});
});

Item.find({}, '-_id -__v', function (err, docs) {
	items = docs;
	console.log(items.length + ' items');
});

Champion.find({}, '-_id -__v', function (err, docs) {
	champions = docs;
	console.log(champions.length + ' champions');
});

SummonerSpell.find({}, '-_id -__v', function (err, docs) {
	spells = docs;
	console.log(spells.length + ' spells');
});

routerRandom.get('/', function(req, res, next) {
	sendResponse(res);
});

module.exports.Random = routerRandom;
