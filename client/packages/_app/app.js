angular.module('matchflow', ['angular-meteor', 'ui.router'])
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'client/partials/home.ng.html',
                    controller: 'HomeCtrl'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: '/client/partials/dashboard.ng.html',
                    controller: 'DashboardCtrl',
                    resolve: {
                        "currentUser": ["$meteor", function ($meteor) {
                            return $meteor.requireUser();
                        }]
                    }
                })
                .state('analyzer', {
                    url: '/analyzer',
                    templateUrl: '/client/partials/analyzer.ng.html',
                    controller: 'AnalyzerCtrl',
                    resolve: {
                        "currentUser": ["$meteor", function ($meteor) {
                            return $meteor.requireUser();
                        }]
                    }
                });
        $urlRouterProvider.otherwise('/home');
    }
]);