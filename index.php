<?php

	error_reporting(E_ALL|E_STRICT);
	
	header("Content-Type: text/html; charset=utf-8\n");
	
	session_start();
	
	//session_destroy(); exit();
	
	if( isset( $_SESSION["user_id"] ) )
	{
		header( "Location: game.php" ) ;
	}
	
?>

<!DOCTYPE html>

<html>
	
	<head>
		<title>GroundSpark</title>
		
		<link rel="stylesheet" type="text/css" href="resources/css/general.css">
		<link rel="stylesheet" type="text/css" href="resources/css/index.css">
		
		<script type="text/javascript" src="resources/js/kat.js"></script>
		
		<script type="text/javascript" src="resources/js/index.js"></script>
		
	</head>
	
	<body>
	
		<div id="main">
			
			<input type="text" id="usernameInput"/>
			<input type="password" id="passwordInput"/>
			<input type="button" id="loginButton" value="Log in"/>
			<input type="button" id="createAccountButton" value="Create account"/>
			
		</div>
		
	</body>

</html>