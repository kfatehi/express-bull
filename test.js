var redis = require('redis');
var express = require('express');
var expressBull = require('./');

var app = express();

app.use('/jobs', expressBull({
  router: express.Router(),
  redisClient: redis.createClient()
}))

require('http').Server(app).listen(1337)
