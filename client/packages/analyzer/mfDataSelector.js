angular.module('matchflow').directive('mfDataSelector', function($compile) {
	return {
		replace: true,
		scope: {
            title: '=',
			list: '=',
			selectedGroups: '=ngModel',
            searchFieldName : '=searchField',
            keyFieldName : '=keyField'
		},
		restrict: 'E',
		template: '<div class="panel panel-default">'+
                        '<div class="panel-heading">'+
                            '{{ title }} '+
                            '<input type="text" placeholder="filter" class="form-control" ng-model="objectFilter"/>'+
                        '</div>'+
                        '<div class="panel-body">'+
                            '<div ng-repeat="obj in list | filter:filterObjects" class="input-group">'+
                                '<span class="input-group-addon">'+
                                    '<input type="checkbox" aria-label="..." ng-model="obj.selected"/>'+
                                '</span>'+
                                '<input type="text" class="form-control" ng-style="{ color: obj.txtColor, backgroundColor: obj.bgColor }" aria-label="..." value="{{ obj[keyField] }}" readonly>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
		link: function(scope, element, attrs) {
            scope.getStyle = function() {
                console.log('test');
            };
            scope.searchField = scope.searchFieldName !== undefined ? scope.searchFieldName : 'name';
            scope.keyField = scope.keyFieldName !== undefined ? scope.keyFieldName : 'name';
            // the scope variable where the filter value is stored
            scope.objectFilter = '';
            // custom filter to filter the list of objects being displayed
            scope.filterObjects = function(obj) {
                if (scope.objectFilter.length > 0) {
                    return obj[scope.searchField].indexOf(scope.objectFilter) >= 0;
                } else {
                    return true;
                }
            };
            
            // watch the data for changes and update the selected list array
            scope.$watch('list',function() {
                // when the list changes, update the selected groups data
                var selectedGroups = [];
                for (var i = 0; i < scope.list.length; i++) {
                    if (scope.list[i].selected) {
                        selectedGroups[selectedGroups.length] = scope.list[i];
                    }
                }
                // setting this here passes the list back out to the rest of the application
                scope.selectedGroups = selectedGroups;
            },true);
		}
	};
});