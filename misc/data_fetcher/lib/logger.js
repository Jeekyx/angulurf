var fs = require('fs');
var eol = require('os').EOL;

var COLOR_RED = '\033[31m';
var COLOR_NORMAL = '\033[91m';

function time() {
	var date = new Date();
	var hour = date.getHours();
  var min  = date.getMinutes();
  var sec  = date.getSeconds();

  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  sec = (sec < 10 ? "0" : "") + sec;

	return hour + ":" + min + ":" + sec;
}

function Logger(name) {
	this.name = name;
	this.logFile = name + '-log.txt';
	fs.writeFileSync(this.logFile, '');
}

Logger.prototype.info = function(msg) {
	var str = '[' + time() + '] [' + this.name + '][Info] ' + msg;
	fs.appendFile(this.logFile, str + eol);
	console.log(str);
}

Logger.prototype.error = function(msg) {
	var str = '[' + time() + '] [' + this.name + '][Error] ' + msg;
	fs.appendFile(this.logFile, str + eol);
	console.error(str);
}

module.exports.create = function (name) {
	return new Logger(name);
}