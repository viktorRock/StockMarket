var shubAPIURL = "https://storage.scrapinghub.com/items/158119/1/118?apikey=a1690d124fb0421eb1cdba5a979fd9fc&format=json";


// Load the Visualization API and the controls package.
google.charts.load('current', {'packages':['corechart', 'controls', 'charteditor']})

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

	// Create a dashboard.
	var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
	var wrap = new google.visualization.ChartWrapper();	
	var dataTable =  requestStockPrices();

	//Wrapper
	var wrap = new google.visualization.ChartWrapper({
		'chartType':'Table',
		'containerId':'chartDraw',
	});

	var options = {
		title: 'Wallet',
		// curveType: 'function',
		legend: { position: 'center' },
		is3D: true
	};
	wrap.setDataTable(dataTable);
	wrap.setOptions(options);
	//wrap.draw();

	// Range slider, passing some options
	var rangeSlider = new google.visualization.ControlWrapper({
		'controlType': 'CategoryFilter', //NumberRangeFilter
		'containerId': 'filter_div',
		'options': {
			'filterColumnLabel': 'stock'
		}
	});

	dashboard.bind(rangeSlider, wrap);
	dashboard.draw(dataTable);

	chartEditor = new google.visualization.ChartEditor();
	google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
	chartEditor.openDialog(wrap, {});
}

// On "OK" save the chart to a <div> on the page.
function redrawChart(){
	chartEditor.getChartWrapper().draw(document.getElementById('chartDraw'));
}


function getStocksDataTable(in_jsonData){

	var jsonArray  = JSON.parse(in_jsonData);
	var dataTable = new google.visualization.DataTable({
		cols: [
			// {id: '_type', label: '_type', type: 'string'},
			{id: 'dataHora', label: 'Data/Hora', type: 'string'},
			{id: 'cotacao', label: 'Cotação', type: 'number'},
			{id: 'volume', label: 'Volume', type: 'number'},
			{id: 'minima', label: 'Mínima', type: 'number'},
			{id: 'variacaoPCT', label: 'Variação (%)', type: 'number'},
			{id: 'maxima', label: 'Máxima', type: 'number'},
			{id: 'variacao', label: 'Variação', type: 'number'},
			{id: 'stock', label: 'stock', type: 'string'}
		],rows: [// {c:[{v:"dict"},	{v:"08/05/2017"},{v:"26,03" },{v:"4.542.300"},{v:"25,43"},{v:"-0,08"},{v:"26,15"},{v:"-0,02"},{v:"['VALE3.SA']"}]}
		]
	},'current');

	dataTable.addRows(formatInputArray(jsonArray));

	return dataTable;
}

function formatInputArray(inputArray){

	var data = new Array();

	inputArray.forEach( function (stockPrice)
	{
		if(stockPrice.alerta == null){
			data.push([
				(stockPrice["Data/Hora"]),
				Number(stockPrice["Cotação"].replace(".","").replace(",",".")),
				Number(stockPrice["Volume"].replace(".","").replace(",",".")),
				Number(stockPrice["Mínima"].replace(".","").replace(",",".")),
				Number(stockPrice["Variação (%)"].replace(".","").replace(",",".")),
				Number(stockPrice["Máxima"].replace(".","").replace(",",".")),
				Number(stockPrice["Variação"].replace(".","").replace(",",".")),
				stockPrice["stock"].replace("[","").replace("]","").replace("'","").replace("'","")
				]);
		}
	});

	return data;
}

function requestStockPrices(){
	var stocks;

	var jsonData = $.ajax({
		url: shubAPIURL,
		dataType: "json",
		async: false
	}).responseText;

	return getStocksDataTable(jsonData);
}


function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}
}
