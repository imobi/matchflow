angular.module('matchflow').directive('mfEventGroup', function($compile) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                localEventData : '=eventData'
            },
            template: '<div></div>',
            link: function(scope, element, attrs) {
                // only update if the length is different between the lists, not for every single edit
                var eventGroupContent = ''+
                    '<div class="panel-group" role="tablist" aria-multiselectable="true">'+
                        '<div class="panel panel-default">'+
                            '<div class="panel-heading" role="tab" id="'+attrs.eventGroupId+'_heading">'+
                                '<h4 class="panel-title" style="position:relative;">'+
                                    '<a role="button" data-toggle="collapse" href="#collapse_'+attrs.eventGroupId+'" aria-expanded="true" aria-controls="collapse_'+attrs.eventGroupId+'">'+
                                        attrs.eventGroupName+' (@'+attrs.eventGroupId+')'+
                                    '</a>'+
                                    '<a style="position:absolute; right:0px;" ng-click="manageEvents.removeEventGroup('+attrs.eventGroupIndex+')"><i class="glyphicon glyphicon-trash"></i></a>'+
                                '</h4>'+
                            '</div>'+
                            '<div id="collapse_'+attrs.eventGroupId+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="'+attrs.eventGroupId+'_heading">'+
                                '<div class="form-inline" style="margin-left:10px; margin-top:5px;">'+
                                    '<div class="form-group">'+
                                        '<input type="text" placeholder="name" ng-model="manageEvents.eventGroupMap[\''+attrs.eventGroupId+'\'].eventToAdd.name" class="form-control" style="width:180px;" /> '+
                                        '<input type="text" placeholder="before" ng-model="manageEvents.eventGroupMap[\''+attrs.eventGroupId+'\'].eventToAdd.before" class="form-control" style="width:80px;" /> '+
                                        '<input type="text" placeholder="after" ng-model="manageEvents.eventGroupMap[\''+attrs.eventGroupId+'\'].eventToAdd.after" class="form-control" style="width:80px;" /> '+
                                        '<button class="btn btn-round btn-sm btn-primary" ng-click="manageEvents.addEventToGroup(\''+attrs.eventGroupId+'\')"><i class="glyphicon small-inverted glyphicon-plus"></i></button>'+
                                    '</div>'+
                                '</div>'+
                                '<div id="'+attrs.eventGroupId+'" class="form-group" style="width:100%; padding-bottom: 5px;">'+
                                '</div>'+ // inline content
                            '</div>'+ //collapse panel
                        '</div>'+ // panel
                    '</div>'; // panel group
                scope.localEventList = scope.localEventData.eventList;
                element.html($compile(eventGroupContent)(scope.$parent));
                scope.$watch(
                    'localEventList',
                    function(newEventList) {
                        if (newEventList !== undefined) {
                            var eventsHTML = '';
                            // now populate the content
                            for (var i = 0; i < newEventList.length; i++) {
                                var eventData = newEventList[i];
                                eventsHTML += '<mf-event event-name="'+eventData.name+'" event-index="'+i+'" event-group-id="'+attrs.eventGroupId+'" event-before="'+eventData.before+'" event-after="'+eventData.after+'"  event-text-color="'+attrs.eventGroupTextColor+'" event-color="'+attrs.eventGroupColor+'"></mf-event>';
                            }
                            element.find('#'+attrs.eventGroupId).html($compile(eventsHTML)(scope.$parent));
                            
                        }
                    }, 
                    true
                );
            }
        };
    }
);