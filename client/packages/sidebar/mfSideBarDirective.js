angular.module('matchflow').directive(
    'mfSideBar', function($compile) {
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
                for (var t = 0; t < scope.config.data.length; t++) {
                    var tab = scope.config.data[t];
                    sideBarHtml += '<li id="'+tab.id+'" class="side-bar-tab '+tab.id+'" ng-click="showManagerDialog(\''+tab.id+'\');"><div class="rotate90">'+tab.name+'</div></li>';
                }
                sideBarHtml += '</ul>';
                elem.html($compile(sideBarHtml)(scope));
            }
        };
    }
);