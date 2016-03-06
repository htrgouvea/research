var app = angular.module("bigbang", ['chart.js']);

app.controller("baseSecretariasCtrl", function($scope, $http) {
	$http({
    	method: 'GET',
   		url: 'https://api.myjson.com/bins/42j7x',
  	}).then (function sucessCallback(response) {
  		console.log("response", response);
    	$scope.secretarias = response.data;
  	}), function errorCallback(response) {
    	$scope.secretarias = 'Não foi possivel carregar as secretarias.';
  	}
});