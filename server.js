// Importing express for the reading the requests sent from client
var express = require('express');
// Creating express instance
var app = express();
var path = require('path');

// Logging the server logs
var morgan = require('morgan');
// Parse JSON 
var bodyParser = require('body-parser')

// Bypass Cross Origin Scripting 
var cors = require('cors');
var request = require('request');


// Spotify Client ID and Client Secret
var client_id = '0a4af3d6f09f47ffb419470c92bcf305';
var client_secret = 'ce247d6dea0549009d59e85a08fe275b';

// Port on which the server runs
var port = process.env.PORT || 5000;

// Set Up the header for request to spotify
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

// Initialize Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/'));

// Route for root
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Route for /token sent from client via AJAX call
app.get('/token', function(req, res){
	request.post(authOptions, function(error, response, body) {
	  if (!error && response.statusCode === 200) {

	    // use the access token to access the Spotify Web API
	    var token = body.access_token;

      // Send the access token
	    res.json({'access_token': token});
	  }
	});
});

// Listen the app on port 5000
app.listen(port, function(){
    console.log('Server running at port ' + port);
});