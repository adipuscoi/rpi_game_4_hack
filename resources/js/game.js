	
	var ctx = null;
	
	var posX, posY;
	
	var posXAstru = 0, posYAstru = 0;
	
	var dx = 0, dy = 0;


//Events for canvas		
	
	var addCanvasEvents = function()
	{
		kat.addEvent({ 
							elm: gameCanvas,
							event: "keyup",
							fct: clearTimerForMovement
						});
						
			kat.addEvent({ 
							elm: gameCanvas,
							event: "keydown",
							fct: setTimerForMovement
						});
	}


	
	
	var map = {
		"AIR": 0,
		"ROCK":1,
		"BEDROCK":2,
		"DIRT":3,
		"SAND":4,
		"FLOWER":5,
		"NR_BLOCKS":5,
		"DIM_X":40,
		"DIM_Y":40,
		"CUBE_SIZE":30,
		}
	var terrain = [];

	var generateTerrain= function(dimX, dimY)
	{
		
		//Alocare
		for (var i = 0; i < dimY; i++) 
		{
			terrain[i] = [];
		}
		
		
		//Initializare
		for(i = 0;i<dimY;i++)
		{
			for(j = 0;j<dimX; j++)
			{
				terrain[i][j] = 0;
			}
		}	
		
		//Stabilesc limita terenului
		
		var bias = 2;
		
		groundLimitY = Math.floor(3*dimY/7);
		//console.log(groundLimitY);
		
		startBlockOld = groundLimitY + Math.floor(Math.random()*(dimY-groundLimitY-2));
		//console.log(startBlockOld);
		
			startBlock = startBlockOld + Math.floor( Math.random()*bias*2)-bias;
				
			startBlockOld = startBlock;
			
			posY = startBlockOld;
			//console.log(posY);
			
			if(startBlock > dimY-1)
				startBlock = dimY-1;
			if(startBlock < 0)
				startBlock = 0;
			
			for(y = startBlock; y<dimY ; y++)
			{
				terrain[y][0] =  map.ROCK;
			}
			terrain[startBlock][0] =  map.BEDROCK;
		
		
		for(x = 1; x < dimX; x++)
		{
			startBlock = startBlockOld + Math.floor( Math.random()*bias*2)-bias;
				
			startBlockOld = startBlock;
			//console.log(posY);
			
			if(startBlock > dimY-1)
				startBlock = dimY-1;
			if(startBlock < 0)
				startBlock = 0;
				
			addFlower = Math.floor( Math.random()*10);
			if(addFlower % 2 == 0 && startBlock>1)
				terrain[startBlock-1][x] =  map.FLOWER;
			
			for(y = startBlock; y<dimY ; y++)
			{
				terrain[y][x] =  map.ROCK;
			}
			terrain[startBlock][x] =  map.BEDROCK;
			
		}
	}
	
	
	var initGame = function( args )
	{
		ctx = document.getElementById('gameCanvas').getContext('2d');
		gameCanvas = document.getElementById("gameCanvas");
		
		var canvasHeight = gameCanvas.getAttribute("height");
		var canvasWidth = gameCanvas.getAttribute("width");
		
		var groundTiles = [];
		imagesToLoad = 6;		
		
		generateTerrain( map.DIM_X, map.DIM_Y );
		
		var imageLoader = function( resourceName )
		{
		
			var image = new Image();
			image.src = resourceName;
			image.onload = function()
			{
				imagesToLoad--;
				if( imagesToLoad == 0 )
				{
					drawMap();
					addCanvasEvents();
					setInterval(changeBackgroundColor,100);
				}
			};
		
			return image;
		}
		
		for( var i = 0; i < 5; i++ )
		{
			groundTiles[i] = imageLoader('resources/img/' + i + '.png');				
		}

		var sun = imageLoader('resources/img/sun.png');
		var moon = imageLoader('resources/img/moon.png');
		var flower = imageLoader('resources/img/f.png');
		
		var character = [];
		
		for( var i = 0; i < 2; i++ )
		{
			character[i] = imageLoader('resources/img/c' + i + '.png');				
		}
		
		var crtAstru = 1;
		var crtCharacter = 0;
		var astre = {"-1":sun, "1":moon};
		
		var nr_cubesY = Math.floor(canvasHeight/map.CUBE_SIZE);
		
		var offset = nr_cubesY - posY;
		if(offset < 0)
			offset -= Math.min(Math.floor(nr_cubesY/2), map.DIM_Y-posY); 
		else
			offset = 0;
		
		function drawMap()
		{
			ctx.clearRect(0,0,1000,1000);
			
			ctx.drawImage(astre[crtAstru], posXAstru, posYAstru);
			
			for( var y = 0; y < terrain.length; y++ )
			{
				for( var x = 0; x < terrain[y].length; x++ )
				{
					if( terrain[y][x] != 0 )
					{
						if(terrain[y][x] == 5)
						{
							ctx.drawImage(flower, dx+x*map.CUBE_SIZE, dy+y*map.CUBE_SIZE+offset*map.CUBE_SIZE+16);						
						}
						else
						{
							ctx.drawImage(groundTiles[terrain[y][x]], dx+x*map.CUBE_SIZE, dy+y*map.CUBE_SIZE+offset*map.CUBE_SIZE);						
						}
					}
				}
			}
			ctx.drawImage(character[crtCharacter],dx, dy+offset*map.CUBE_SIZE+(posY-2)*map.CUBE_SIZE);							
		}		
		
		mapContainer = document.getElementById("mapContainer");
		
		
		posYAstru = canvasHeight/7;
		posXAstru = canvasWidth/2;
		
		var timer;
		var timerSet = false;
		setTimerForMovement = function(e)
		{
			if( timerSet )
			{
				return;
			}
			if( timer != null )
			{
				clearInterval(timer);
			}
			var opt = 0;
			switch(e.keyCode)
			{
				
				case 87://w
					opt = 1;
					break;
				case 65://a
					opt = 2;
					crtCharacter = 0;
					break;
				case 68://d
					opt = 3;
					crtCharacter = 1;
					break;
				case 83://s
					opt = 4;
					break;		
			}
			moveCanvas( opt );
			timer = setInterval(function()
			{
				moveCanvas( opt );
			}, 10);
			timerSet = true;
		}
		
		clearTimerForMovement = function(e)
		{
			clearInterval(timer);
			timer = null;
			timerSet = false;
		}
		
		
		var moveCanvas = function(opt)
		{
			switch(opt)
			{
				
				case 1://w
					if(dy< 0)
						dy++;	
					
					drawMap();
					break;
				case 2://a
					if(dx<0)
					dx++;
					drawMap();
					break;
				case 3://d
					if(	( (map.DIM_X*map.CUBE_SIZE - canvasWidth) > -1*dx )
					&& ( (posX - canvasWidth) > -1*dx ) )
						dx--;
					drawMap();
					break;
				case 4://s
					if(map.DIM_Y*map.CUBE_SIZE - canvasHeight > -1*dy )
						dy--;
					drawMap();
					break;		
			}
		}
		
		//Change background color
			
		var blue = 0;
		var red = 0;
		var pas = 1;
		
			
		var changeBackgroundColor = function()
		{
			switch(blue)
			{
				case 255:
					pas = -1;				
					break;
				case 0:
					pas = +1;
					//pasAstru = pasAstru*-1;
					break;
				case 127:
					posXAstru = -2;
					posYAstru = canvasHeight/7;
					crtAstru = crtAstru*-1;
					break;
				case 64:
					//pasAstru = pasAstru*-1;
					break;
				case 191:
					//pasAstru = pasAstru*-1;
					break;
					
				default:
					break;
			}	

			posXAstru += canvasWidth/255;
			posYAstru += -0.7;
		
			drawMap();
					
			blue = blue+pas;
			mapContainer.style.backgroundColor ="rgb(" + red + " , "+red+" , "+blue+" )";
		}

	}