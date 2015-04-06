var Q = require('q');
var logger = require('./logger').create('Static');
var requester;
var mongoose;

var championSchema;
var Champion;

var itemSchema;
var Item;

var summonnerSpellSchema;
var SummonerSpell;

module.exports.init = function (req, mong) {
	requester = req;
	mongoose = mong;

	championSchema = new mongoose.Schema({
		id: Number,
		name: String,
		title: String,
		image: String
	});
	itemSchema = new mongoose.Schema({
		id: Number,
		name: String,
		image: String
	});
	summonnerSpellSchema = new mongoose.Schema({
		id: Number,
		name: String,
		image: String
	});

	Champion = mongoose.model('Champion', championSchema);
	Item = mongoose.model('Item', itemSchema);
	SummonerSpell = mongoose.model('SummonerSpell', summonnerSpellSchema);

	return module.exports;
}

function fetchData(callback, type) {
	var deferred = Q.defer();
	var entriesCount = 0;
	var entriesSaved = 0;

	logger.info('Fetching static data');

	function saveEntry(entryData) {
		var image = entryData.image.full;
		entryData.image = 'http://ddragon.leagueoflegends.com/cdn/5.2.2/img/' + type + '/' + image;
		var entry = null;
		if (type === 'item') {
			entry = new Item(entryData);
		} else if (type === 'champion') {
			entry = new Champion(entryData);			
		} else {
			entry = new SummonerSpell(entryData);					
		}

		entry.save(function (err) {
			if (!err) {
				entriesSaved++;
				if (entriesSaved === entriesCount) {
					deferred.resolve();
					logger.info(entriesSaved + ' ' + type + 's saved');
				}
			} else {
				deferred.reject(err);
			}
		});
	}

	callback()
		.then(function (res) {
			var data = JSON.parse(res).data;
			for (var key in data) {
				entriesCount++;
				saveEntry(data[key]);
			}
		})
		.catch(function (err) {
			logger.error(err);
		});

		return deferred.promise;
}

module.exports.run = function() {
	Q.all([
		Champion.remove({}).exec(),
		Item.remove({}).exec(),
		SummonerSpell.remove({}).exec()
	]).then(function () {
		return Q.all([
			fetchData(requester.getChampionsInfo, 'champion'),
			fetchData(requester.getItemsInfo, 'item'),
			fetchData(requester.getSummonerSpellsInfo, 'spell')
		]);
	}).then(function () {
		mongoose.disconnect();
	});
}