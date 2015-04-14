var logger = require('./logger').create('Crawler');
var requester;
var mongoose;

var gameSchema;
var UrfGame;

// Fetching urf game ids
var STEP_GET_IDS = 0;
// Fetching the data of the games
var STEP_GET_DATA = 1;
var MAX_STEP = 2;
// Current step
var step = STEP_GET_IDS;
// Allow to refetch the ids if something went wrong during the request
var waitingIds = false;
// Can we still make requests ? (10 requests per 10 seconds)
var canQuery = true;
// Bucket of games
var games = [];
// Thu Apr 02 2015 00:35:00 GMT+0200 (CEST) (new starting date)
var date = 1427927700

// Starting date - Wed, 01 Apr 2015 10:45:00 GMT
//var date = 1427885100;

// Go to the next step
function nextStep() {
	// Finished saving the games in the database
	if (step === STEP_GET_DATA) {
		gameIndex = 0;
		var changeDate = !requester.changeRegion();
                games = [];
		logger.info('Changing region');
		// If we're done for this date, increment it
		if (changeDate) {
			nextDate();
		} else {
			// Else do nothing and save games in the next region
		}
	}

	step = (step + 1) % MAX_STEP;
}

// Increment date by 5 minutes
function nextDate() {
	date += 300;
	logger.info('Increment date to ' + new Date(date * 1000) + ' (' + date + ')');
}

// Save the game in the database
function saveGame(game) {
	// This data is obfuscated for normal games, hence pointless
	delete game.participantIdentities;
	// Useless for the challenge
	delete game.mapId;
	delete game.matchMode;
	delete game.matchType;
	delete game.matchVersion;
	delete game.queueType;
	delete game.season;
	for (var i = 0; i < game.participants.length; i++) {
		delete game.participants[i].masteries;
		delete game.participants[i].runes;
	}

	var entry = new UrfGame(game);
	entry.save(function (err) {
		if (!err) {
			logger.info('Stored game ' + game.matchId);
		} else {
			logger.error('Could not store game ' + game.matchId);
		}
	});
}

// Display the error or start a timeout if we exceeded the rate limit
function handleError(error) {
	if (error.statusCode) {
		// Rate limit exceeded -> wait 10 seconds
		if (error.statusCode === 429) {
			waitForRequests();
		}
	}
  else {
		logger.error(JSON.stringify(error));
	}
}

// Wait 10 seconds before we can query the API again
function waitForRequests() {
	if (canQuery) {
		logger.info('Rate limit exceeded, waiting 10 seconds ...');
		canQuery = false;
		setTimeout(function () {
			logger.info('Timeout over, resume requesting')
			canQuery = true;
		}, 10000);
	}
}

/**
 * Fetch all the URF games ids and store them.
 */
function fetchUrfsIds() {
	//console.log ('fetchUrfsIds ' + step + ' ' + waitingIds + ' ' + canQuery);
	if (step !== STEP_GET_IDS || waitingIds || !canQuery)
		return;

	waitingIds = true;

	requester.getUrfMatches(date)
		.then(function (res) {
			var gameIds = JSON.parse(res);
			logger.info('Fetched ' + gameIds.length + ' ids');
			logger.info(res);
			gameIds.forEach(function (id) {
					games.push({id: id, processing: false, processed: false});
				});
			waitingIds = false;
			// All ids have been stored, we now need to get the games data
			nextStep();
			})
		.catch(function (err) {
			// Error while fetching the ids
			// Fetch them again on the next timeout
			waitingIds = false;
			handleError(err);
		});
}

// Have all the games been processed ?
function processedAllGames() {
	for (var i = 0; i < games.length; i++) {
		if (!games[i].processed) {
			return false;
		}
	}
	return true;
}

/**
 * Fetch all the URF games data and save it in mongodb.
 */
function fetchGamesData() {
	//console.log ('fetchGamesData ' + step + ' ' + canQuery + ' ' + processedAllGames());
 	if (step !== STEP_GET_DATA || !canQuery)
 		return;

 	// No games were returned by the API form this region and date
 	if (!games.length) {
 		nextStep();
 		return;
 	}

 	function processGame(index, game) {
 		requester.getMatchInfo(game.id)
	 		.then(function (res) {
	 			var data = JSON.parse(res);
	 			saveGame(data);
	 			game.processed = true;
	 			// Done processing all games
 			 	if (processedAllGames()) {
 			 		logger.info('All games have been processed')
			 		nextStep();
			 		return;
			 	}
			})
	 		.catch(function (err) {
	 			game.processing = false;
	 			// maybe not necessary
	 			game.processed = false;
	 			handleError(err);
	 		});
 	}

 	// Don't query more than 10 matchs
 	var count = 0;
 	for (var i = 0; i < games.length; i++) {
 		if (!games[i].processing) {
 			games[i].processing = true;
 			processGame(i, games[i]);
 			count++;
 		}
 		// Processed too much games, wait for the rate limit
 		if (count > 9) {
 			waitForRequests();
 			break;
 		}
 	}
}

module.exports.init = function Crawler(req, mong) {
	requester = req;
	mongoose = mong;

	// The strict options set to false allows us to use an empty mongodb schema
	gameSchema = new mongoose.Schema({}, { strict: false });
	UrfGame = mongoose.model('UrfGame', gameSchema);

	return module.exports;
}

module.exports.run = function () {
	logger.info('Starting crawler');
	setInterval(fetchUrfsIds, 500);
	setInterval(fetchGamesData, 500);
}
