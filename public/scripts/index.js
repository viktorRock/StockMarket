var shubAPIURL = "https://storage.scrapinghub.com/items/158119/1/143?apikey=a1690d124fb0421eb1cdba5a979fd9fc&format=json";
// Load the Visualization API and the controls package.
google.charts.load('current', {'packages':['table','line','charteditor','corechart'],'language': 'pt'})
//google.charts.load('current', {'packages':['corechart', 'controls', 'charteditor']})
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

var chartEditor = null;
var chartEditorElement = null;
var chartWrapper = null; 
var dashboard = null;
var categoryFilter = null;
var stocksArray = null;
var varArray = null;
var pricesArray = null;

function drawChart() {

	// Create a dashboard.
	var dataTable =  getStocksDataTable();
	dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
	// dataTable.sort([{'column': 0}]);
	chartEditorElement = document.getElementById('chartEditor_div');

	// Create a view
	var dataView = new google.visualization.DataView(dataTable);
	dataView.setColumns([0, 4]);

	//Wrapper
	chartWrapper = new google.visualization.ChartWrapper({
		'chartType':'Table',
		'containerId':'stocksTable'
		// 'view': {'columns': [0,4,7]}
	});

	var options = {
		title: 'Wallet',
		legend: { position: 'center' },
		// is3D: true,
		allowHtml: "true",
		pageSize: 10,
		sortColumn: 0,
		sortAscending: false
	};
	chartWrapper.setOptions(options);

	// Range slider, passing some options
	categoryFilter = new google.visualization.ControlWrapper({
		'controlType': 'CategoryFilter', //NumberRangeFilter
		'containerId': 'filter_div',
		'options': {
			'filterColumnLabel': 'stock'
		}
	});

	dashboard.bind(categoryFilter, chartWrapper);
	dashboard.draw(dataTable);

	var lineChart = new google.visualization.LineChart(chartEditorElement);

	var lineoptions = {
		title: 'Wallet',
		legend: { position: 'center' },
		// is3D: true,
		allowHtml: "true",
		 // Allow multiple
		 // simultaneous selections.
		selectionMode: 'multiple',
		 // Trigger tooltips
		 // on selections.
		tooltip: {trigger: 'selection'},
		 // Group selections
		 // by x-value.
		aggregationTarget: 'category'
	};
	lineChart.draw(dataView,lineoptions);


	// chartEditor = new google.visualization.ChartEditor();
	// google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
	// chartEditor.openDialog(chartWrapper, {});	
}

document.getElementById('pageSize-select').onchange = function() {
	chartWrapper.setOptions('pageSize',this.value);
	// chartWrapper.draw();
	dashboard.draw(chartWrapper.getDataTable());
};

// On "OK" save the chart to a <div> on the page.
function redrawChart(){
	chartEditor.getChartWrapper().draw(chartEditorElement);
}

function loadEditor(){
	chartEditor.openDialog(chartWrapper, {});
}

function getStocksDataTable(){
	var jsonResponse = requestStockPrices();

	if (jsonResponse == null){
		jsonResponse = '[{"_type":"dict","Data/Hora":"31/05/2017","Cotação":"27,17","Volume":"9.430.500","Mínima":"26,87","Variação (%)":"-5,00","Máxima":"28,27","Variação":"-1,43","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"30/05/2017","Cotação":"28,60","Volume":"3.071.000","Mínima":"27,92","Variação (%)":"1,92","Máxima":"28,90","Variação":"0,54","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"29/05/2017","Cotação":"28,06","Volume":"2.945.800","Mínima":"27,58","Variação (%)":"0,72","Máxima":"28,75","Variação":"0,20","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"26/05/2017","Cotação":"27,86","Volume":"2.956.900","Mínima":"27,33","Variação (%)":"0,58","Máxima":"27,92","Variação":"0,16","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"25/05/2017","Cotação":"27,70","Volume":"3.993.000","Mínima":"27,15","Variação (%)":"0,65","Máxima":"27,94","Variação":"0,18","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"24/05/2017","Cotação":"27,52","Volume":"4.307.700","Mínima":"27,27","Variação (%)":"-2,62","Máxima":"28,13","Variação":"-0,74","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"23/05/2017","Cotação":"28,26","Volume":"5.402.600","Mínima":"27,16","Variação (%)":"1,22","Máxima":"28,36","Variação":"0,34","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"22/05/2017","Cotação":"27,92","Volume":"7.974.200","Mínima":"26,92","Variação (%)":"2,46","Máxima":"28,17","Variação":"0,67","stock":"[\'VALE3.SA\']"},{"_type":"dict","Data/Hora":"19/05/2017","Cotação":"27,25","Volume":"6.487.500","Mínima":"27,00","Variação (%)":"1,45","Máxima":"27,97","Variação":"0,39","stock":"[\'VALE3.SA\']"}]';
	}

	var jsonArray  = JSON.parse(jsonResponse);
	pricesArray = formatInputArray(jsonArray);

	var dataTable = new google.visualization.DataTable({
		cols: [
		{id: 'dataHora', label: 'Data/Hora', type: 'date'},
		{id: 'cotacao', label: 'Cotação', type: 'number'},
		{id: 'volume', label: 'Volume', type: 'number'},
		{id: 'minima', label: 'Mínima', type: 'number'},
		{id: 'variacaoPCT', label: 'Variação (%)', type: 'number'},
		{id: 'maxima', label: 'Máxima', type: 'number'},
		{id: 'variacao', label: 'Variação', type: 'number'},
		{id: 'stock', label: 'stock', type: 'string'}
		],rows: []
	},'current');

	dataTable.addRows(pricesArray);

	return dataTable;
}

function formatResponseData(inputArray){

	var data = new Array();
	var auxArray = new Array();
	inputArray.forEach( function (stockPrice)
	{

		if(stockPrice.alerta == null){
			
			if(stocksArray[stockPrice["stock"]] == null){
				stocksArray[stockPrice["stock"]] = stock.length;
			}

			var strDate = stockPrice["Data/Hora"].split("/");
			var currDate = new Date(strDate[2],strDate[1] -1 ,strDate[0])

			auxArray[0] = currDate;
			auxArray[1] = stockPrice["Cotação"].replace(".","").replace(",",".");

			data.push([
				currDate,
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

function formatInputArray(inputArray){

	var data = new Array();

	inputArray.forEach( function (stockPrice)
	{
		if(stockPrice.alerta == null){
			var strDate = stockPrice["Data/Hora"].split("/");
			var currDate = new Date(strDate[2],strDate[1] -1 ,strDate[0])
			data.push([
				currDate,
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

	return (jsonData);
}

function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}
}
