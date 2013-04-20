<?php

	error_reporting(E_ALL|E_STRICT);
	
	session_start();
	
	if( isset( $_SESSION["username"] ) )
	{
		echo json_encode( array(
								"rc" => 0,
								"em" => "User already logged in."
							) );
		
		return;
	}
	
	if(
		!isset($_POST["username"])
		|| !isset($_POST["password"])
	)
	{
		echo json_encode( array(
								"rc" => -1,
								"em" => "Params missing"
							) );
		
		return;
	}
	
	if( !file_exists( __DIR__ . "/../../users/" . $_POST["username"] . ".dat.js" ) )
	{
		echo json_encode( array(
								"rc" => 0,
								"em" => "User does not exist"
							) );
		
		return;
	}
	
	$userData = json_decode( file_get_contents( __DIR__ . "/../../users/" . $_POST["username"] . ".dat.js" ) );
	
	if( $userData->password != $_POST["password"] )
	{
		echo json_encode( array(
								"rc" => 0,
								"em" => "Password does not fit user" .  $userData->password
							) );
		
		return;
	}
	
	$_SESSION["username"] = $_POST["username"];
	
	echo json_encode( array(
							"rc" => 1
						) );