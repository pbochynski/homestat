var ds18b20 = require('ds18b20');
var RADIATOR = '28-031467bacdff';
var ROOM = '28-0115621a55ff';
var heat = require('./heat');
var request = require('request');
var sensors = {ROOM:22.7, RADIATOR:47.2};
var host = 'http://localhost:3000';

ds18b20.sensors(function (err, ids) {
  if (err) {
    console.error(err);
    return;
  }
  ids.forEach(function (id) {
      setInterval(function () {
        readTemp(id);
      }, 10000);
    }
  );
});

function getDate() {
  return new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after
}

function readTemp(id) {
  ds18b20.temperature(id, function (err, value) {
    console.log(getDate() + ' ' + id + ': ', value);
  });
}

function regulator() {
  request.get(host+'/stat', {}, function (err, resp, body) {
    if (err) return;
    var stat = JSON.parse(body);
    if (stat.regulator.enabled) {
      if (sensors[ROOM] > stat.regulator.temperature + stat.regulator.deviation) {
        heat.off();
        console.log(getDate() + ': Heat Off');
      }
      if (sensors[ROOM] < stat.regulator.temperature - stat.regulator.deviation) {
        heat.on();
        console.log(getDate() + ': Heat On');
      }
    } else {
      if (stat.heater.enabled) {
        heat.on();
      } else {
        heat.off();
      }
    }
  });
}

function sendSensors() {
  var array = [];
  for (var key in sensors) {
    if (sensors.hasOwnProperty(key)) {
      array.push({id: key, value: sensors[key]});
    }
  }
  request.post(host+'/sensors', {json: array}, function (err, resp) {
    if (err) {
      return console.error(err);
    }
    if (resp.statusCode !== 200) {
      return console.error("Sensors not send. Response code %s", resp.statusCode);
    }
  })

}


setInterval(regulator, 1000);

setInterval(sendSensors, 1000);

