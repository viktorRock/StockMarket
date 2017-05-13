var apiURL = "https://storage.scrapinghub.com/items/158119/1/110?apikey=a1690d124fb0421eb1cdba5a979fd9fc&format=json"

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var data = google.visualization.arrayToDataTable([
		['Year', 'Sales', 'Expenses'],
		['2004',  1000,      400],
		['2005',  1170,      460],
		['2006',  660,       1120],
		['2007',  1030,      540]
		]);

	var options = {
		title: 'Wallet',
		// curveType: 'function',
		legend: { position: 'bottom' },
		is3D: true
	};

	var chart = new google.visualization.LineChart(document.getElementById('line_chart'));

	chart.draw(data, options)
}


function handleQueryResponse(response) {

	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

	var options = {
		title: 'Wallet Performance',
		// curveType: 'function',
		legend: { position: 'bottom' },
		width: 400, 
		height: 240, 
		is3D: true
	};

	var chart = new google.visualization.LineChart(document.getElementById('line_chart'));

	chart.draw(data, options);

  // chart.draw(data);
}


// function drawChart() {
// 	var data = google.visualization.arrayToDataTable([
// 		['Year', 'Sales', 'Expenses'],
// 		['2004',  1000,      400],
// 		['2005',  1170,      460],
// 		['2006',  660,       1120],
// 		['2007',  1030,      540]
// 		]);

// 	var options = {
// 		title: 'Wallet',
// 		// curveType: 'function',
// 		legend: { position: 'bottom' },
// 		is3D: true
// 	};

// 	var chart = new google.visualization.LineChart(document.getElementById('line_chart'));

// 	chart.draw(data, options)
// }