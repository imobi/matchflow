angular.module('matchflow').directive(
    'mfTabs', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                tabs: '=tabData'
            },
            template: '<div role="tabpanel">TABS</div>',
            link: function(scope,elem,attr) {
                scope.openManageFilterTab = function() {
                    angular.element('#tabFilterDialog').modal('show');
                };
                // TODO remove
                var windowHeight = angular.element(window).outerHeight();
                elem.css('minHeight',windowHeight);
                
                scope.$watch('tabs',function() {
                    var tabsNavHtml = '<ul class="nav nav-tabs" role="tablist">';
                    var tabsContentHtml = '<div class="tab-content">';
                    // add the public tab by default
                    tabsNavHtml += '<li id="public_tab" role="presentation" class="active"><a href="#public" aria-controls="settings" role="tab" data-toggle="tab">Public Feed</a></li>';
                    tabsContentHtml += '<div id="public" role="tabpanel" class="mf-tab-container tab-pane fade in active">'+
                        '<mf-tab-feed tab-id="\'public\'"></mf-tab-feed>' +
                    '</div>';
                    if (scope.tabs !== undefined) {
                        // add persons custom tabs
                        for (var t = 0; t < scope.tabs.length; t++) {
                            var tab = scope.tabs[t];
                            var animationCSS = ' fade';
                            tabsNavHtml += '<li id="'+tab.id+'_tab" role="presentation"><a href="#'+tab.id+'" aria-controls="settings" role="tab" data-toggle="tab">'+tab.name+'</a></li>';
                            tabsContentHtml += '<div id="'+tab.id+'" role="tabpanel" class="mf-tab-container tab-pane">'+
                                '<mf-tab-feed tab-id="\''+tab.id+'\'"></mf-tab-feed>' +
                            '</div>';
                        }
                    }
                    // add the tabs settings button
                    tabsNavHtml += '<li id="add_tab"><a ng-click="openManageFilterTab();" aria-controls="settings" role="tab"><span class="glyphicon glyphicon-th-list"></span></a></li>';
                    tabsNavHtml += '</ul>';
                    tabsContentHtml += '</div>';
                    elem.html($compile(tabsNavHtml+tabsContentHtml)(scope));
                },true);
            }
        };
    }
);