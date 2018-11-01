var mazeArray = [];

var mazeSize = 20;
var density = 0.1;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var slider = document.getElementById("myRange");


var startX;
var startY;
var endX;
var endY;

var maze = {
	Create: function(mazeArray) {

		for (var i = 0; i < mazeSize; i++) {
			mazeArray[i] = [];

			for (var j = 0; j < mazeSize; j++) {
				
				//use random to decide if cell is blocked
				if(density > Math.random()){
					mazeArray[i][j] = new Cell(i, j, 1);
					ctx.fillStyle = "#000000"; 
					ctx.fillRect(i*30,j*30,30,30)
				} else {
					mazeArray[i][j] = new Cell(i, j, 0);
					ctx.fillStyle = "#808080"; 
					ctx.fillRect(i*30,j*30,30,30)
				}
			}		
		}
		//set start and end points
		var startSet = false;
		var endSet = false;
	
		while (startSet == false){
			startX = getRandomInt(mazeSize);
			startY = getRandomInt(mazeSize);
			if(mazeArray[startX][startY].blocked == 0){
				mazeArray[startX][startY].start = 1;
				startSet = true;
				ctx.fillStyle = "#32CD32"; 
				ctx.fillRect(startX*30,startY*30,30,30)
			}
		}
	
		while (endSet == false){
			endX = getRandomInt(mazeSize);
			endY = getRandomInt(mazeSize);
			if(mazeArray[startX][startY].blocked == 0){
				mazeArray[endX][endY].end = 1;
				endSet = true;
				ctx.fillStyle = "#ff0000"; 
				ctx.fillRect(endX*30,endY*30,30,30)
			}
		}
	},
	ReturnStartCell: function(){
		return mazeArray[startX][startY];
	}
}

function Cell(X, Y, block){
	this.cellX = X;
	this.cellY = Y;
	this.blocked = block;
	this.start = 0;
	this.end = 0;
	this.distanceFromStart = 0;
}

function findPath(mazeArray) {
	ctx.beginPath();
	ctx.moveTo((startX*30)+15,(startY*30)+15);
	ctx.lineTo((endX*30)+15,(endY*30)+15)
	ctx.stroke();
}

function BFS(mazeArray){
	searchQueue = new Queue();
	var startCell = maze.ReturnStartCell(mazeArray);
	var curCell;
	var nextCell;

	searchQueue.enqueue(startCell);

	while (searchQueue.peek() != null){
		curCell = searchQueue.dequeue();

		if(mazeArray[curCell.cellX][curCell.cellY+1] !== undefined){
			nextCell = mazeArray[curCell.cellX][curCell.cellY+1];
			checkNext(curCell, nextCell, searchQueue);
		}
		
		if(mazeArray[curCell.cellX+1] !== undefined){
			nextCell = mazeArray[curCell.cellX+1][curCell.cellY];
			checkNext(curCell, nextCell, searchQueue);
		}
		
		if(mazeArray[curCell.cellX][curCell.cellY-1] !== undefined){
			nextCell = mazeArray[curCell.cellX][curCell.cellY-1];
			checkNext(curCell, nextCell, searchQueue);
		}
		
		if(mazeArray[curCell.cellX-1] !== undefined){
			nextCell = mazeArray[curCell.cellX-1][curCell.cellY];
			checkNext(curCell, nextCell, searchQueue);
		}	
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function checkNext(curCell, nextCell, searchQueue){
	if (nextCell == null){
		return;
	} else if (nextCell.end == 1){
		return;
	} else if (nextCell.blocked == 1){
		return;
	} else if (nextCell.distanceFromStart == 0 && nextCell.start == 0){
		nextCell.distanceFromStart = curCell.distanceFromStart+1;
		searchQueue.enqueue(nextCell);
		ctx.fillText(nextCell.distanceFromStart,(nextCell.cellX*30)+15,(nextCell.cellY*30)+15)
	}
}

slider.oninput = function densityUpdate(){
	density = this.value*0.1;
}
