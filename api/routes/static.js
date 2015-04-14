var Models = require('../models/models.js');

var express = require('express');
var routerItem = express.Router();
var routerChampion = express.Router();
var routerSpell = express.Router();

routerItem.get('/', function(req, res, next) {
	var ids = req.query.ids.split(',');
	if (ids) {
		Models.Item.find({id: { $in: ids}}, function (err, docs) {
			res.send(docs);
		});
	} else {
		res.send([]);
	}
});

routerChampion.get('/', function(req, res, next) {
	console.log('champions');
	var ids = req.query.ids.split(',');
	if (ids) {
		console.log(ids);
		Models.Champion.find({id: { $in: ids}}, function (err, docs) {
			console.log(err);
			console.log(docs);
			res.send(docs);
		});
	} else {
		console.log('else')
		res.send([]);
	}
});

routerSpell.get('/', function(req, res, next) {
	var ids = req.query.ids.split(',');
	if (ids) {
		Models.SummonerSpell.find({id: { $in: ids}}, function (err, docs) {
			res.send(docs);
		});
	} else {
		res.send([]);
	}
});

module.exports.Item = routerItem;
module.exports.Champion = routerChampion;
module.exports.Spell = routerSpell;