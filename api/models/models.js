var mongoose = require('mongoose');

var championSchema = new mongoose.Schema({
	id: Number,
	name: String,
	title: String,
	image: String
});

var itemSchema = new mongoose.Schema({
	id: Number,
	name: String,
	image: String
});

var summonnerSpellSchema = new mongoose.Schema({
	id: Number,
	name: String,
	image: String
});

globalSchema = new mongoose.Schema({}, { strict: false });

var Champion = mongoose.model('Champion', championSchema);
var Item = mongoose.model('Item', itemSchema);
var SummonerSpell = mongoose.model('SummonerSpell', summonnerSpellSchema);
var Global = mongoose.model('Global', globalSchema);

module.exports.Champion = Champion;
module.exports.Item = Item;
module.exports.SummonerSpell = SummonerSpell;
module.exports.Global = Global;