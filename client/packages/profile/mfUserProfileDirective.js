angular.module('matchflow').directive('mfUserProfile', ['$compile','rolesService',function($compile,rolesService) {
        return {
            scope: {
                localProfileData : '=profileData',
                localRolesData : '=rolesData'
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
                //basicInfo[2] = { id:'email', label:'Email' }; LOAD THIS LATER
                for (var i = 0; i < basicInfo.length; i++) {
                    var info = basicInfo[i];
                    content += '<div class="input-group">'+
                            '<span class="input-group-addon" id="'+info.id+'Label">'+
                                info.label+
                            '</span>'+ 
                            '<input type="text" class="form-control" placeholder="'+info.label+'" value="'+scope.localProfileData[info.id]+'" aria-describedby="'+info.id+'Label">'+
                        '</div>';
                }
                content += '<div class="dialog-info-text">Permissions:</div>';
                content += '<ul class="list-group">';
                if (scope.localRolesData !== undefined) {
                    for (var i = 0; i < scope.localRolesData.length; i++) {
                        var roleData = rolesService.getRoleDataFor(scope.localRolesData[i]);
                        // TODO accordion this, and add the description as well as activate/deactivate buttons
                        content += '<li class="list-group-item">'+roleData.label+'</li>';
                    }
                } else {
                    console.log('mfUserProfile: No permissions found');
                }
                content += '</ul>';
                element.html($compile(content)(scope.$parent));
            }            
        };
    }
]);