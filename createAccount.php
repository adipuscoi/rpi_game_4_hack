<?php

	error_reporting(E_ALL|E_STRICT);
	
	header("Content-Type: text/html; charset=utf-8\n");
	
	session_start();
	
	if( isset( $_SESSION["username"] ) )
	{
		header( "Location: game.php" ) ;
	}
?>

<!DOCTYPE html>

<html>
	
	<head>
		<title>GroundSpark</title>
		
		<link rel="stylesheet" type="text/css" href="resources/css/general.css">
		<link rel="stylesheet" type="text/css" href="resources/css/createAccount.css">
		
		<script type="text/javascript" src="resources/js/kat.js"></script>
		
		<script type="text/javascript" src="resources/js/createAccount.js"></script>
		
	</head>
	
	<body>
	
		<div id="main">
			
			<div id="createAccountFormContainer">
			
				<div class="createAccountFieldContainer">
					<span class="createAccountText" id="createAccountEmailText1">Email</span>
					<input type="text" id="createAccountEmailInput1"/>
				</div>
				<div class="createAccountFieldContainer">
					<span class="createAccountText" id="createAccountEmailText2">Verify email</span>
					<input type="text" id="createAccountEmailInput2"/>
				</div>
				<div class="createAccountFieldContainer">
					<span class="createAccountText"  id="createAccountUsernameText">Username</span>
					<input type="text" id="createAccountUsernameInput"/>
				</div>
				<div class="createAccountFieldContainer">
					<span class="createAccountText" id="createAccountPasswordText">Password</span>
					<input type="password" id="createAccountPasswordInput"/>
				</div>
				
				<input type="button" id="createAccountButton" value="Create Account"/>
			
			</div>
			
		</div>
		
	</body>

</html>