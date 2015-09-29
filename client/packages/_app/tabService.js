/*
 * tab object:
 *  - name
 *  - filter
 */
angular.module('matchflow').factory('tabService',['$rootScope','$meteor','utilsService','userService',function($rootScope,$meteor,utilsService,userService){
    // return the aquired user data object here
    return {
        getTabs : function() {
            var userDataObject = userService.getCurrentUserData();
            if (!userDataObject.tabs) {
                userDataObject.tabs = [];
            }
            return userDataObject.tabs;
        },
        addTab : function(name,filter) {
            var tabs = this.getTabs();
            // TODO tab validation
            
            // TODO convert the filter into a criteria
            
            tabs[tabs.length] = {
                id: utilsService.idify(name),
                name: name,
                filter: filter
            };
        },
        getTabFilter : function(id) {
            var found = false;
            var filterObj = {};
            if (id !== 'public') {
                // search tabs for this tab and return its filter
                var tabsToCheck = this.getTabs();
                for (var t = 0; t < tabsToCheck.length && !found; t++) {
                    if (tabsToCheck[t].id === id) {
                        found = true;
                        filterObj = tabsToCheck.filter;
                    }
                }
            }

            if (found && filterObj) {
                return filterObj;
            } else {
                // public query
                return {};
            }
        },
        removeTab : function(id,name) {
            var tabs = this.getTabs();
            if (tabs && tabs.length > 0) {
                // run through all tabs and remove the one
                for (var i = 0, found = false; i < tabs.length && !found; i++) {
                    var tab = tabs[i];
                    // TEMP remove any tabs without an ID TOREMOVE
                    if (tab.name === name || tab.id === id) {
                        // remove the tab here (using John Resig's remove function)
                        tabs.remove(i);
                        found = true;
                    }
                }
            }
        }
    };
}]);