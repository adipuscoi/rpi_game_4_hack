"use strict";
// Port where we'll run the websocket server
var webSocketsServerPort = 31415;
 
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var clients = [ ];
var terrain = [];
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