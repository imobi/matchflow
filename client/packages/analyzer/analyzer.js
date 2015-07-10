angular.module('matchflow').controller('AnalyzerCtrl', ['$scope','$meteor','$state',
    function ($scope,$meteor,$state) {
        $scope.logout = function() {
            $meteor.logout().then(function() {
                $state.go('home');
            },function(err) {
                $state.go('home');
                console.log('Error trying to logout');
            });
        };
    }]
);