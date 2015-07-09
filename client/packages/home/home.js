angular.module('matchflow').controller('HomeCtrl', ['$scope','$meteor',
    function ($scope,$meteor) {
        $scope.login = function() {
            console.log('login called');
            // use meteor to login
            var userLogin = angular.element('#userLogin').val();
            var userPassword = angular.element('#userPassword').val();
            $meteor.loginWithPassword(userLogin,userPassword).then(function() {
                console.log('login success');
                // redirect to dashboard

                // close dialog
                angular.element('#signInModal').modal('hide');
            },function(err) {
                if (err === undefined) {
                    console.log('login success');
                    // redirect to dashboard

                    // close dialog
                    angular.element('#signInModal').modal('hide');
                } else {
                    // error logging in
                    console.log('login failed');
                }
            });
            // show login spinner, disable login form and buttons
        };
    }]
);