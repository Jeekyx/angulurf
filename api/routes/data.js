var Global = require('../models/models.js').Global;
var Item = require('../models/models.js').Item;
var Champion = require('../models/models.js').Global;
var SummonerSpell = require('../models/models.js').Global;

var express = require('express');
var routerRandom = express.Router();

var global;
var items;
var champions;
var spells;

// Retrive all the static data and the global data of all the urf games
Global.findOne({}, '-_id -__v',function (err, doc) {
	global = doc;
});

Item.find({}, '-_id -__v', function (err, docs) {
	items = docs;
});

Champion.find({}, '-_id -__v', function (err, docs) {
	champions = docs;
});

SummonerSpell.find({}, '-_id -__v', function (err, docs) {
	spells = docs;
});

function sendResponse(res) {

}

routerRandom.get('/', function(req, res, next) {
	console.log('GET /random');
	if (req.query.leagues) {
		var leagues = req.query.leagues.split(',');
		console.log(req.query);
		res.send(items);
	} else {
		res.status(400).send('no leagues specified');
	}
});

module.exports.Random = routerRandom;
