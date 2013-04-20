
	var colors = ["red", "green", "blue", "orange", "cyan", "magenta", "yellow", "lime", "maroon", "olive", "pink", "teal"];

	window.WebSocket = window.WebSocket || window.MozWebSocket;

	var connection = new WebSocket('ws://10.10.0.42:31415');

	connection.onopen = function () {
		// connection is opened and ready to use
	};

	connection.onerror = function (error) {
		// an error occurred when sending/receiving data
	};

	connection.onmessage = function (message) {
		// try to decode json (I assume that each message from server is json)
		
		console.log( message );
		try {
			var json = JSON.parse(message.data);
		} catch (e) {
			console.log('This doesn\'t look like a valid JSON: ', message.data);
			return;
		}
	};
	
	var chatMessagesContainer = null;
	
	var ctx = null;
	
	var posX, posY;
	
	var addMessageToChatWindow = function( msg )
	{
		var newChatMessage = document.createElement( "div" );
		newChatMessage.className = "chatMessage";
		
		newChatMessage.appendChild( document.createTextNode( msg ) );
		
		chatMessagesContainer.appendChild( newChatMessage );
		
		chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
	}
	
	var initChat = function( args )
	{
		var chatInput = null,
			chatSendButton = null;
		
		var chatRefreshTimer = null;
		
		var MESSAGE_PER_SECOND_LIMIT = 4;
		var messagesSent = 0;
		
		var lastMessageId = 0;
		
		var startHeartbeat = function()
		{
			var sendPulse = function()
			{
				kat.sendAJAX({
								method: "POST",
								address: "resources/php/still_alive.php",
								data: {
										gameId: _global_gameId
									},
								callback: function( xmlhttp )
								{/*
									if( xmlhttp.responseText != "1" )
									{
										alert( "heartbeat died" );
										return;
									}
									*/
									sendPulse();
								}
							});
			}
			
			sendPulse();
			setTimeout( sendPulse, 5000 );
		}
		
		var sendData = function()
		{
			if( messagesSent > MESSAGE_PER_SECOND_LIMIT )
			{
				return;
			}
			
			var message = chatInput.value.trim();
			chatInput.value = "";
			
			if( message == "" )
			{
				return;
			}
			
			messagesSent++;
			
			
			
			kat.sendAJAX({
							method: "POST",
							address: "resources/php/save_chat_message.php",
							data:{
									gameId: _global_gameId,
									message: message
								},
							callback: function( xmlhttp )
							{
								var res = kat.commonJSONResponseProcessing( xmlhttp );
								if( !res )
								{
									return;
								}
								
								if( res.rc == "0" )
								{
									alert( res.em );
									
									//todo treat exceptions
									
									return;
								}
							}
						});
		}
		
		//start
		chatMessagesContainer = kat.getElm( "chatMessagesContainer" );
		chatInput = kat.getElm( "chatInput" );
		chatSendButton = kat.getElm( "chatSendButton" );
		
		kat.setActiveOnEnter({
								elm: chatInput,
								fct: sendData
							});
							
		kat.addEvent({ 
						elm: chatSendButton,
						event: "click",
						fct: sendData
					});
		
		kat.sendAJAX({
						method: "POST",
						address: "resources/php/get_last_message_id.php",
						data: {
								gameId: _global_gameId
							},
						callback: function( xmlhttp )
						{
							var res = kat.commonJSONResponseProcessing( xmlhttp );
							if( !res )
							{
								return;
							}
							
							if( res.rc == "0" )
							{
								alert( res.em );
								
								//todo treat exceptions
								
								return;
							}
							
							if( res.rows[0].cl_id )
							{
								lastMessageId = res.rows[0].cl_id;
							}
							
							chatRefreshTimer = setInterval( function()
							{
								messagesSent = 0;
								
								kat.sendAJAX({
												method: "POST",
												address: "resources/php/get_chat_messages.php",
												data: {
														gameId: _global_gameId,
														lastMessageId: lastMessageId
													},
												callback: function( xmlhttp )
												{
													var res = kat.commonJSONResponseProcessing( xmlhttp );
													if( !res )
													{
														return;
													}
													
													if( res.rc == "0" )
													{
														alert( res.em );
														
														//todo treat exceptions
														
														return;
													}
													
													if( !res.messages )
													{
														return;
													}
													
													for( var i = 0; i < res.messages.length; i++ )
													{
														addMessageToChatWindow( res.messages[i].cl_message );
													}
													
													lastMessageId = res.messages[res.messages.length - 1].cl_id;
												}
											});
							}, 1000 );
						}
					});
					
		//startHeartbeat();
	}
	
	
	var map = {
    "AIR": 0,
    "ROCK":1,
    "BEDROCK":2,
	"DIRT":3,
    "SAND":4,
    "NR_BLOCKS":5,
	"DIM_X":100,
	"DIM_Y":100,
}


	var terrain = [];

var generateTerrain= function(dimX, dimY)
{
	
	//Alocare
	for (var i = 0; i < dimY; i++) 
	{
		terrain[i] = [];
	}
	
	
	//Initializare
	for(i = 0;i<dimY;i++)
	{
		for(j = 0;j<dimX; j++)
		{
			terrain[i][j] = 0;
		}
	}
	
	//Stabilesc limita terenului
	
	var bias = 3;
	
	groundLimitY = Math.floor(5*dimY/7);
	console.log(groundLimitY);
	
	startBlock = Math.floor(Math.random()*groundLimitY);
	
	
	for(x = 0; x < dimX; x++)
	{
		while (startBlock> groundLimitY)
		{
			startBlock += Math.floor( Math.random()*bias*2)-bias;
		}
		for(y = startBlock; y<dimY ; y++)
		{
			terrain[y][x] =  map.ROCK;
		}	
	}
}
	
	var initGame = function( args )
	{
		ctx = document.getElementById('gameCanvas').getContext('2d');
		/*
		var map = [];
		for( var i = 0; i < 300; i++ )
		{
			map[i] = [];
			for( j = 0; j < 300; j++ )
			{
				map[i][j] = Math.floor( Math.random() * 4 ) + 1;
			}
		}
		*/
		var groundTiles = [];
		groundTilesToLoad = 4;
		for( var i = 1; i < 5; i++ )
		{
			groundTiles[i] = new Image();
			groundTiles[i].src = 'resources/img/' + i + '.png';
			groundTiles[i].onload = function()
			{
				groundTilesToLoad--;
				if( groundTilesToLoad == 0 )
				{
					drawMap();
				}
			};
			
		}
	
		function drawMap()
		{
			generateTerrain( 300, 200 );
			for( var y = 0; y < terrain.length; y++ )
			{
				for( var x = 0; x < terrain[y].length; x++ )
				{
					if( terrain[y][x] != 0 )
					{
						ctx.drawImage(groundTiles[terrain[y][x]],x*30,y*30);
					}
				}
			}
		}
	}