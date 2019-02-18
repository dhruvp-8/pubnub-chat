let chat;

// Create the ChatEngine Instance
ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-d5ff1d1c-58a0-4d35-9316-5fc427aec439',
    subscribeKey: 'sub-c-032a4f30-2e9e-11e9-929a-9a812f696210'
});

// Global Variable Declaration
var $username = $('#username');
var $color = $('#color');
var $temp = $("#temp");
var $chatArea = $("#chatArea").hide();
var $error = $("#error").hide();
var $error_msg = $("#error_msg");
var $loader = $("#loader").hide();
var $ft = $("#ft");
var fin_img = ''
var timestamp; 


// Remove WhiteSpace from a string
const hasWhiteSpace = (s) => {
  return s.indexOf(' ') >= 0;
}

// Append Message to Chat Window
const appendMessage = (username, text) => {

  let message =
    $(`<div class="list-group-item" />`)
      .append($('<strong>').text(username + ': '))
      .append($('<span>').text(text));

  $('#log').append(message);
  $("#log").animate({ scrollTop: $('#log').prop("scrollHeight") }, "slow");

};

// Append Spotify and Giphy Card to Chat Window
const appendChat = (username, text, color, img) => {
	var time = DisplayCurrentTime();

	// Get time and set it as unique id for window.location, basically to scroll to that position
	var timestamp = Math.round(new Date() / 1000);

	//Check if the text contains /gif parameter
	if(text.includes("/gif")){
		var sp = text.split(" ");

		// Prevent notifications from showing to the sender
		if(username != $username.val()){
			let message = $(`<div class="chip left" id=`+ timestamp +` style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<div class="issuu-embed-container"><iframe src='+ sp[1] +' frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><br>')
			$('#messages').append(message).append('<br><div class="le">Received <i class="fas fa-check"></i> '+ time + '</div>');
			$temp.hide();
		}
		else {
			let message = $(`<div class="chip right" id=`+ timestamp +` style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<div class="issuu-embed-container"><iframe src='+ sp[1] +' frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><br>')
			$('#messages').append(message).append('<br><div class="ri">Sent <i class="fas fa-check"></i> '+ time + '</div>');
			$temp.hide();
		}
	}
	//Check if the text contains /spotify parameter
	else if(text.includes("/spotify")) {
		var sp = text.split(" ");
		if(username != $username.val()){
			let message = $(`<div class="chip left" id=`+ timestamp +` style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<iframe class="iframe-class" src="' + sp[1] + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>')
			$('#messages').append(message).append('<br><div class="le">Received <i class="fas fa-check"></i> '+ time + '</div>');
			$loader.hide();
		}
		else {
			let message = $(`<div class="chip right" id=`+ timestamp +` style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<iframe class="iframe-class" src="' + sp[1] + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>')
			$('#messages').append(message).append('<br><div class="ri">Sent <i class="fas fa-check"></i> '+ time + '</div>');
			$loader.hide();
		}
	}
	// Direct Message
	else {
		if(username != $username.val()){
			let message = $(`<div class="chip left" id=`+ timestamp +` style="color: white; background-color: `+ color +`;" />`)
				.append('<img src="'+ img +'" alt="Contact Person">')
		      	.append($('<strong>').text(username + ': '))
		      	.append($('<span>').text(text))
		      	.append('<br>');
		    $('#messages').append(message).append('<br><div class="le">Received <i class="fas fa-check"></i> '+ time + '</div>');
		}
		else {
			let message = $(`<div class="chip right" id=`+ timestamp +` style="color: white; background-color: `+ color +`;" />`)
				.append('<img src="'+ img +'" alt="Contact Person">')
		      	.append($('<strong>').text(username + ': '))
		      	.append($('<span>').text(text))
		      	.append('<br>');

		    $('#messages').append(message).append('<br><div class="ri">Sent <i class="fas fa-check"></i> '+ time + '</div>');
		}

	}

	// Notification Toast 
	$('.toast-body').html('New message received from ' + username);
	 	$('.toast').toast({
			"animation": true,
			"autohide": true,
			"delay": 4000
	  	});
		$('.toast').toast('show');

	// Scroll to the latest message in the Chat
	var ks = "#" + timestamp 
	window.location = ks;
};


// Show the online users
const showOnlineUsers = (data) => {
	let users =
	$(`<div class="list-group-item" id="`+ data.user.uuid +`" style="color: white; background-color: `+ data.user.state.color +`;" />`)
 		.append($('<strong>').text(data.user.uuid))

	$('#users').append(users);

	$("#users").animate({ scrollTop: $('#users').prop("scrollHeight") }, "slow");

}

// Create a random chat room for chatting
const createChatRoom = () => {
	// Display Chat Area
	$chatArea.show();
	$ft.hide();

	// Initiate the Chat Engine
	ChatEngine.on('$.ready', (data) => {

	    let me = data.me;

	    // New chat room instance 
	    chat = new ChatEngine.Chat('new-chat');

	    chat.on('$.connected', (payload) => {
	    	// Notification for successful connection
	      	$('.toast-body').html('You are now connected to the chat room.');
	     	$('.toast').toast({
				"animation": true,
				"autohide": true,
				"delay": 4000
		  	});
			$('.toast').toast('show');

			// Display the message history and limit to last 10 messages
			chat.search({
		        reverse: false,
		        event: 'message',
		        limit: 10
		    }).on('message', (data) => {
		        // when messages are returned, log them like normal messages
		        appendChat(data.sender.uuid, data.data.text, data.data.color, data.data.img);
		    });

		    // Show Online Users
			showOnlineUsers();
	    });

	    // Rejoined Chat Users
	    chat.on('$.online.here', (payload) => {
	      appendMessage('Rejoined', payload.user.uuid + ' has rejoined the chat room!');
	    });

	    // New User joined 
	    chat.on('$.online.join', (payload) => {
	      appendMessage('New User', payload.user.uuid + ', joined the chat room!');
	      showOnlineUsers(payload);
	    });

	    // Receive the emitted message and call appendChat to display it in Chat Window
	    chat.on('message', (payload) => {
	    	console.log(payload.data.img)
	      appendChat(payload.sender.uuid, payload.data.text, payload.data.color, payload.data.img);
	    });

	    // Leave the Chat
	    chat.on('leave', () => {
	    	
	    })


	    // When the user hits enters after typing the message
	    $("#message").keypress(function(event) {
	      if (event.which == 13) {
	      	if ($('#message').val() != ''){
	      		chat.emit('message', {
	                text: $('#message').val(),
	                color: $("#color").val(),
	                img: fin_img
	          });
	          $("#message").val('');
	          event.preventDefault();
	      	}
	      	else {
	      		$('.toast-body').html('You have not entered any content in the message box.');
		     	$('.toast').toast({
					"animation": true,
					"autohide": true,
					"delay": 4000
			  	});
				$('.toast').toast('show');
	      	}
	      }
	    });

	});
}


// Leave the chat room
const leaveChatRoom = () => {
	chat.on('$.offline.leave', (payload) => {
		appendMessage('Left', payload.user.uuid + 'has left the room');
	    	$("#users").find("#" + payload.user.uuid).remove();
	});

	chat.on('$.offline.*', (payload) => {
		appendMessage('Left', payload.user.uuid + 'has left the room');
	    	$("#users").find("#" + payload.user.uuid).remove();
	});

	chat.leave();
	$('.toast-body').html('You will now not receive any messages from this chat room.');
 	$('.toast').toast({
		"animation": true,
		"autohide": true,
		"delay": 4000
  	});
	$('.toast').toast('show');
}

// Store the Username and pass it to the chat engines's connect method
const storeUsername = () => {
	if($color.val() != "#ffffff"){
		if($username.val() != ''){
			if(!hasWhiteSpace($username.val())){
				$error.hide();
				var num = Math.floor((Math.random() * 6) + 1)
			    fin_img = "./images/" + num.toString() + ".png";
			    document.getElementById('img-log').src = fin_img;
				console.log(fin_img)
				console.log($color.val());
				let me = ChatEngine.connect($username.val(), {'color': $color.val(), 'img': fin_img});

				ChatEngine.on('$.ready', (data) => {
				    let me = data.me;
				});
				var $userFormArea = $('#userFormArea')
				$userFormArea.hide();
				createChatRoom();
			}
			else {
				$error_msg.html("Please enter username without spaces.");
				$error.show();
			}
		}
		else {
			$error_msg.html("Please fill all the fields inorder to continue.");
			$error.show();
		}
	}
	else {
		$error_msg.html("Please select a color other than white.");
		$error.show();
	}
}

// Method invoked when Send GIF button is pressed
const sendMsg = (btn) => {
	chat.emit('message', {
        text: '/gif ' + btn.id,
        color: $("#color").val(),
        img: fin_img
  });
  $("#message").val('');
}

// Method invoked when Send Song button is pressed
const sendSong = (song) => {
	chat.emit('message', {
        text: '/spotify ' + song,
        color: $("#color").val(),
        img: fin_img
  });
  $("#message").val('');
}

// Convert time from seconds to hh:mm a/p format
const DisplayCurrentTime = () => {
    var date = new Date();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    //var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = hours + ":" + minutes + " " + am_pm;
    return time;
}

// AJAX Call to get the GIFs from the Giphy API
const getGifs = () => {
	var obj;
	 $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?api_key=lJyjICvnIIQNVeGDq2MiLKoSBCnza69D&limit=4&q=" + $('#message').val(),
        type: "GET",
        cache: false,
        timeout: 5000,
        async: false,
        success: function(data) {
          	console.log(data)
          	obj = data
        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connected.\n Verify Network.';
            }
            else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            }
            else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            }
            else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            }
            else if (exception === 'timeout') {
                msg = 'Time out error.';
            }
            else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            }
            else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        }
      });

	var urls = [];
	console.log(obj)
	for(var i=0; i < obj.data.length; i++){
		urls.push(obj.data[i].embed_url)
	}
	// Displaying the GIFs only if they are available
	if(urls.length != 0){
		console.log(urls);
		var html = '';
		html += `<div class="row">`
		for(var i=0; i < urls.length; i++){
			html += `<div class="col-md-6"><div class="card text-center"><div class="card-body"><div class="col-md-10"><div class="issuu-embed-container"><iframe src=`+ urls[i] +` frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><br><button id="`+ urls[i] +`" class="btn btn-block btn-success" onclick="sendMsg(this);"> Send this GIF</button></div></div></div></div>`
		}
		html += `</div>`
		$temp.html(html);
		$temp.show();
		window.location = "#temp"
	}
	// Showing the notification of their unavailabity
	else {
		$('.toast-body').html('No GIFS found. Please search for something else.');
	 	$('.toast').toast({
			"animation": true,
			"autohide": true,
			"delay": 4000
	  	});
		$('.toast').toast('show');
	}
}

