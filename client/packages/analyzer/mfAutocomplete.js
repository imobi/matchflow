angular.module('matchflow').directive('mfAutocomplete', function($compile) {
	return {
		replace: true,
		scope: {
			labelName: '=label',
			autocompleteData: '=searchData',
			selectedGroups: '=ngModel',
            searchFieldName : '=searchField',
            keyFieldName : '=keyField'
		},
		restrict: 'E',
		template: '<div class="input-group mf-autocomplete-container">'+
					  '<span class="input-group-addon">{{ labelName }}</span>'+
					  '<input type="text" ng-model="searchValue" class="form-control" />'+
					  '<div class="mf-autocomplete-list" style="display:none;"></div>'+
					  '<div class="mf-autocomplete-selection-list">'+
						  '<ul class="mf-selected-list list-group"></ul>'+
					  '</div>'+
				  '</div>',
		link: function(scope, element, attrs) {
            var searchField = scope.searchFieldName !== undefined ? scope.searchFieldName : 'name';
            var keyField = scope.keyFieldName !== undefined ? scope.keyFieldName : 'name';
			scope.selectedGroupsMap = {};
			scope.searchValue = '';
			scope.updateToggle = false;
			scope.resultSelected = function(selectedKey) {
				// TODO add selected result to the selection box and clear the input area
				element.find('.mf-autocomplete-list').css('display','none');
				if (scope.selectedGroupsMap[selectedKey] === undefined) {
                    // BAD, need to fix this reference properly
					var actualGroup = scope.autocompleteData.groupMap[selectedKey];
					scope.selectedGroupsMap[selectedKey] = scope.selectedGroups.length;
					scope.selectedGroups[scope.selectedGroups.length] = actualGroup;
				}
				scope.searchValue = '';
			};
			scope.removeSelected = function(selectedKey) {
				scope.selectedGroups.splice(scope.selectedGroupsMap[selectedKey],1);
				scope.selectedGroupsMap[selectedKey] = undefined;
				// now run through remainder and update index's
				for (var s = 0; s < scope.selectedGroups.length; s++) {
					var group = scope.selectedGroups[s];
					scope.selectedGroupsMap[group[selectedKey]] = s;
				}
			};
			scope.$watch(
				'searchValue',
				function(newValue,oldValue) {
					var searchResults = '<ul class="list-group">';
					var matchFound = false;
					for (var i = 0; i < scope.autocompleteData.groupList.length; i++) {
						var result = scope.autocompleteData.groupList[i];
						if (result[searchField] !== undefined && result[searchField].indexOf(scope.searchValue)>=0) {
							matchFound = true;
							searchResults += '<li class="list-group-item"><a ng-click="resultSelected(\''+result[keyField]+'\')"><div class="mf-fully-clickable">'+result[searchField]+'</div></a></li>';
						}
					}
					if (!matchFound) {
						searchResults += '<li class="list-group-item">no matches found</li>';
					}
					
					searchResults += '</ul>';
					var width = element.find('input').outerWidth();
					element.find('.mf-autocomplete-list').html($compile(searchResults)(scope)).css('width',width+'px');
					if (newValue.length > 0) {
						element.find('.mf-autocomplete-list').css('display','block');
					} else {
						element.find('.mf-autocomplete-list').css('display','none');
					}
					
					
				}, 
				true
			);
			scope.$watch(
				'selectedGroups',
				function(newValue,oldValue) {
					var selectedGroups = '';
                    // TODO convert this to use a template
                    if (scope.selectedGroups !== undefined) {
                        for (var i = 0; i < scope.selectedGroups.length; i++) {
                            var group = scope.selectedGroups[i];
                            var description = '';
                            if (group.eventList !== undefined && group.eventList.length > 0) {
                                description = ' ['+group.eventList[0][searchField];
                                if (group.eventList.length > 1) {
                                    for (var j = 1; j < group.eventList.length; j++) {
                                        description+= ', '+group.eventList[j][searchField];
                                    }
                                }
                                description += ']';
                            }
                            selectedGroups += '<li class="list-group-item" style="position:relative; color:'+group.txtColor+'; background-color:'+group.bgColor+';">'+group[searchField]+''+description+'<a ng-click="removeSelected(\''+group[keyField]+'\')" class="mf-icon-border"><i class="glyphicon glyphicon-trash"></i></a></li>';
                        }
                    }
                    element.find('.mf-selected-list').html($compile(selectedGroups)(scope));
				}, 
				true
			);
		}
	};
});