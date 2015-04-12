var mongoose = require('mongoose');
var MONGO_URI = 'mongodb://localhost/urf';

var gameSchema;
var UrfGame;

var globalSchema;
var Global;

var LEAGUES = [
	'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger'
];

// Object containing all the data for each league
var global = {
	
};


/*
 * Compute the average (mean) value.
 * avg: the current average value
 * value: the number to add to the average
 * count: the total numbers of the average
 */
function average(avg, value, count) {
	return (avg + (value / count)) / ((count + 1) / count);
}

/*
 * Return the array element containing the given id if it exists, otherwise null.
 */
function getItem(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].id === value) {
			return array[i];
		}
	}
	return null;
}

// Initialize the results for each league
function initializeItems() {
	LEAGUES.forEach(function (item) {
		// Assigning some initial values to the average
		// Allows us to avoid an if case in case it's 0 in every loop
		global[item] = {
			total: 0,
			matchDurationAvg: 2500,
			champions: {
				picks: [],
				bans: []
			},
			stats: {
				kills: 0,
				double: 0,
				triple: 0,
				quadra: 0,
				penta: 0,
				damageToChampAvg: 33000,
				totalDamageAvg: 160000,
				goldEarnedAvg: 18000
			},
			// We need accurate data here so we start at 0
			timeline: {
				firstblood: 0,
				firstDragon: 10,
				firstBaron: 0,
				firstLevel6: 0
			},
			spells: [],
			items: []
		}
	});
}

/*
 * Read the data returned by the API and average/assign it to the global result.
 */
function processGlobal(game, info) {
	game.participants.forEach(function (participant) {
		var league = participant.highestAchievedSeasonTier.toLowerCase();
		var item = global[league];
		item.total++;

		// Timeline data
		item.timeline.firstblood = item.timeline.firstblood ? average(item.timeline.firstblood, info.firstblood, item.total) : info.firstblood;
		item.timeline.firstDragon = item.timeline.firstDragon ? average(item.timeline.firstDragon, info.drake, item.total) : info.drake;
		item.timeline.firstBaron = item.timeline.firstBaron ? average(item.timeline.firstBaron, info.baron, item.total) : info.baron;
		item.timeline.firstLevel6 = item.timeline.firstLevel6 ? average(item.timeline.firstLevel6, info.lvl6, item.total) : info.lvl6;

		// Basic stats
		item.matchDurationAvg = average(item.matchDurationAvg, game.matchDuration, item.total);
		item.stats.damageToChampAvg = average(item.stats.damageToChampAvg, participant.stats.totalDamageDealtToChampions, item.total);
		item.stats.totalDamageAvg = average(item.stats.totalDamageAvg, participant.stats.totalDamageDealt, item.total);
		item.stats.goldEarnedAvg = average(item.stats.goldEarnedAvg, participant.stats.goldEarned, item.total);
		item.stats.kills += participant.stats.kills;
		item.stats.double += participant.stats.doubleKills;
		item.stats.triple += participant.stats.tripleKills;
		item.stats.quadra += participant.stats.quadraKills;
		item.stats.penta += participant.stats.pentaKills;
		
		// Summoner spells
		var spellObj = getItem(item.spells, participant.spell1Id);
		spellObj ? spellObj.count++ : item.spells.push({id: participant.spell1Id, count: 1});
		spellObj = getItem(item.spells, participant.spell2Id);
		spellObj ? spellObj.count++ : item.spells.push({id: participant.spell2Id, count: 1});

		// Items
		// item[0-5]: normal slots
		// item6    : special slot (not used here)
		for (var i = 0; i < 6; i++) {
			var itemId = participant.stats['item' + i];
			// There is an item on this slot
			if (itemId) {
					var itemObj = getItem(item.items, itemId);
					itemObj ? itemObj.count++ : item.items.push({id: itemId, count: 1});
			}
		}

		// Champion picks
		var pickObj = getItem(item.champions.picks, participant.championId);
		pickObj ? pickObj.count++ : item.champions.picks.push({id: participant.championId, count: 1});

		// Champion bans
		game.teams.forEach(function (team) {
			// Sometimes there are no bans (first pick was afk)
			if (team.bans) {
				team.bans.forEach(function (ban) {
					var banObj = getItem(item.champions.bans, ban.championId);
					banObj ? banObj.count++ : item.champions.bans.push({id: ban.championId, count: 1});
				});
			}
		});
	});
}

/*
 * Read the timeline data from the API and return an object
 * containing the timestamp of the first blood/drake/baron/lvl6
 */
function processTimeline(game) {
	var length = game.timeline.frames.length;
	var result = {
		firstblood: 0,
		drake: 0,
		baron: 0,
		lvl6: 0
	}
	
	// We retrieved all the data we wanted for the events
	function eventsProcessed () {
		return result.firstblood && result.drake && result.baron;
	}

	// Loop through all the frames in chronological order
	for (var i = 0; i < length; i++) {
		// Events data
		var events = game.timeline.frames[i].events;
		if (!eventsProcessed() && events) {
			for (var j = 0; j < events.length; j++) {
				var event = events[j];
				if (!result.firstblood && event.eventType === 'CHAMPION_KILL') {
					result.firstblood = Math.round(event.timestamp / 1000);
				} else if (event.eventType === 'ELITE_MONSTER_KILL') {
					if (!result.drake && event.monsterType === 'DRAGON') {
						result.drake = Math.round(event.timestamp / 1000);
					} else if (!result.baron && event.monsterType === 'BARON_NASHOR') {
						result.baron = Math.round(event.timestamp / 1000);
					}
				}
			}
		}

		// Participant frames data
		var participantFrames = game.timeline.frames[i].participantFrames;
		if (!result.lvl6 && participantFrames) {
			for (var key in participantFrames) {
				var participantFrame = participantFrames[key];
				if (participantFrame.level === 6) {
					// Frames are registered each 60 seconds
					result.lvl6 = Math.round(key * 60);
				}
			}
		}
	}

	return result;
}

function run() {
	// Total games
	var total = 0;
	// Games processed
	var processed = 0;

	initializeItems();
	
	gameSchema = new mongoose.Schema({}, { strict: false });
	UrfGame = mongoose.model('UrfGame', gameSchema);

	globalSchema = new mongoose.Schema({}, { strict: false });
	Global = mongoose.model('Global', globalSchema);
	
	
	UrfGame.count({}, function (err, count) {
		var chunk = Math.round(count / 20);
		total = count;
		console.log('Found ' + total + ' games');

		var stream = UrfGame.find({}).lean().stream();
		// Process each game
		stream.on('data', function (game) {
			processed++;
			// Diplay a console message each 5% of the process
			if (processed % chunk === 0) {
				console.log(processed + '/' + total + ' (' + Math.round((processed/total) * 100) + '%)');
			}

			// Timeline info
			var info = processTimeline(game);
			// Global info
			processGlobal(game, info);
		});
		
		// Process over, store the result
		stream.on('end', function (err, data) {
			setTimeout(function () {
				var entry = new Global(global);
				entry.save(function (err) {
					if (err) {
						console.error(err);
					} else {
						console.log('Result saved');
					}
				mongoose.disconnect();
				});
			}, 2000);
		});
	});
	

}

mongoose.connect(MONGO_URI, function(err) {
	if (!err) {
		console.log('Connected to ' + MONGO_URI);
		run();
	} else {
		console.error('Could not connect to ' + MONGO_URI);
	}
});