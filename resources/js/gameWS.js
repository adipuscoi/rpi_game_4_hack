
	var player = null;

	var initWS = function( args )
	{
		player = document.getElementById( "player" );
		
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
			var msg = kat.commonJSONResponseProcessing( message.data );
			
			console.log( msg );
			
			if( msg.cmd == "init" )
			{
				terrain = msg.terrain;
				connection.send( JSON.stringify( { cmd: "loadUser", username: args.username } ) );
				
				return;
			}
			
			if( msg.cmd == "loadUser" )
			{
				if( msg.rc == 1 )
				{
					player.style.left = msg.userData.posX + "px";
					player.style.top = msg.userData.posY + "px";
					
					var timer;
					var timerSet = false;
					var opt = 0;
					
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
						switch(e.keyCode)
						{
							
							case 37://left
								opt = 1;
								connection.send( JSON.stringify( { cmd: "startMoveHorizontalLeft", username: args.username } ) );
								break;
							case 38://up
								opt = 2;
								break;
							case 39://rigth
								opt = 3;
								connection.send( JSON.stringify( { cmd: "startMoveHorizontalRight", username: args.username } ) );
								break;
							case 40://down
								opt = 4;
								break;		
						}
						moveCanvas( opt );
						timer = setInterval(function()
						{
							moveCanvas( opt );
						}, 50);
						timerSet = true;
					}
				
					clearTimerForMovement = function(e)
					{
						console.log("clear");
						clearInterval(timer);
						switch(opt)
						{
							case 1://left
								connection.send( JSON.stringify( { cmd: "stopMoveHorizontalLeft", username: args.username } ) );
								break;
							case 2://up
								
								break;
							case 3://right
								connection.send( JSON.stringify( { cmd: "stopMoveHorizontalRight", username: args.username } ) );
								break;
							case 4://down
								
								break;		
						}
						timer = null;
						timerSet = false;
					}
					
					
					var moveCanvas = function(opt)
					{
						switch(opt)
						{
							case 1://left
								player.style.left = (player.offsetLeft - 1) + "px";
								break;
							case 2://up
								break;
							case 3://right
								player.style.left = (player.offsetLeft + 1) + "px";
								break;
							case 4://down
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
				}
			}
			
			if(
				msg.cmd == "stopMoveHorizontalLeft"
				|| msg.cmg == "stopMoveHorizontalRight"
			)
			{
				player.style.left = msg.userData.posX + "px";
				player.style.top = msg.userData.posY + "px";
			}
		};
	
	}