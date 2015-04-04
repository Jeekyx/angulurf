
function Logger(name) {
	this.name = name;
}

Logger.prototype.debug = function(msg) {
	console.log('[' + this.name + '][Debug] ' + msg);
}

Logger.prototype.error = function(msg) {
	console.log('[' + this.name + '][Error] ' + msg);
}

function debug(msg) {
	console.log(msg);
}

module.exports.create = function (name) {
	return new Logger(name);
}