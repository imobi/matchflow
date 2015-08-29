// USES: typeahead - https://github.com/sergeyt/meteor-typeahead/
angular.module('matchflow').directive(
    'mfSearch', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: 
                '<div class="mf-search-input">'+
                    '<input '+
                        'id="sitesearch" type="text" '+
                        'class="form-control" ng-model="value" '+
                        'placeholder="search matchflow" '+
                        'autocomplete="off" spellcheck="off" '+
                        'data-source="projects"/>'+ // TODO swap this to a search collection
                '</div>',
            link: function(scope,elem,attr) {
                scope.value = '';
                var inputElem = elem.find('input');
                Meteor.typeahead(inputElem);
                elem.find('input').on('typeahead:selected',function(event,object) {
                    // TODO take user to the item to be followed
                    console.log('Take me to: '+object.value);
                });
            }
        };
    }
);