angular.module('matchflow').directive('mfAutocomplete', function($compile) {
	return {
		replace: true,
		scope: {
			labelName: '=label',
			autocompleteData: '=searchData',
			selectedGroups: '=ngModel'
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
			scope.selectedGroupsMap = {};
			scope.searchValue = '';
			scope.updateToggle = false;
			scope.resultSelected = function(selectedName) {
				// TODO add selected result to the selection box and clear the input area
				element.find('.mf-autocomplete-list').css('display','none');
				if (scope.selectedGroupsMap[selectedName] === undefined) {
                    // BAD, need to fix this reference properly
					var actualGroup = scope.autocompleteData.groupMap[selectedName];
					scope.selectedGroupsMap[selectedName] = scope.selectedGroups.length;
					scope.selectedGroups[scope.selectedGroups.length] = actualGroup;
				}
				scope.searchValue = '';
			};
			scope.removeSelected = function(name) {
				scope.selectedGroups.splice(scope.selectedGroupsMap[name],1);
				scope.selectedGroupsMap[name] = undefined;
				// now run through remainder and update index's
				for (var s = 0; s < scope.selectedGroups.length; s++) {
					var group = scope.selectedGroups[s];
					scope.selectedGroupsMap[group.name] = s;
				}
			};
			scope.$watch(
				'searchValue',
				function(newValue,oldValue) {
					var searchResults = '<ul class="list-group">';
					
					var matchFound = false;
					for (var i = 0; i < scope.autocompleteData.groupList.length; i++) {
						var result = scope.autocompleteData.groupList[i];
						if (result.name !== undefined && result.name.indexOf(scope.searchValue)>=0) {
							matchFound = true;
							searchResults += '<li class="list-group-item"><a ng-click="resultSelected(\''+result.name+'\')"><div class="mf-fully-clickable">'+result.name+'</div></a></li>';
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
					for (var i = 0; i < scope.selectedGroups.length; i++) {
						var group = scope.selectedGroups[i];
						var eventNames = '';
						if (group.eventList.length > 0) {
							eventNames = group.eventList[0].name;
							if (group.eventList.length > 1) {
								for (var j = 1; j < group.eventList.length; j++) {
									eventNames += ', '+group.eventList[j].name;
								}
							}
						}
						selectedGroups += '<li class="list-group-item" style="position:relative; color:'+group.txtColor+'; background-color:'+group.bgColor+';">'+group.name+' ['+eventNames+']<a ng-click="removeSelected(\''+group.name+'\')" class="mf-icon-border"><i class="glyphicon glyphicon-trash"></i></a></li>';
					}
					element.find('.mf-selected-list').html($compile(selectedGroups)(scope));
				}, 
				true
			);
		}
	};
});