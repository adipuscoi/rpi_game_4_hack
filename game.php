<?php
	
	error_reporting(E_ALL|E_STRICT);
	
	header("Content-Type: text/html; charset=utf-8\n");
	/*
	session_start();
	if( !isset( $_SESSION["user_id"] ) )
	{
		header( "Location: index.php" );
	}*/
?>

<!DOCTYPE html>

<html>
	
	<head>
		<title>GroundSpark</title>
		
		<link rel="stylesheet" type="text/css" href="resources/css/general.css">
		<link rel="stylesheet" type="text/css" href="resources/css/game.css">
		
		<script type="text/javascript" src="resources/js/kat.js"></script>
		
		<script type="text/javascript" src="resources/js/game.js"></script>
		<script type="text/javascript">
			kat.addEvent({
							elm: window,
							event: "load",
							fct: function()
							{
							/*
								initGame({
											userId: <?php echo json_encode( $_SESSION["user_id"] ); ?>,
											username: <?php echo json_encode( $_SESSION["user_username"] ); ?>
										});
							*/
								initGame();
							}
						});
		</script>
		
	</head>
	
	<body>
		
		<div id="main">
			<div id="gameScreenContainer">
				<div id="mapContainer" class="mapContainer">
					<canvas id="gameCanvas" width="800" height="600"></canvas>
				</div>
				
			</div>
			
			<div id="chatMainContainer">
				<div id="chatMessagesContainer">
				</div>
				
				<textarea rows="2" cols="25" id="chatInput"/></textarea>
				<input type="button" id="chatSendButton" value="Send"/>
			</div>
			
		</div>
		
	</body>

</html>