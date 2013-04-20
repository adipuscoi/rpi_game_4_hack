
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
							if(
								trim( usernameInput.value ) == ""
								|| !kat.usernameRegex.test( usernameInput.value )
							)
							{
								alert( "Bad username" );
								
								return;
							}
							
							if( trim( passwordInput.value ) == "" )
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
												var res = commonJSONResponseProcessing( xmlhttp );
												
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