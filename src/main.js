var mazeArray = [];

var mazeSize = 20;
var density = 0.1;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var slider = document.getElementById("myRange");
var checkbox = document.getElementById("chbx");

var changed;
var curCell;
var DFSCompleted;

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
					mazeArray[i][j].distanceFromStart = 999;
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
			
			mazeArray[startX][startY].start = 1;
			mazeArray[startX][startY].blocked = 0;
			mazeArray[startX][startY].distanceFromStart = 0;
			startSet = true;
			ctx.fillStyle = "#32CD32"; 
			ctx.fillRect(startX*30,startY*30,30,30)			
		}
	
		while (endSet == false){
			endX = getRandomInt(mazeSize);
			endY = getRandomInt(mazeSize);
			
			mazeArray[endX][endY].end = 1;
			mazeArray[endX][endY].blocked = 0;
			mazeArray[endX][endY].distanceFromStart = 0;
			endSet = true;
			ctx.fillStyle = "#ff0000"; 
			ctx.fillRect(endX*30,endY*30,30,30)		
		}
		document.getElementById('lblMessage').innerHTML = 'Map generated.';
	},
	ReturnStartCell: function(){
		return mazeArray[startX][startY];
	},
	ReturnEndCell: function(){
		return mazeArray[endX][endY];
	}
}

function Cell(X, Y, block){
	this.cellX = X;
	this.cellY = Y;
	this.blocked = block;
	this.start = 0;
	this.end = 0;
	this.distanceFromStart = 0;
	this.visited = false;
}

// depth first search algorithm
function DFS(mazeArray){

	var startCell = maze.ReturnStartCell(mazeArray);
	var endCell = maze.ReturnEndCell(mazeArray);
	var nextCell;
	var pathCompleted = false;
	var stack = [];	

	DFSCompleted = false;

	curCell = startCell;
	curCell.visited = true;
	stack.push(startCell);

	while (DFSCompleted == false){
		changed = false;
		// check s
		if(mazeArray[curCell.cellX][curCell.cellY+1] !== undefined && changed == false){
			nextCell = mazeArray[curCell.cellX][curCell.cellY+1];
			DFSChecker(nextCell, stack);
		}
		// check e
		if(mazeArray[curCell.cellX+1] !== undefined && changed == false){
			nextCell = mazeArray[curCell.cellX+1][curCell.cellY];
			DFSChecker(nextCell, stack);
		}
		// check n
		if(mazeArray[curCell.cellX][curCell.cellY-1] !== undefined && changed == false){
			nextCell = mazeArray[curCell.cellX][curCell.cellY-1];
			DFSChecker(nextCell, stack);
		}
		// check w
		if(mazeArray[curCell.cellX-1] !== undefined && changed == false){
			nextCell = mazeArray[curCell.cellX-1][curCell.cellY];
			DFSChecker(nextCell, stack);
		}
		// if none then go back
		if(changed == false){
			stack.pop();

			// js equivilent of peek
			curCell = stack[stack.length-1];
		}
		if(stack.length == 0){
			document.getElementById('lblMessage').innerHTML = 'No valid route.';
			DFSCompleted = true;
		}
	}

	ctx.strokeStyle = "#ff0000";
	// if we found a valid route
	if(stack.length > 0){
		document.getElementById('lblMessage').innerHTML = 'Route found.';	
		curCell = stack.pop();
		
		// loop through stack to draw path
		while(pathCompleted == false){		
			nextCell = stack.pop();
	
			ctx.beginPath();
			ctx.moveTo((curCell.cellX*30)+15,(curCell.cellY*30)+15);
			ctx.lineTo((nextCell.cellX*30)+15,(nextCell.cellY*30)+15);
			ctx.stroke();
	
			curCell = nextCell;
	
			// check if we just finished our path
			if(curCell.start == 1){
				pathCompleted = true;
			}
		}
	}	
}

function DFSChecker(nextCell, stack){
	if(nextCell.blocked == 0 && nextCell.visited == false){
		nextCell.visited = true;

		if(checkbox.checked){
			ctx.fillStyle = "#ff0000";
			ctx.fillText('x',(nextCell.cellX*30),(nextCell.cellY*30)+30)
		}
		
		if(nextCell.end == 1){
			DFSCompleted = true;
		}

		curCell = nextCell;
		stack.push(nextCell);
		changed = true;		
	}
}

