/*
 * tab object:
 *  - name
 *  - filter
 */
angular.module('matchflow').factory('tabService',['$rootScope','$meteor','userService',function($rootScope,$meteor,userService){
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
            var userDataObject = userService.getCurrentUserData();
            if (!userDataObject.tabs) {
                userDataObject.tabs = [];
            }
            // TODO tab validation
            userDataObject.tabs[userDataObject.tabs.length] = {
                name: name,
                filter: filter
            };
        },
        removeTab : function(_id) {
            // run through all tabs and remove the one
        }
    };
}]);