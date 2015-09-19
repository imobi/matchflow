// USES: typeahead - https://github.com/sergeyt/meteor-typeahead/
angular.module('matchflow').directive(
    'mfSearch', ['$compile','searchService',function($compile,searchService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                searchDataLocal : '=searchData'
            },
            template: 
                '<div class="mf-search-input">'+
                    '<input '+
                        'id="sitesearch" type="text" '+
                        'class="form-control" ng-model="name" '+
                        'placeholder="search matchflow" '+
                        'autocomplete="off" spellcheck="off" '+
                        'data-source="searchdata"/><br>'+
                        '<ul><li ng-repeat="item in searchDataLocal">[{{ item._id }}:{{ item.timestamp }}] {{ item.name }} ({{ item.type }}) <button ng-click="removeSearchEntry(item._id)">X</button></li></ul>'+
                '</div>',
            link: function(scope,elem,attr) {
                /*
                 * Additional Functionality:
                 *  - predictive
                 *  - search more function > take to "search filter" page if clicked
                 *  - keyboard integration
                 */
                scope.name = '';
                // Test Function TOREMOVE
                scope.removeSearchEntry = function(_id) {
                    searchService.removeSearchEntry(_id);
                };
                var inputElem = elem.find('input');
                Meteor.typeahead(inputElem);
                elem.find('input').on('typeahead:selected',function(event,object) {
                    // TODO take user to the item to be followed
                    console.log('Take me to: '+object.name);
                });
            }
        };
    }
]);