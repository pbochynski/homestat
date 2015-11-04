var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var HEATER={enabled:true};
var REGULATOR={enabled: true, temperature:22.7, deviation:0.7};
var SENSORS = [{dummy: 20}];

app.use(express.static(__dirname + '/dist'));
//app.use(express.static(__dirname + '/app'));
//app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

function random(n) {
  return Math.floor((Math.random() * n) + 1);
}

function randomSensors() {
  var sensors = []
  for (var i=0; i<5; ++i) {
      sensors.push( { id : 'id-'+random(1000), value: (Math.random() * 10) + 18.0});
  }
  return sensors;
}

app.get('/stat', function (req,res){
  res.json({regulator:REGULATOR, heater:HEATER, sensors:SENSORS});
});

app.put('/heater', function (req,res){
  HEATER = req.body;
  res.send();
});
app.put('/regulator', function (req,res){
  REGULATOR = req.body;
  res.send();
});

app.post('/sensors', function (req,res){
  SENSORS = req.body;
  res.send();
});


var PORT = process.env.VCAP_APP_PORT || 3000;
app.listen(PORT,function() {
  console.log('Express server listening on port ' + PORT);
} );
