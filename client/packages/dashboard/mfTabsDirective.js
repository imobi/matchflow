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
                var windowHeight = angular.element(window).outerHeight();
                elem.css('minHeight',windowHeight);
                var tabsNavHtml = '<ul class="nav nav-tabs" role="tablist">';
                var tabsContentHtml = '<div class="tab-content">';
                for (var t = 0; t < scope.tabs.length; t++) {
                    var tab = scope.tabs[t];
                    var animationCSS = ' fade';
                    var defaultTab = '';
                    if (t === 0) {
                        animationCSS = ' fade in active';
                        defaultTab = ' class="active"';
                    }
                    tabsNavHtml += '<li id="'+tab.id+'_tab" role="presentation"'+defaultTab+'><a href="#'+tab.id+'" aria-controls="settings" role="tab" data-toggle="tab">'+tab.name+'</a></li>';
                    tabsContentHtml += '<div id="'+tab.id+'" role="tabpanel" class="mf-tab-container tab-pane'+animationCSS+'">'+
                        '<mf-tab-feed feed-filter="\''+tab.filter+'\'"></mf-tab-feed>' +
                    '</div>';
                }
                tabsNavHtml += '</ul>';
                tabsContentHtml += '</div>';
                elem.html($compile(tabsNavHtml+tabsContentHtml)(scope));
            }
        };
    }
);