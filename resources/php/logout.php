<?php

	error_reporting(E_ALL|E_STRICT);
	
	session_start();
	
	if( !isset( $_SESSION["username"] ) )
	{
		echo json_encode( array(
								"rc" => 0,
								"em" => "User no logged in."
							) );
		
		return;
	}
	
	setcookie ( session_name(), "", time() - 3600);
	
	session_destroy();
	
	echo json_encode( array(
							"rc" => 1
						) );