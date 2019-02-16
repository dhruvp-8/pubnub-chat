let chat;

ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-d5ff1d1c-58a0-4d35-9316-5fc427aec439',
    subscribeKey: 'sub-c-032a4f30-2e9e-11e9-929a-9a812f696210'
});


var $username = $('#username');
var $color = $('#color');
var $temp = $("#temp");
var $chatArea = $("#chatArea").hide();
var $error = $("#error").hide();
var $error_msg = $("#error_msg");
var $loader = $("#loader").hide();
var $ft = $("#ft");
var fin_img = ''

const hasWhiteSpace = (s) => {
  return s.indexOf(' ') >= 0;
}


const appendMessage = (username, text) => {

  let message =
    $(`<div class="list-group-item" />`)
      .append($('<strong>').text(username + ': '))
      .append($('<span>').text(text));

  $('#log').append(message);

  $("#log").animate({ scrollTop: $('#log').prop("scrollHeight") }, "slow");

};

const appendChat = (username, text, color, img) => {
	var time = DisplayCurrentTime();
	if(text.includes("/gif")){
		var sp = text.split(" ");
		if(username != $username.val()){
			let message = $(`<div class="chip left" style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<div class="issuu-embed-container"><iframe src='+ sp[1] +' frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><br>')
			$('#messages').append(message).append('<br><div class="le">Received <i class="fas fa-check"></i> '+ time + '</div>');
			$("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight") }, "slow");
			$temp.hide();
		}
		else {
			let message = $(`<div class="chip right" style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<div class="issuu-embed-container"><iframe src='+ sp[1] +' frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><br>')
			$('#messages').append(message).append('<br><div class="ri">Sent <i class="fas fa-check"></i> '+ time + '</div>');
			$("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight") }, "slow");
			$temp.hide();
		}
	}
	else if(text.includes("/spotify")) {
		var sp = text.split(" ");
		if(username != $username.val()){
			let message = $(`<div class="chip left" style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<iframe class="iframe-class" src="' + sp[1] + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>')
			$('#messages').append(message).append('<br><div class="le">Received <i class="fas fa-check"></i> '+ time + '</div>');
			$("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight") }, "slow");
			$loader.hide();
		}
		else {
			let message = $(`<div class="chip right" style="color: black; background-color: #eee;" />`)
			.append('<img src="'+ img +'" alt="Contact Person">')
			.append('<strong>'+ username + ': </strong><br>')
			.append('<iframe class="iframe-class" src="' + sp[1] + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>')
			$('#messages').append(message).append('<br><div class="ri">Sent <i class="fas fa-check"></i> '+ time + '</div>');
			$("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight") }, "slow");
			$loader.hide();
		}
	}
	else {
		if(username != $username.val()){
			let message = $(`<div class="chip left" style="color: white; background-color: `+ color +`;" />`)
				.append('<img src="'+ img +'" alt="Contact Person">')
		      	.append($('<strong>').text(username + ': '))
		      	.append($('<span>').text(text))
		      	.append('<br>');
		    $('#messages').append(message).append('<br><div class="le">Received <i class="fas fa-check"></i> '+ time + '</div>');
			$("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight") }, "slow");
		}
		else {
			let message = $(`<div class="chip right" style="color: white; background-color: `+ color +`;" />`)
				.append('<img src="'+ img +'" alt="Contact Person">')
		      	.append($('<strong>').text(username + ': '))
		      	.append($('<span>').text(text))
		      	.append('<br>');

		    $('#messages').append(message).append('<br><div class="ri">Sent <i class="fas fa-check"></i> '+ time + '</div>');
			$("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight") }, "slow");
		}

	}
	$('.toast-body').html('New message received from ' + username);
	 	$('.toast').toast({
			"animation": true,
			"autohide": true,
			"delay": 4000
	  	});
		$('.toast').toast('show');
};


const showOnlineUsers = (data) => {
	let users =
	$(`<div class="list-group-item" id="`+ data.user.uuid +`" style="color: white; background-color: `+ data.user.state.color +`;" />`)
 		.append($('<strong>').text(data.user.uuid))

	$('#users').append(users);

	$("#users").animate({ scrollTop: $('#users').prop("scrollHeight") }, "slow");

}


const createChatRoom = () => {
	$chatArea.show();
	$ft.hide();
	ChatEngine.on('$.ready', (data) => {

	    let me = data.me;

	    chat = new ChatEngine.Chat('new-chat');

	    chat.on('$.connected', (payload) => {
	      	$('.toast-body').html('You are now connected to the chat room.');
	     	$('.toast').toast({
				"animation": true,
				"autohide": true,
				"delay": 4000
		  	});
			$('.toast').toast('show');
			chat.search({
		        reverse: false,
		        event: 'message',
		        limit: 10
		    }).on('message', (data) => {
		        // when messages are returned, log them like normal messages
		        appendChat(data.sender.uuid, data.data.text, data.data.color, data.data.img);
		    });
			showOnlineUsers();
	    });

	    chat.on('$.online.here', (payload) => {
	      appendMessage('Rejoined', payload.user.uuid + ' has rejoined the chat room!');
	    });

	    chat.on('$.online.join', (payload) => {
	      appendMessage('New User', payload.user.uuid + ', joined the chat room!');
	      showOnlineUsers(payload);
	    });

	    chat.on('$.online.*', (payload) => {
		    //showOnlineUsers(payload);
		});

	    chat.on('message', (payload) => {
	    	console.log(payload.data.img)
	      appendChat(payload.sender.uuid, payload.data.text, payload.data.color, payload.data.img);
	    });

	    chat.on('leave', () => {
	    	
	    })

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


const storeUsername = () => {
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

const sendMsg = (btn) => {
	chat.emit('message', {
        text: '/gif ' + btn.id,
        color: $("#color").val(),
        img: fin_img
  });
  $("#message").val('');
}

const sendSong = (song) => {
	chat.emit('message', {
        text: '/spotify ' + song,
        color: $("#color").val(),
        img: fin_img
  });
  $("#message").val('');
}

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
	if(urls.length != 0){
		console.log(urls);
		var html = '';

		for(var i=0; i < urls.length; i++){
			html += `<div class="card text-center"><div class="card-body"><div class="col-md-12"><div class="issuu-embed-container"><iframe src=`+ urls[i] +` frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><br><button id="`+ urls[i] +`" class="btn btn-warning" onclick="sendMsg(this);"> Send this GIF</button></div></div></div>`
		}

		$temp.html(html);
	}
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

const getSongs = () => {
	var song;
	$loader.show();
	$.ajax({
		url: '/token',
		type: 'get',
		success: function(res){
			//console.log("Hello")
			//x = JSON.parse(err.responseText)
			console.log(res.access_token);
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