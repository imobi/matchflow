angular.module('matchflow').directive('mfEvent', function($compile) {
        return {
            replace: true,
            scope: true,
            restrict: 'E',
            template: '<div class="mf-event draggable"></div>',
            link: function(scope, element, attrs) {
                scope.removeEvent = function() {
                    scope.manageEvents.removeEventFromGroup(attrs.eventGroupId, attrs.eventIndex);
                };
                scope.addEvent = function() {
                    //scope.manageEvents.addEventTagToEventTagLine(scope.id);
                };
                var content = '<div ng-click="addEvent()" class="mf-event-selector" style="color:'+attrs.eventTextColor+'; background-color:'+attrs.eventColor+';">'+
                                  attrs.eventName+
                                  '<a ng-click="removeEvent()" style="position:absolute; right:10px;">'+
                                      '<i class="glyphicon glyphicon-trash"></i>'+
                                  '</a>'+
                              '</div>';
                element.html($compile(content)(scope));
            }
        };
    }
);