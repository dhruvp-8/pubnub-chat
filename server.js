var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser')
var cors = require('cors');
var request = require('request');



var client_id = '0a4af3d6f09f47ffb419470c92bcf305';
var client_secret = 'ce247d6dea0549009d59e85a08fe275b';

var port = process.env.PORT || 5000;

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

app.use(cors())
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/'));

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/token', function(req, res){
	request.post(authOptions, function(error, response, body) {
	  if (!error && response.statusCode === 200) {

	    // use the access token to access the Spotify Web API
	    var token = body.access_token;
	    res.json({'access_token': token});
	  }
	});
});


app.listen(port, function(){
    console.log('Server running at port ' + port);
});