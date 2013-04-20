
	var createAccountEmailInput1 = null,
		createAccountEmailInput2 = null,
		createAccountUsernameInput = null,
		createAccountPasswordInput = null,
		createAccountEmailText1 = null,
		createAccountEmailText2 = null,
		createAccountUsernameText = null,
		createAccountPasswordText = null,
		createAccountButton = null;

	var inputsFilledCorrectlyFlags = {};
	
	var sendData = function()
	{
		var allOkFlag = true;
		
		for( var i in inputsFilledCorrectlyFlags )
		{
			if( inputsFilledCorrectlyFlags[i] )
			{
				continue;
			}
			
			allOkFlag = false;
			break;
		}
		
		if( !allOkFlag )
		{
			alert( "Correct the information filled in and try again." );
			console.log( inputsFilledCorrectlyFlags );
			return;
		}
		
		kat.sendAJAX({
						method: "POST",
						address: "resources/php/create_user.php",
						data: {
								email: createAccountEmailInput1.value,
								username: createAccountUsernameInput.value,
								password: createAccountPasswordInput.value
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
							
							alert( "Account created successfully.\nRedirecting to main page..." );
							window.location = "index.php";
						}
					});
	}
	
	kat.addEvent({
					elm: window,
					event: "load",
					fct: function()
					{
						createAccountEmailInput1 = kat.getElm( "createAccountEmailInput1" );
						inputsFilledCorrectlyFlags[ "createAccountEmailInput1" ] = false;
						
						createAccountEmailInput2 = kat.getElm( "createAccountEmailInput2" );
						inputsFilledCorrectlyFlags[ "createAccountEmailInput2" ] = false;
						
						createAccountUsernameInput = kat.getElm( "createAccountUsernameInput" );
						inputsFilledCorrectlyFlags[ "createAccountUsernameInput" ] = false;
						
						createAccountPasswordInput = kat.getElm( "createAccountPasswordInput" );
						inputsFilledCorrectlyFlags[ "createAccountPasswordInput" ] = false;
						
						createAccountEmailText1 = kat.getElm( "createAccountEmailText1" );
						createAccountEmailText2 = kat.getElm( "createAccountEmailText2" );
						createAccountUsernameText = kat.getElm( "createAccountUsernameText" );
						createAccountPasswordText = kat.getElm( "createAccountPasswordText" );
						
						createAccountButton = kat.getElm( "createAccountButton" );
						
						kat.setActiveOnEnter({
												elm: createAccountEmailInput1,
												fct: sendData
											});
											
						kat.setActiveOnEnter({
												elm: createAccountEmailInput2,
												fct: sendData
											});
											
						kat.setActiveOnEnter({
												elm: createAccountUsernameInput,
												fct: sendData
											});
											
						kat.setActiveOnEnter({
												elm: createAccountPasswordInput,
												fct: sendData
											});
						
						kat.addEvent({
										elm: createAccountEmailInput1,
										event: "blur",
										fct: function()
										{
											if( createAccountEmailInput1.value == "" )
											{
												return;
											}
											
											if( !kat.emailRegex.test( createAccountEmailInput1.value ) )
											{
												inputsFilledCorrectlyFlags[ "createAccountEmailInput1" ] = false;
												alert( "Invalid email" );
												createAccountEmailText1.className = "createAccountTextAlert";
												
												return;
											}
											
											inputsFilledCorrectlyFlags[ "createAccountEmailInput1" ] = true;
											createAccountEmailText1.className = "createAccountText";
										}
									});
									
						kat.addEvent({
										elm: createAccountEmailInput2,
										event: "blur",
										fct: function()
										{
											if( createAccountEmailInput2.value == "" )
											{
												return;
											}
											
											if( createAccountEmailInput2.value != createAccountEmailInput1.value )
											{
												inputsFilledCorrectlyFlags[ "createAccountEmailInput2" ] = false;
												alert( "Emails don't match" );
												createAccountEmailText2.className = "createAccountTextAlert";
												
												return;
											}
											
											inputsFilledCorrectlyFlags[ "createAccountEmailInput2" ] = true;
											createAccountEmailText2.className = "createAccountText";
										}
									});
									
						kat.addEvent({
										elm: createAccountUsernameInput,
										event: "blur",
										fct: function()
										{
											if( createAccountUsernameInput.value == "" )
											{
												return;
											}
											
											if( !kat.usernameRegex.test( createAccountUsernameInput.value ) )
											{
												inputsFilledCorrectlyFlags[ "createAccountUsernameInput" ] = false;
												alert( "Invalid username.\nUse at least 4 characters from: letters, numbers, '.', '_' or '-'" );
												createAccountUsernameText.className = "createAccountTextAlert";
												
												return;
											}
											
											inputsFilledCorrectlyFlags[ "createAccountUsernameInput" ] = true;
											createAccountUsernameText.className = "createAccountText";
										}
									});
						
						kat.addEvent({
										elm: createAccountPasswordInput,
										event: "blur",
										fct: function()
										{
											if( createAccountPasswordInput.value == "" )
											{
												return;
											}
											
											if( createAccountPasswordInput.value.length < 8 )
											{
												inputsFilledCorrectlyFlags[ "createAccountPasswordInput" ] = false;
												alert( "Invalid username.\nUse at least 8 characters" );
												createAccountPasswordText.className = "createAccountTextAlert";
												
												return;
											}
											
											inputsFilledCorrectlyFlags[ "createAccountPasswordInput" ] = true;
											createAccountPasswordText.className = "createAccountText";
										}
									});
						
						kat.addEvent({ 
										elm: createAccountButton,
										event: "click",
										fct: sendData
									});
						
					}
				});