"use strict";
// Port where we'll run the websocket server
var webSocketsServerPort = 31415;
 
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var clients = [ ];
 

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

generateTerrain( map.DIM_X, map.DIM_Y );

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});
 
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});
 
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' address ' + request.remoteAddress + '.');
 
    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    connection.sendUTF(JSON.stringify( { cmd: 'init', rc: 1, terrain: terrain } ));
 
    // user sent some message
    connection.on('message', function(message)
	{
		console.log( message );
		var msg = JSON.parse( message.utf8Data );
		interpretMessage( connection, msg );
    });
 
    // user disconnected
    connection.on('close', function(conn) {
            console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
			for( var i in clients )
			{
				if( clients[i].conn != connection )
				{
					continue;
				}
				
				for( var j in clients[i].userPrivateData )
				{
					clients[i].userData[j] = clients[i].userPrivateData[j]
				}
				
				fs.writeFile("../users/" + i + ".dat.js", JSON.stringify(clients[i].userData), function(err)
				{
					if(err)
					{
						console.log(err);
					}
				});
				
				delete clients[i];
				
				break;
			}
    });
 
});


var interpretMessage = function( conn, msg )
{
	console.log( msg );
	if( msg.cmd == "loadUser" )
	{
		fs.readFile(
					"../users/" + msg.username + ".dat.js",
					"utf8",
					function (err,data)
					{
						if (err)
						{
							console.log(err);
							
							conn.sendUTF(JSON.stringify( {
															rc: -1,
															em: "Problems opening user file"
														} ) );
							return;
						}
						
						var userData = JSON.parse( data );
						var userPrivateData = {};
						
						userPrivateData.password = userData.password;
						delete userData.password;
						userPrivateData.email = userData.email;
						delete userData.email;
						
						if( !("posX" in userData) )
						{
							userData.posX = 0;
						}
						if( !("posY" in userData) )
						{
							userData.posY = 0;
						}
						
						clients[msg.username] = {
													conn: conn,
													userData: userData,
													userPrivateData: userPrivateData
												};
									
						conn.sendUTF(JSON.stringify( {
														rc: 1,
														cmd: msg.cmd,
														userData: userData
													} ) );
						return;
					});
	}
	
	if( msg.cmd == "startMoveHorizontalLeft" )
	{
		clearInterval( clients[msg.username].timers.moveHorizontal );
		clients[msg.username].timers.moveHorizontal = setInterval( function()
		{
			clients[msg.username].userData.posX -= 1;
		}, 50);
		return;
	}
	
	if( msg.cmd == "startMoveHorizontalRight" )
	{
		clearInterval( clients[msg.username].timers.moveHorizontal );
		clients[msg.username].timers.moveHorizontal = setInterval( function()
		{
			clients[msg.username].userData.posX += 1;
		}, 50);
		return;
	}
	
	if( msg.cmd == "stopMoveHorizontalLeft" )
	{
		clearInterval( clients[msg.username].timers.moveHorizontal );
		conn.sendUTF(JSON.stringify( {
											rc: 1,
											cmd: msg.cmd,
											userData: clients[msg.username].userData
										} ) );
		return;
	}
	
	if( msg.cmd == "stopMoveHorizontalRight" )
	{
		clearInterval( clients[msg.username].timers.moveHorizontal );
		conn.sendUTF(JSON.stringify( {
											rc: 1,
											cmd: msg.cmd,
											userData: clients[msg.username].userData
										} ) );
		return;
	}
}