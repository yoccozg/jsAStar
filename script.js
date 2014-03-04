$(document).ready(function()
{	
	generateTable(50,150);
});


function generateTable(w,h)
{

	var table = "";
	for(var i=0; i<w; i++)
	{
		console.log("ligne"+i);
		table += "<tr>";

		for(var j=0; j<h; j++)
		{
			table += "<td mur='0' class='case' id='line"+i+"-row"+j+"'></td>";
		}

		table += "</tr>";
	}

	$("#tab").append(table);
}