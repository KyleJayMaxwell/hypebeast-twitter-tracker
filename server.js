var debug = require('debug')('sockettest:server');
var http = require('http');
var port = '3000';
var app = require('./app');
var Twitter = require('twitter');
var config = require('./_config');


var server = app.listen(3000, function () {
  console.log('The server is listening on port 3000');
});


var io = require('socket.io').listen(server);

if (process.env.NODE_ENV === 'production') {
  var client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  });
} else {
  var client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
  });
}

var mentions = '@Supreme_NYC, @PALACELONDON, @BAPEOFFICIAL, @COMMEGARCONS, @HYPEBEAST, @highsnobiety';

client.stream('statuses/filter', {track: mentions}, function(stream) {
  stream.on('data', function(tweet) {
    io.emit('newTweet', tweet);
  });
  stream.on('error', function(error) {
    throw error;
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
