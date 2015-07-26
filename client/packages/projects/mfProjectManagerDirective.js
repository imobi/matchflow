angular.module('matchflow').directive('mfProjectManager', function($compile) {
        return {
            replace: true,
            scope: true,
            restrict: 'E',
            template: '<div></div>',
            link: function(scope, element, attrs) {
                var contentHTML = '';
                // add the list of projects and their edit/remove buttons
                // clicking on a project must open the project in the analyzer
                element.html($compile(contentHTML)(scope));
            }
        };
    }
);