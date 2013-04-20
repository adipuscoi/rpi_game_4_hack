
	var kat = 
	{
		emailRegex: /^[A-Z0-9._-]+@[A-Z0-9._-]+\.[A-Z]{2,4}$/i,
		usernameRegex: /^[A-Z0-9._-]{4,}$/i,
		
		getMouseXY: function(e)
		{
			if( e.clientX )
			{
				kat.getMouseXY = function(e)
				{
					return {
									x: e.clientX + document.body.scrollLeft,
									y: e.clientY + document.body.scrollTop
								};
				}
			}
			else
			{
				kat.getMouseXY = function(e)
				{
					return {
									x: e.pageX,
									y: e.pageY
								};
				}
			}
			
			return kat.getMouseXY(e);
		},
		
		
		getMouseInElementXY: function( e )
		//not tested
		{
			var p = kat.getMouseXY(e);
			return {
							x: p.x - e.target.offsetLeft,
							y: p.y - e.target.offsetTop
						};
		},
		
		
		addEvent: function( args )
		{
			if( args.elm.addEventListener )
			{
				kat.addEvent = function( args )
				{
					args.elm.addEventListener( 
												args.event,
												args.fct,
												("bubble" in args) ? args.bubble : false
											);
				}
			}
			else
			{
				kat.addEvent = function( args )
				{
					args.elm.attachEvent( "on" + args.event, args.fct );
				}
			}
			
			kat.addEvent( args );
		},
		
		
		removeEvent: function( args )
		{
			if( args.elm.addEventListener )
			{
				kat.removeEvent = function( args )
				{
					args.elm.addEventListener( 
												args.event,
												args.fct,
												("bubble" in args) ? args.bubble : false
											);
				}
			}
			else
			{
				kat.removeEvent = function( args )
				{
					args.elm.detachEvent( "on" + args.evt, args.fct );
				}
			}
			
			kat.removeEvent( args );
		},
		
		
		_sendAJAX: function( xmlhttp, method, address, data, callback )
		{
			xmlhttp.onreadystatechange = function()
			{
				if(
					callback
					&& xmlhttp.readyState == 4
					&& xmlhttp.status == 200
				)
				{
					callback( xmlhttp );
				}
			}
			
			var argsStr = "";
			if( typeof data == "object" )
			{
				for( var i in data )
				{
					argsStr += i + "=" + encodeURIComponent( data[i] ) + '&';
				}
				//remove last '&'
				argsStr = argsStr.slice( 0, -1 );
			}
			else
			{
				argsStr = data;
			}
			
			if( method == "POST" )
			{
				xmlhttp.open( method, address, true );
				xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // This line
				xmlhttp.setRequestHeader("charset", "utf-8");
				xmlhttp.send( argsStr );
			}
			else
			{
				xmlhttp.open( method, address + '?' + argsStr, true );
				xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // This line
				xmlhttp.setRequestHeader("charset", "utf-8");
				xmlhttp.send();
			}
		},
		
		
		sendAJAX: function( args )
		{
			if (window.XMLHttpRequest)
			{// code for IE7+, Firefox, Chrome, Opera, Safari
				kat.sendAJAX = function( args )
				{
					kat._sendAJAX( new XMLHttpRequest(), args.method, args.address, args.data, args.callback );
				}
			}
			else
			{// code for IE6, IE5
				kat.sendAJAX = function( args )
				{
					kat._sendAJAX( new ActiveXObject("Microsoft.XMLHTTP"), args.method, args.address, args.data, args.callback );
				}
			}
			
			kat.sendAJAX( args );
		},
		
		
		//
		//misc functions to avoid rewrites
		//
		commonJSONResponseProcessing: function( xmlhttp )
		{
			var res = JSON.parse( xmlhttp.responseText );
			if( !res )
			{
				alert( "Bad response" );
				
				return null;
			}
			
			if( res.rc == "-1" )
			{
				alert( res.em + "\n" + res.src );
				
				return null;
			}

			return res;
		},
		

		setActiveOnEnter: function( args )
		{
			kat.addEvent({
							elm: args.elm,
							event: "keyup",
							fct: function( e )
							{
								//check for 'enter'
								if( e.keyCode != 13 )
								{
									return;
								}
								
								if( e.target != args.elm )
								{
									return;
								}
								
								args.elm.blur();
								
								args.fct();
							}
						});
		},
		
		
		//
		//because i'm lazy
		//
		getElm: function( id )
		{
			return document.getElementById( id );
		}
	}