angular.module('matchflow').controller('HomeCtrl', ['$scope','$meteor','$state','$timeout','userService',
    function ($scope,$meteor,$state,$timeout,userService) {
        // collapse the navbar on scroll
        angular.element(window).scroll(function() {
            if (angular.element('.home').length > 0) {
                if (angular.element('.home.navbar').offset().top > 50) {
                    angular.element('.home.navbar-fixed-top').addClass('top-nav-collapse');
                } else {
                    angular.element('.home.navbar-fixed-top').removeClass('top-nav-collapse');
                }
            }
        });

        angular.element('a.page-scroll').bind('click', function(event) {
            var $anchor = angular.element(this);
            angular.element('html, body').stop().animate({
                scrollTop: angular.element($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
        
        // Closes the Responsive Menu on Menu Item Click
        angular.element('.navbar-collapse ul li a').click(function() {
            angular.element('.navbar-toggle:visible').click();
        });
        
        angular.element('#signInModal').on('shown.bs.modal', function () {
            angular.element('#userLogin').focus();
        });
        
        $scope.login = function() {
            console.log('login called');
            // use meteor to login
            var userLogin = angular.element('#userLogin').val();
            var userPassword = angular.element('#userPassword').val();
            $meteor.loginWithPassword(userLogin,userPassword).then(function() {
                console.log('login success');
                userService.bindUserData();
                // close dialog
                angular.element('#signInModal').modal('hide');
                $timeout(function() {
                    // redirect to dashboard
                    $state.go('dashboard');
                },500);
            },function(err) {
                if (err === undefined) {
                    console.log('login success');
                    userService.bindUserData();
                    // redirect to dashboard
                    $state.go('dashboard');
                    // close dialog
                    angular.element('#signInModal').modal('hide');
                } else {
                    // error logging in
                    console.log('login failed',err);
                }
            });
            // show login spinner, disable login form and buttons
        };
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