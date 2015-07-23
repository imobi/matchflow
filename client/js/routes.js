angular.module('matchflow').run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireUser promise is rejected
        // and redirect the user back to the main page
        if (error === 'AUTH_REQUIRED') {
            $state.go('home');
        }
    });
}]);

angular.module('matchflow').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
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
                    templateUrl: 'client/partials/dashboard.ng.html',
                    controller: 'DashboardCtrl',
                    resolve: {
                        'currentUser': ['$meteor', function ($meteor) {
                            return $meteor.requireUser();
                        }]
                    }
                })
                .state('analyzer', {
                    url: '/analyzer/:pid',
                    templateUrl: 'client/partials/analyzer.ng.html',
                    controller: 'AnalyzerCtrl',
                    resolve: {
                        'currentUser': ['$meteor', function ($meteor) {
                            return $meteor.requireUser();
                        }]
                    }
                });
        $urlRouterProvider.otherwise('/home');
    }
]);