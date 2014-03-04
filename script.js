$(document).ready(function()
{	
	var w = 150, h = 50;

	generateTable(w,h);

	$('#linkGen').click(function(){
		randomWalls(w,h);
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
	$('.case').css({"background-color":"blank"});
	$('.case').attr('isWall','0');
	var nbWalls = $('#inputWalls').val();
	if(nbWalls=="")
	{
		$('#inputWalls').val('50');
		nbWalls=50;
	}
		
		
	//console.log("Nb walls :" + nbWalls);
	
	for(i=0; i<nbWalls; i++)
	{
		line = Math.floor(Math.random()*h);
		row = Math.floor(Math.random()*w);
		
		//console.log('#line' + line + '-row' + row);
		$('#line' + line + '-row' + row).css({"background-color":"black"});
		$('#line' + line + '-row' + row).attr('isWall','1');
	}

}