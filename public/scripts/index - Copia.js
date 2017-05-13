var app = angular.module('app', ['chart.js']);
var apiURL = "https://storage.scrapinghub.com/items/158119/1/110?apikey=a1690d124fb0421eb1cdba5a979fd9fc&format=json"

app.controller('RequireCtrl',  function ($http, $scope) {
	var arrData = new Array();
	var arrLabels = new Array();

	$http.get(apiURL).then(function(response) {
		response.data.forEach( function (stockPrice)
		{
			if(stockPrice.alerta == null){
				arrData.push(stockPrice.Cotação);
				arrLabels.push(stockPrice.stock[0]);
			}
		});

		// });

		$scope.data = [];
		$scope.labels = [];
		$scope.data.push(arrData.slice(0));

		for (var i = 0; i < arrLabels.length; i++) {
			$scope.labels.push(arrLabels[i]);
		}


	}, function(errResponse) {
		console.error("Get project request failed");
	});
	
	$scope.datasetOverride2 = {
		hoverBackgroundColor: ['#45b7cd', '#ff6384', '#ff8e72'],
		hoverBorderColor: ['#45b7cd', '#ff6384', '#ff8e72']
	};

	console.log("tes");

});

// app.controller('RequireCtrl', ['$scope', function ($scope, $http) {

// 	$http({
// 		method: 'GET',
// 		url: 'https://storage.scrapinghub.com/items/158119/1/110?apikey=a1690d124fb0421eb1cdba5a979fd9fc&format=json'
// 	}).then(function successCallback(response) {

// 		$scope.series = ['PETR4', 'VALE5'];
// 		$scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// 		$scope.data = [
// 		[65, 59, 80, 81, 56, 55, 40],
// 		[28, 48, 40, 19, 86, 27, 90]];
// 		$scope.options = {
// 			scales: {
// 				xAxes: [{
// 					type: 'linear',
// 					position: 'bottom'
// 				}]
// 			}
// 		};
// 	}, function errorCallback(response) {
//         //
//     });
// }]);

app.controller('OverrideCtrl', ['$scope', function ($scope) {
	'use strict';

	$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];



	$scope.labels2 = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	$scope.data2 = [350, 450, 100];
	$scope.datasetOverride2 = {
		hoverBackgroundColor: ['#45b7cd', '#ff6384', '#ff8e72'],
		hoverBorderColor: ['#45b7cd', '#ff6384', '#ff8e72']
	};
}]);




