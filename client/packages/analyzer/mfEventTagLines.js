angular.module('matchflow').directive('mfEventTagLines', function($interval) {
	return {
		scope: {
			timer: '=ngModel',
			tags: '=eventTagsToAdd',
			tagLineStatus: '=playStatus',
			totalDuration: '=videoDuration',
			tagLinesData: '=eventGroups'
		},
		template: '<div class="row mf-event-tag-line-container">' +
					  '<div id="tagNumbers" class="mf-event-tag-line-markers" style="width: {{ totalDuration }}px; margin-left: -{{ timer.timerPosition }}px;"></div>' +
					  '<div id="tagContainer" class="mf-event-tag-lines" style="height: {{ tagLinesData.length * 30 }}px; width: {{ totalDuration }}px; margin-left: -{{ timer.timerPosition }}px;"></div>' +
					  '<div class="mf-time-bar">{{tagLinesData.length}}</div>' +
				  '</div>',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attr) {
			// important variables:
			scope.stepper = scope.timer.timestamp / scope.timeModulater;
			scope.timeModulater = 1000; // move to timer
			scope.timerStep = 5; // move to timer
			scope.timer.timerPosition = 0;
            scope.groupMap = {};
			// we use interval to control the repetition
			var intervalID = $interval(function() {
				scope.timer.timestamp = new Date().getTime();
			},1);
			scope.killInterval = function() {
			  if (angular.isDefined(intervalID)) {
				$interval.cancel(intervalID);
				intervalID = undefined;
			  }
			};
			scope.$on('$destroy', function() {
				scope.killInterval();
			});
			// adding the numbers
			var toAdd = '';
			for (var i = 0; i < scope.totalDuration; i++) {
				if (i % 25 === 0) {
					toAdd += '<div class="mf-time-indicator" style="left:'+i+'px;">'+(i/5)+'</div>';
				}
			}
			angular.element('#tagNumbers').append(toAdd);
			scope.$watch(
				function () {
					scope.stepper = Math.trunc(scope.timer.timestamp / scope.timeModulater);
					return scope.stepper;
				},
				function(newVal,oldVal) {
					// need to offset against time to allow for pauses
					if (scope.timer.timerPosition <= scope.totalDuration && scope.tagLineStatus==='playing') {
						scope.timer.timerPosition += scope.timerStep;
					}
				},
				true
			);
            scope.$watch(
				'tagLinesData',
				function(newGroupsObject) {
                    scope.groupMap = {};
                    for (var g = 0; g < scope.tagLinesData.length; g++) {
                        var groupToAdd = scope.tagLinesData[g];
                        groupToAdd.index = g;
                        scope.groupMap[groupToAdd.name] = groupToAdd;
                    }
                },
                true
            );
			scope.$watch(
				'tags',
				function() {
					var tagHTML = '';
                    if (scope.tags !== undefined) {
                        // append the new tag (always the last one in the list)
                        for (var t = 0; t < scope.tags.length; t++) {
                            var tag = scope.tags[t];
                            var width = (Number(tag.before) + Number(tag.after))*5/1000;
                            var offset = (Number(tag.before)*5)/1000;
                            var position = tag.time;
                            var group = scope.groupMap[tag.category];
                            var top = 30*group.index;
                            // TODO need a tooltip with the tag name in it
                            // TODO need a mechanism to adjust before, end and position
                            tagHTML += '<div class="mf-event-tag-indicator" style="top:'+top+'px; left:'+position+'px; width:'+width+'px; margin-left:-'+offset+'px; background-color:'+group.bgColor+';"></div>';
                        }
                    }
					angular.element('#tagContainer').html(tagHTML);
				}, 
				true
			);
		}
	};
});