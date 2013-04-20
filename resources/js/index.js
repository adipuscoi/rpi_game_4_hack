
	kat.addEvent({
					elm: window,
					event: "load",
					fct: function()
					{
						var usernameInput = kat.getElm( "usernameInput" );
						var passwordInput = kat.getElm( "passwordInput" );
						var loginButton = kat.getElm( "loginButton" );
						var createAccountButton = kat.getElm( "createAccountButton" );
						
						var sendData = function()
						{
							var username = usernameInput.value.replace(/^\s+|\s+$/g, '');
							if(
								username == ""
								|| !kat.usernameRegex.test( username )
							)
							{
								alert( "Bad username" );
								
								return;
							}
							
							var password = passwordInput.value
							if( password.length < 4 )
							{
								alert( "Bad password" );
								
								return;
							}
							
							kat.sendAJAX({
											method: "POST",
											address: "resources/php/login.php",
											data: {
													username: usernameInput.value,
													password: passwordInput.value
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
												
												window.location = "game.php";
											}
										});
						}
						
						kat.setActiveOnEnter({
											elm: usernameInput,
											fct: sendData
										});
										
						kat.setActiveOnEnter({
											elm: passwordInput,
											fct: sendData
										});
						
						kat.addEvent({
										elm: loginButton,
										event: "click",
										fct: sendData
									});
									
						kat.addEvent({
										elm: createAccountButton,
										event: "click",
										fct: function()
										{
											console.log("here");
											window.location = "createAccount.php";
										}
									});
					}
				});