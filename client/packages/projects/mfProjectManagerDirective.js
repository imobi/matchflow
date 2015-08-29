angular.module('matchflow').directive('mfProjectManager', ['$compile','$location','$timeout',function($compile,$location,$timeout) {
        return {
            replace: true,
            scope: {
                projectsLocal : '=projectData'
            },
            restrict: 'E',
            template: '<div class="mf-project-manager">'+
                    '<ul id="projectManagerList">'+
                        '<li>'+
                            '<a ng-click="openProject(\'new\');"><button class="btn btn-success btn-full">Create New Project</button></a>'+
                        '</li>'+
                        '<li ng-repeat="project in projectsLocal">'+
                            '<div class="panel-group" role="tablist" aria-multiselectable="false">'+
                                '<div class="panel panel-default">'+
                                    '<div class="panel-heading" role="tab" id="{{ project._id }}_heading">'+
                                        '<h4 class="panel-title" style="position:relative;">'+
                                            '<a role="button" data-toggle="collapse" data-parent="#projectManagerList" href="#collapse_{{ project._id }}" aria-expanded="false" aria-controls="collapse_{{ project._id }}">'+
                                                '{{ project.name }}'+
                                            '</a>'+
                                            '<a style="position:absolute; right:100px;" ng-click="openProject(project._id);">Open <span class="glyphicon glyphicon-open"></span></a>'+
                                            '<a style="position:absolute; right:0px;" ng-click="removeProject(project._id)">Delete <span class="glyphicon glyphicon-trash"></span></a>'+
                                        '</h4>'+
                                    '</div>'+
                                    '<div id="collapse_{{ project._id }}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="{{ project._id }}_heading">'+
                                        '<div class="panel-body">' +
                                            'Editable Project DATA'+
                                        '</div>'+
                                    '</div>'+ //collapse panel
                                '</div>'+ // panel
                            '</div>'+ // panel group
                        '</li>'+
                    '</ul>'+
                '</div>',
            link: function(scope, element, attrs) {
                scope.openProject = function(id) {
                    // first close the dialog
                    angular.element('#projectManagerDialog').modal('hide');
                    // now move to the new location after short timeout
                    $timeout(function() {
                        $location.path('/analyzer/'+id);
                        angular.element('html, body').animate({ scrollTop: 0 }, 'fast');
                    },300);
                };
                scope.removeProject = function(id) {
                    // TODO remove the project from the collection, first confirm? double tap to delete?
                };
            }
        };
    }
]);