var exec = require('child_process').exec;

var ON = '1400588', OFF = '1400579';
var CODESEND = 'sudo /home/pi/433Utils/RPi_utils/codesend ';

var current = null;
function heatOn() {
  if (current !== ON) {
    codesend(ON);
    current = ON;
  }
}

function heatOff() {
  if (current !== OFF) {
    codesend(OFF);
    current = OFF;
  }
}

function codesend(code) {
	exec(CODESEND + code, function (error, stdout, stderr) {
		if (error !== null) {
			console.error('exec error: ' + error);
		}
	});
}

setInterval(function(){current=null}, 600000);

exports.on = heatOn;
exports.off = heatOff;
