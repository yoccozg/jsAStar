$(document).ready(function()
{	
	//default values
	var w = 150, h = 50;

	$('#inputWalls').val('500');
	$('#startRow').val('3');
	$('#startLine').val('37');
	$('#endRow').val('149');
	$('#endLine').val('7');

	generateTable(w,h);

	$('#linkGen').click(function(){
		randomWalls(w,h);
	});

	$('#linkFindPath').click(function(){
		var startRow = $('#startRow').val();
		var startLine = $('#startLine').val();
		var endRow = $('#endRow').val();
		var endLine = $('#endLine').val();

		var start = {x: startRow, y: startLine};
		var end = {x: endRow, y: endLine};

		var path = findPath(start,end,w,h);

		if(path.length == 0)
		{
			alert("Aucun chemin possible !");
			return;
		}
			
		for(var i=0; i<path.length; i++)
		{
			var x = path[i].pos.x;
			var y = path[i].pos.y;
			$('#line' + x + '-row' + y).css({"background-color":"green"});
		}

		$('#line' + startLine + '-row' + startRow).css({"background-color":"blue"});
		$('#line' + endLine + '-row' + endRow).css({"background-color":"orange"});

	});

	$('.case').click(function(){
		//change case state
		var state = $(this).attr('isWall');

		if(state == 0)
		{
			$(this).attr('isWall',1);
			$(this).css({"background-color":"black"});
		}
		else
		{
			$(this).attr('isWall',0);
			$(this).css({"background-color":"blank"});
		}

	});
});


function generateTable(w,h)
{
	var table = "";
	for(var i=0; i<h; i++)
	{
		table += "<tr>";

		for(var j=0; j<w; j++)
		{
			table += "<td isWall='0' class='case' id='line"+i+"-row"+j+"'></td>";
		}

		table += "</tr>";	
	}

	$("#tab").append(table);
}

function randomWalls(w,h)
{
	//delete all walls
	$('.case').css({"background-color":"blank"});
	$('.case').attr('isWall','0');

	var nbWalls = $('#inputWalls').val();
	var startRow = $('#startRow').val();
	var startLine = $('#startLine').val();
	var endRow = $('#endRow').val();
	var endLine = $('#endLine').val();

	//set default value if no input
	if(nbWalls=="")
	{
		$('#inputWalls').val('500');
		nbWalls=500;
	}
		
		
	//console.log("Nb walls :" + nbWalls);
	
	for(i=0; i<nbWalls; i++)
	{
		line = Math.floor(Math.random()*h);
		row = Math.floor(Math.random()*w);

		//don't create wall on begin or end case
		if(! ((line == startLine && row == startRow) || (line == endLine && row == endRow)) )
		{
			//console.log('#line' + line + '-row' + row);
			$('#line' + line + '-row' + row).css({"background-color":"black"});
			$('#line' + line + '-row' + row).attr('isWall','1');
		}			

	}

		//define color for begin and end case
	$('#line' + startLine + '-row' + startRow).css({"background-color":"blue"});
	$('#line' + endLine + '-row' + endRow).css({"background-color":"orange"});
}

function findPath(startPos,endPos,w,h)
{
		//define the grid of nodes
		var grid = new Array(h);
		for(var i=0; i<h; i++)
		{	
			grid[i] = new Array(w);
			for(var j=0; j<w; j++)
			{
				//g = cost from start to this node
				//h = cost from this node to end
				//f = sum of previous costs 
				var cell = {
					isWall : 0,
					f: 0, 
					g: 0, 
					h: 0, 
					parent: null, 
					pos: {x:i, y:j}};

				if($('#line' + i + '-row' + j).attr('isWall') == "0")
					cell.isWall = 0;
				else
					cell.isWall = 1;
				grid[i][j] = cell;
			}	
		}

		var openList = [];
		var closedList = [];

		//console.log("Array : "+grid.length+","+grid[0].length);
		//console.log("Start : "+startPos.y+","+startPos.x);
		//console.log("End   : "+endPos.y+","+endPos.x);

		//define the start & the end nodes
		var startNode = grid[startPos.y][startPos.x];
		var end = grid[endPos.y][endPos.x];

		//begin with the start node
		openList.push(startNode);
 
		while(openList.length > 0) 
		{
			//search the lowest cost in the openList, become the current node
			var lowestCost = 0;
			for(var i=0; i<openList.length; i++) 
			{
				if(openList[i].f < openList[lowestCost].f)
					lowestCost = i;
			}
			var currentNode = openList[lowestCost];
 
			//if the lowest node is the end node, it's the end
			//just follow the parent links to come back to the start node
			if(currentNode.pos == end.pos) {
				var current = currentNode;
				var pathNodes = [];
				while(current.parent) {
					pathNodes.push(current);
					current = current.parent;
				}
				//the path we have is from end to start, reverse it
				return pathNodes.reverse();
			}
			//delete current node from openlist
			openList.splice(openList.indexOf(currentNode),1);
			//add it ti closed
			closedList.push(currentNode);

			//get the list of the neightbors (= all nodes arround if they're not out of the table)
			var neighbors = getNeighbors(grid, currentNode.pos);
 
 			//for each neightbor
			for(var i=0; i<neighbors.length;i++) 
			{
				var neighbor = neighbors[i];
				//if already in the closed list (= in process) or not a wall, skip
				if(closedList.indexOf(neighbor) != -1 || neighbor.isWall)
				{
					continue;	//skip : next for step
				}					

				var gScore = currentNode.g + 1;
				var gScoreIsBest = false; 
 
 				//the node is not in the open list : it's the first time we see it
				if(openList.indexOf(neighbor) == -1) 
				{ 
					//it's the best cost from start
					gScoreIsBest = true;
					neighbor.h = distance(neighbor.pos, end.pos);
					openList.push(neighbor);
				}
				//the node is already in open list but it had a better g
				else if(gScore < neighbor.g) 
				{
					gScoreIsBest = true;
				}
 
				if(gScoreIsBest) 
				{
					//we found the better neightbor
					neighbor.parent = currentNode;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
				}
			}
		}
 
		//return empty tab if no path was found
		return [];


}

function distance(pos1, pos2)
{
	//euclidian distance
	return Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y));
}

function getNeighbors(grid, posNode) {
	//return the 4 neightbors of a node if they're in the table
		var tab = [];
		var x = posNode.x;
		var y = posNode.y;
		
		if(grid[x-1] && grid[x-1][y]) {
			tab.push(grid[x-1][y]);
		}
		if(grid[x+1] && grid[x+1][y]) {
			tab.push(grid[x+1][y]);
		}
		if(grid[x][y-1] && grid[x][y-1]) {
			tab.push(grid[x][y-1]);
		}
		if(grid[x][y+1] && grid[x][y+1]) {
			tab.push(grid[x][y+1]);
		}
		return tab;
}