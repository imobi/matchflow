angular.module('matchflow').directive('mfUserProfile', function($compile) {
        return {
            scope: {
                localProfileData : '=profileData'
            },
            replace: true,
            restrict: 'E',
            template: '<div></div>',
            link: function(scope, element) {
                var content = '';
                content += '<div class="dialog-info-text">Basic Info:</div>';
                var basicInfo = [];
                basicInfo[0] = { id:'firstName', label:'First Name' };
                basicInfo[1] = { id:'lastName', label:'Last Name' };
                basicInfo[2] = { id:'email', label:'Email' };
                for (var i = 0; i < basicInfo.length; i++) {
                    var info = basicInfo[i];
                    content += '<div class="input-group">'+
                            '<span class="input-group-addon" id="'+info.id+'Label">'+
                                info.label+
                            '</span>'+
                            '<input type="text" class="form-control" placeholder="'+info.label+'" ng-model="user.'+info.id+'" aria-describedby="'+info.id+'Label">'+
                        '</div>';
                }
                content += '<div class="dialog-info-text">Permissions:</div>';
                content += '<ul class="list-group">';
                for (var i = 0; i < scope.localProfileData.permissions.length; i++) {
                    var permObj = scope.localProfileData.permissions[i];
                    content += '<li class="list-group-item">'+permObj.name+'</li>';
                }
                content += '</ul>';
                element.html($compile(content)(scope.$parent));
            }            
        };
    }
);