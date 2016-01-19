angular.module('matchflow').directive('mfEventTagArea', ['$compile','modalDialogService','videoPlayerService',function($compile,modalDialogService,videoPlayerService) {
	return {
		scope: {
			localData : '=eventGroupData',
            activeDialogKey : '=',
            playerId: '='
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
            scope.openDescriptionDialog = function(row,col) {
                var player = videoPlayerService.getPlayer(scope.playerId);
                if (player.status === videoPlayerService.state.PLAYING) {
                    var activeDialogKey = 'tagDesc_'+row+'_'+col;
                    var callbackData = {
                        'data' : {
                            'row': row,
                            'col': col
                        },
                        'open':function(){
                            videoPlayerService.pause(scope.playerId);
                            scope.activeDialogKey = activeDialogKey;
                        },
                        'save':function(data){
                            scope.activeDialogKey = '';
                            scope.addThisToTagLine(data.row,data.col);
                            videoPlayerService.play(scope.playerId);
                        },
                        'cancel':function(){
                            scope.activeDialogKey = '';
                            videoPlayerService.play(scope.playerId);
                        }
                    };
                    modalDialogService.open('tagDescription',activeDialogKey,callbackData);
                } // TODO else tell user they need to be playing before they can assign a tag
            };
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
                                contentHTML += '<div class="col-lg-2"><div ng-click="openDescriptionDialog('+r+','+c+')" class="mf-event-tag" style="background-color:'+group.bgColor+'; color:'+group.txtColor+';">['+event.before+'] '+event.name+' ['+event.after+']</div></div>';
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
}]);