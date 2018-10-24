var mazeSize = 20;
var density = 0.1;
var maze = [];
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var slider = document.getElementById("myRange");


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
			}
		}
	}
}

function mazeDraw(maze) {


	for (var i = 0; i < mazeSize; i++) {
		for (var j = 0; j < mazeSize; j++) {
			if(maze[i][j] === 'Blocked'){
				ctx.fillStyle = "#000000"; 
				ctx.fillRect(i*30,j*30,30,30)
			}
			if(maze[i][j] === 'Empty'){
				ctx.fillStyle = "#808080"; 
				ctx.fillRect(i*30,j*30,30,30)
			}
		}
	}
}

slider.oninput = function densityUpdate(){
	density = this.value*0.1;
}