// breadth first search algorithm
function BFS(mazeArray){
	searchQueue = new Queue();
	var startCell = maze.ReturnStartCell(mazeArray);
	var endCell = maze.ReturnEndCell(mazeArray);
	var curCell;
	var nextCell;
	var lowestNeighbor;
	var pathCompleted = false;

	searchQueue.enqueue(startCell);

	while (searchQueue.peek() != null){
		curCell = searchQueue.dequeue();

		// check s
		if(mazeArray[curCell.cellX][curCell.cellY+1] !== undefined){
			nextCell = mazeArray[curCell.cellX][curCell.cellY+1];
			checkNext(curCell, nextCell, searchQueue);
		}
		// check e		
		if(mazeArray[curCell.cellX+1] !== undefined){
			nextCell = mazeArray[curCell.cellX+1][curCell.cellY];
			checkNext(curCell, nextCell, searchQueue);
		}	
		// check n	
		if(mazeArray[curCell.cellX][curCell.cellY-1] !== undefined){
			nextCell = mazeArray[curCell.cellX][curCell.cellY-1];
			checkNext(curCell, nextCell, searchQueue);
		}
		// check w		
		if(mazeArray[curCell.cellX-1] !== undefined){
			nextCell = mazeArray[curCell.cellX-1][curCell.cellY];
			checkNext(curCell, nextCell, searchQueue);
		}	
	}

	// if endpoint has a measured distance (meaning that there is a valid route to it)
	if(endCell.distanceFromStart > 0){
		// starting at the endpoint
		curCell = endCell;

		ctx.strokeStyle = "#0000ff";

		// check each neighboring cell and select the one with shortest distance to start, until we reach start
		while(pathCompleted == false){
			if(mazeArray[curCell.cellX][curCell.cellY+1] !== undefined){
				nextCell = mazeArray[curCell.cellX][curCell.cellY+1];
				lowestNeighbor = nextCell;
			}			
			if(mazeArray[curCell.cellX+1] !== undefined){
				nextCell = mazeArray[curCell.cellX+1][curCell.cellY];
				if(nextCell.distanceFromStart < lowestNeighbor.distanceFromStart){
					lowestNeighbor = nextCell;
				}
			}			
			if(mazeArray[curCell.cellX][curCell.cellY-1] !== undefined){
				nextCell = mazeArray[curCell.cellX][curCell.cellY-1];
				if(nextCell.distanceFromStart < lowestNeighbor.distanceFromStart){
					lowestNeighbor = nextCell;
				}
			}			
			if(mazeArray[curCell.cellX-1] !== undefined){
				nextCell = mazeArray[curCell.cellX-1][curCell.cellY];
				if(nextCell.distanceFromStart < lowestNeighbor.distanceFromStart){
					lowestNeighbor = nextCell;
				}
			}

			// draw our path at each step
			ctx.beginPath();
			ctx.moveTo((curCell.cellX*30)+15,(curCell.cellY*30)+15);
			ctx.lineTo((lowestNeighbor.cellX*30)+15,(lowestNeighbor.cellY*30)+15);
			ctx.stroke();

			// check if we just reached start
			if(lowestNeighbor.start == 1){
				pathCompleted = true;
			}

			curCell = lowestNeighbor;

		}
		document.getElementById('lblMessage').innerHTML = 'Route found.';
	} else {
		document.getElementById('lblMessage').innerHTML = 'No valid route.';
	}
}

function checkNext(curCell, nextCell, searchQueue){
	if (nextCell == null){
		return;
	} else if (nextCell.blocked == 1){
		return;
	} else if (nextCell.distanceFromStart == 0 && nextCell.start == 0){
		nextCell.distanceFromStart = curCell.distanceFromStart+1;
		searchQueue.enqueue(nextCell);
		if(checkbox.checked){
			ctx.fillStyle = "#0000ff";
			ctx.fillText(nextCell.distanceFromStart,(nextCell.cellX*30)+15,(nextCell.cellY*30)+15)
		}		
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

slider.oninput = function densityUpdate(){
	density = this.value*0.1;
}
