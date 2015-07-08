var app = angular.module('socially',['angular-meteor','ui.router']);
app.controller('PartiesListCtrl', ['$scope','$meteor', function ($scope,$meteor) {
	$scope.parties = $meteor.collection(Parties);

	//Function to add party to parties array
$scope.addParty = function() {
	$scope.parties.push({'name':$scope.newParty.name,'description':$scope.newParty.description});
	$scope.newParty = {};
}

}]);
