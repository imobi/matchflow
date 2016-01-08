angular.module('matchflow').directive('mfEventTagArea', function($compile) {
	return {
		scope: {
			localData : '=eventGroupData'
		},
		template: '<div class="container-fluid"></div>',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attrs) {
			scope.addThisToTagLine = function(row,col) {
				var groupObj = scope.localData[row];
				var tagObj = groupObj.eventList[col];
				scope.$parent.addTagToTagLine(tagObj,groupObj);
			};
			scope.testT = 'what the hell';
			scope.$watch(
				'localData',
				function(newVal,oldVal) {
					var contentHTML = '';
                    if (scope.localData !== undefined) {
                        for (var r = 0; r < scope.localData.length; r++) {
                            contentHTML += '<div class="row mf-event-tag-container">';
                            var group = scope.localData[r];
                            contentHTML += '<div class="mf-event-group-title" style="color:'+group.bgColor+';">'+group.name+'</div>';
                            for (var c = 0; c < group.eventList.length; c++) {
                                var event = group.eventList[c];
                                contentHTML += '<div class="col-lg-2"><div ng-click="addThisToTagLine('+r+','+c+')" class="mf-event-tag" style="background-color:'+group.bgColor+'; color:'+group.txtColor+';">['+event.before+'] '+event.name+' ['+event.after+']</div></div>';
                            }
                            contentHTML += '</div>';
                        }
                    }
					element.html($compile(contentHTML)(scope));
				},
				true
			);
		}            
	};
});