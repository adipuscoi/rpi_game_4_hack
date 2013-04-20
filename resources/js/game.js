
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
	
	var posXAstru = 0, posYAstru = 0;
	
	var dx = 0, dy = 0;
	
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
	"DIM_X":40,
	"DIM_Y":40,
	"CUBE_SIZE":30,
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
	
	groundLimitY = Math.floor(3*dimY/7);
	//console.log(groundLimitY);
	
	startBlockOld = groundLimitY + Math.floor(Math.random()*(dimY-groundLimitY-2));
	//console.log(startBlockOld);
	
		startBlock = startBlockOld + Math.floor( Math.random()*bias*2)-bias;
			
		startBlockOld = startBlock;
		
		posY = startBlockOld;
		//console.log(posY);
		
		if(startBlock > dimY-1)
			startBlock = dimY-1;
		if(startBlock < 0)
			startBlock = 0;
		
		for(y = startBlock; y<dimY ; y++)
		{
			terrain[y][0] =  map.ROCK;
		}
		terrain[startBlock][0] =  map.BEDROCK;
	
	
	for(x = 1; x < dimX; x++)
	{
		startBlock = startBlockOld + Math.floor( Math.random()*bias*2)-bias;
			
		startBlockOld = startBlock;
		//console.log(posY);
		
		if(startBlock > dimY-1)
			startBlock = dimY-1;
		if(startBlock < 0)
			startBlock = 0;
		
		for(y = startBlock; y<dimY ; y++)
		{
			terrain[y][x] =  map.ROCK;
		}
		terrain[startBlock][x] =  map.BEDROCK;
		
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
		generateTerrain( map.DIM_X, map.DIM_Y );
		for( var i = 0; i < 5; i++ )
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
			ctx.clearRect(0,0,1000,1000);
			for( var y = 0; y < terrain.length; y++ )
			{
				for( var x = 0; x < terrain[y].length; x++ )
				{
					//if( terrain[y][x] != 0 )
					//{
						ctx.drawImage(groundTiles[terrain[y][x]], dx+x*map.CUBE_SIZE, dy+y*map.CUBE_SIZE);						
						
					//}
				}
			}
			ctx.drawImage(groundTiles[4],dx, dy+(posY-1)*map.CUBE_SIZE);
			ctx.drawImage(groundTiles[4],dx, dy+(posY-2)*map.CUBE_SIZE);			
		}
		
		//Events for canvas		
		gameCanvas = document.getElementById("gameCanvas");
		mouseCoord = document.getElementById("mouseCoord");
		mapContainer = document.getElementById("mapContainer");
		
		var canvasHeight = gameCanvas.getAttribute("height");
		var canvasWidth = gameCanvas.getAttribute("width");
		
		var timer;
		var timerSet = false;
		setTimerForMovement = function(e)
		{
			if( timerSet )
			{
				return;
			}
			console.log("set");
			if( timer != null )
			{
				clearInterval(timer);
			}
			var opt = 0;
			switch(e.keyCode)
			{
				
				case 87://w
					opt = 1;
					break;
				case 65://a
					opt = 2;
					break;
				case 68://d
					opt = 3;
					break;
				case 83://s
					opt = 4;
					break;		
			}
			moveCanvas( opt );
			timer = setInterval(function()
			{
				moveCanvas( opt );
			}, 10);
			timerSet = true;
		}
		
		clearTimerForMovement = function(e)
		{
			console.log("clear");
			clearInterval(timer);
			timer = null;
			timerSet = false;
		}
		
		
		var moveCanvas = function(opt)
		{
			switch(opt)
			{
				
				case 1://w
					if(dy< 0)
						dy++;	
					
					drawMap();
					break;
				case 2://a
					if(dx<0)
					dx++;
					drawMap();
					break;
				case 3://d
					if(map.DIM_X*map.CUBE_SIZE - canvasWidth > -1*dx)
					dx--;
					drawMap();
					break;
				case 4://s
					if(map.DIM_Y*map.CUBE_SIZE - canvasHeight > -1*dy )
						dy--;
					drawMap();
					break;		
			}
		}
		
		
		kat.addEvent({ 
						elm: gameCanvas,
						event: "keyup",
						fct: clearTimerForMovement
					});
					
		kat.addEvent({ 
						elm: gameCanvas,
						event: "keydown",
						fct: setTimerForMovement
					});		
					
		kat.addEvent({
						elm: gameCanvas,
						event: "mousemove",
						fct:function(e){
										coords = kat.getMouseInElementXY(e);
										mouseCoord.innerHTML= coords.x +" "+coords.y;
												}
		
		
		});
		
	//Change background color
		
	var blue = 0;
	var red = 0;
	var pas = 1;
		
	var changeBackgroundColor = function()
	{
		switch(blue)
		{
			case 255:
				pas = -1;
				break;
			case 20:
				pas = +1;
				break;
			default:
				//console.log("Change background color");
				break;
		}	

		posXAstru += 255/canvasWidth;
				
		blue = blue+pas;
				//console.log(blue);
		
		mapContainer.style.backgroundColor ="rgb(" + red + " , "+red+" , "+blue+" )";
	}

	setInterval(changeBackgroundColor,10);
		
	}