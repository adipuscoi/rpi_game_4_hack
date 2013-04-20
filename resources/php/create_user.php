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
		|| !isset($_POST["email"])
	)
	{
		echo json_encode( array(
								"rc" => -1,
								"em" => "Params missing"
							) );
		
		return;
	}
	
	if( file_exists( __DIR__ . "/../../users/" . $_POST["username"] . ".dat.js" ) )
	{
		echo json_encode( array(
								"rc" => 0,
								"em" => "User already exist"
							) );
		
		return;
	}
	
	$userData = json_encode( array(
									"password" => $_POST["password"],
									"email" => $_POST["email"]
								) );
	
	file_put_contents( __DIR__ . "/../../users/" . $_POST["username"] . ".dat.js", $userData );
	
	echo json_encode( array(
							"rc" => 1
						) );