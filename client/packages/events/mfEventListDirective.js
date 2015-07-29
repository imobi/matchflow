angular.module('matchflow').directive('mfEventList', function($compile) {
        return {
            scope: {
                localEventGroupData : '=eventGroupData'
            },
            replace: true,
            restrict: 'E',
            template: '<div></div>',
            link: function(scope, element) {
                var content = '' +
                    '<div class="form-inline">'+
                        '<div class="form-group">'+
                            '<input type="text" ng-model="manageEvents.eventGroupToAdd.name" class="form-control" style="width:180px;"/> '+
                            '<input type="text" placeholder="tag color" ng-model="manageEvents.eventGroupToAdd.bgColor" class="form-control" style="width:80px;"/> '+
                            '<input type="text" placeholder="text color" ng-model="manageEvents.eventGroupToAdd.txtColor" class="form-control" style="width:80px;"/> '+
                            '<button class="btn btn-sm btn-primary" ng-click="manageEvents.addEventGroup()"><i class="glyphicon small-inverted glyphicon-plus"></i></button>'+
                        '</div>'+
                    '</div>'+
                    '<div id="eventManagerGroups"></div>';
                element.html($compile(content)(scope.$parent));
                scope.$watch(
                    'localEventGroupData',
                    function(newList,oldList) {
                        if (newList !== undefined && oldList === undefined && newList.length===0 ||
                                newList !== undefined && oldList !== undefined && newList.length !== oldList.length) {
                            // only update if the length is different between the lists, not for every single edit
                            var groupHTML = '';
                            for (var i = 0; i < newList.length; i++) {
                                var eventGroup = newList[i];
                                groupHTML += '<div class="form-inline" style="margin-top:5px;">'+
                                               '<div class="form-group" style="width:100%;">'+
                                                   '<mf-event-group event-data="manageEvents.eventGroupMap[\''+eventGroup.id+'\']" event-group-id="'+eventGroup.id+'" event-group-name="'+eventGroup.name+'" event-group-index="'+i+'" event-group-text-color="'+eventGroup.txtColor+'" event-group-color="'+eventGroup.bgColor+'" />'+
                                               '</div>'+
                                           '</div>';
                            }
                            element.find('#eventManagerGroups').html($compile(groupHTML)(scope.$parent));
                        }
                    }, 
                    true
                );
            }
        };
    }
);