<?php
	
	error_reporting(E_ALL|E_STRICT);
	
	header("Content-Type: text/html; charset=utf-8\n");
	
	session_start();
	
	if( !isset( $_SESSION["username"] ) )
	{
		header( "Location: index.php" );
	}
?>

<!DOCTYPE html>

<html>
	
	<head>
		<title>GroundSpark</title>
		
		<link rel="stylesheet" type="text/css" href="resources/css/general.css">
		<link rel="stylesheet" type="text/css" href="resources/css/game.css">
		
		<script type="text/javascript" src="resources/js/kat.js"></script>
		
		<script type="text/javascript" src="resources/js/game.js"></script>
		
		<script type="text/javascript" src="resources/js/gameWS.js"></script>
		<script type="text/javascript">
			kat.addEvent({
							elm: window,
							event: "load",
							fct: function()
							{
								initGame();
								
								initWS({
										username: <?php echo json_encode( $_SESSION["username"] ); ?>
									});
							}
						});
		</script>
		
	</head>
	
	<body>
		
		<div id="main">
			<div id="gameScreenContainer">
				<div id="mapContainer" class="mapContainer">
					<canvas id="gameCanvas" width="1200" height="800" tabindex="1"></canvas>
				</div>
				
			</div>
			
		</div>
		
		<div id="player" style="position:absolute;height:80px;width:40px;background-color:pink;top:0px;left:0px;">
		</div>
		
	</body>

</html>