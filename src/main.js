var mazeSize = 20;
var density = 0.1;
var maze = [];
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var slider = document.getElementById("myRange");


var startX;
var startY;
var endX;
var endY;


for (var i = 0; i < mazeSize; i++) {
	maze[i] = [];

	for (var j = 0; j < mazeSize; j++) {
		maze[i][j] = 'Empty';
	}
}

function mazeCreate(maze) {

	for (var i = 0; i < mazeSize; i++) {
		for (var j = 0; j < mazeSize; j++) {
			//use random to decide if cell is blocked
			if(density > Math.random()){
				maze[i][j] = 'Blocked';
				ctx.fillStyle = "#000000"; 
				ctx.fillRect(i*30,j*30,30,30)
			} else {
				maze[i][j] = 'Empty';
				ctx.fillStyle = "#808080"; 
				ctx.fillRect(i*30,j*30,30,30)
			}
		}		
	}
	//set start and end points
	var startSet = 'false';
	var endSet = 'false';

	while (startSet == 'false'){
		startX = getRandomInt(mazeSize);
		startY = getRandomInt(mazeSize);
		if(maze[startX][startY] == 'Empty'){
			maze[startX][startY] = 'Start';
			startSet = 'true';
			ctx.fillStyle = "#32CD32"; 
			ctx.fillRect(startX*30,startY*30,30,30)
		}
	}

	while (endSet == 'false'){
		endX = getRandomInt(mazeSize);
		endY = getRandomInt(mazeSize);
		if(maze[endX][endY] == 'Empty'){
			maze[endX][endY] = 'Start';
			endSet = 'true';
			ctx.fillStyle = "#ff0000"; 
			ctx.fillRect(endX*30,endY*30,30,30)
		}
	}
}

function findPath(maze) {
	ctx.beginPath();
	ctx.moveTo((startX*30)+15,(startY*30)+15);
	ctx.lineTo((endX*30)+15,(endY*30)+15)
	ctx.stroke();
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

slider.oninput = function densityUpdate(){
	density = this.value*0.1;
}
