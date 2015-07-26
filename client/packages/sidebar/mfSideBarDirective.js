angular.module('matchflow').directive(
    'mfSideBar', ['$compile','rolesService',function($compile,rolesService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                config: '=sideBarConfig'
            },
            template: '<div></div>',
            link: function(scope,elem,attr) {
                scope.showManagerDialog = scope.config.onclick;
                var sideBarHtml = '<ul class="side-bar-container nav nav-pills nav-stacked">';
                if (scope.config !== undefined && scope.config.data !== undefined) {
                    for (var t = 0; t < scope.config.data.length; t++) {
                        var roleName = scope.config.data[t];
                        var roleData = rolesService.getRoleDataFor(roleName);
                        var tabId = roleData.id;
                        if (roleData.sideBar === true) {
                            sideBarHtml += '<li id="'+tabId+'" class="side-bar-tab '+tabId+'" ng-click="showManagerDialog(\''+tabId+'\');"><div class="rotate90">'+roleData.label+'</div></li>';
                        }
                    }
                } else {
                    console.log('mfSideBar: No Config Data Found');
                }
                sideBarHtml += '</ul>';
                elem.html($compile(sideBarHtml)(scope));
            }
        };
    }
]);