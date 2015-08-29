// USES: typeahead - https://github.com/sergeyt/meteor-typeahead/
angular.module('matchflow').directive(
    'mfProjectSelector', ['$compile','$timeout','$location',function($compile,$timeout,$location) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                dialogToClose: '=dialog'
            },
            template: 
                '<div class="mf-search-input">'+
                    '<input '+
                        'type="text" '+
                        'class="form-control" ng-model="value" '+
                        'placeholder="enter project name" '+
                        'autocomplete="off" spellcheck="off" '+
                        'data-source="projects"/>'+
                '</div>',
            link: function(scope,elem,attr) {
                scope.value = '';
                var inputElem = elem.find('input');
                Meteor.typeahead(inputElem);
                elem.find('input').on('typeahead:selected',function(event,object) {
                    if (scope.dialogToClose !== undefined) {
                        // first close the dialog
                        angular.element('#'+scope.dialogToClose).modal('hide');
                    }
                    // now move to the new location after short timeout
                    $timeout(function() {
                        $location.path('/analyzer/'+object.id);
                        angular.element('html, body').animate({ scrollTop: 0 }, 'fast');
                    },300);
                });
            }
        };
    }]
);