var Global = require('../models/models.js').Global;
var stats = {};

var LEAGUES = [
	'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger'
];

var express = require('express');
var router = express.Router();

// Retrive all the static data and the global data of all the urf games
Global.findOne({}, '-_id -__v',function (err, doc) {
	var global = doc.toObject();
	LEAGUES.forEach(function (league) {
		stats[league] = global[league].total;
	});
});

router.get('/', function(req, res, next) {
	res.send(stats);
});

module.exports = router;