// Convert the data to x-www-form-urlencode format
const JSON_to_URLEncoded = (element,key,list) => {
	var list = list || [];
	if(typeof(element)=='object'){
	  	for (var idx in element)
	      	JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
	} else {
	    list.push(key +'='+ encodeURIComponent(element));
	  }
	  return list.join('&');
}

// Get Songs from the Spotify API
const getSongs = () => {
	var song;
	$loader.show();

	// AJAX Call to do basic authentication and getting the access token
	$.ajax({
		url: '/token', // This request goes to the backend server running on Node.js
		type: 'get',
		success: function(res){
			console.log(res.access_token);

			// Make the call to search API using this authentication token
			$.ajax({
				url: 'https://api.spotify.com/v1/search?limit=10' + '&q='+ $('#message').val() + '&type=track',
				dataType: 'json',
				type: 'get',
				headers: {
					'Accept': '*',
        			'Content-Type': 'application/json',
        			'Authorization': "Bearer " + res.access_token
            	},
				success: function(res){
					song = res.tracks;
					console.log(res.tracks)
					console.log("Ok", song.items)
					if(song.items.length != 0){
						var x = song.items[0].external_urls.spotify
						var m = x.slice(0,24)
						var j = x.slice(25, x.length)
						var fin = m + "/embed/" + j
						console.log(fin)
						sendSong(fin)
					}
					else {
						$('.toast-body').html('No Songs found. Please search for something else.');
					 	$('.toast').toast({
							"animation": true,
							"autohide": true,
							"delay": 4000
					  	});
						$('.toast').toast('show');
					}
				},
				error: function(err){
					console.log(err)			
				}
			});
		},
		error: function(err){

		}
	});
	
}