/*
 *
 */
angular.module('matchflow').factory('shareGroupService',['$rootScope','$meteor','userService',function($rootScope,$meteor,userService){
    // return the aquired user data object here
    return {
        getShareGroups : function() {
            if (!userService.shareGroups) {
                userService.shareGroups = [];
            }
            return userService.shareGroups;
        },
        addShareGroup : function(group) {
            if (!userService.shareGroups) {
                userService.shareGroups = [];
            }
            // TODO shareGroup validation
            userService.shareGroups[userService.shareGroups.length] = group;
        }
    };
}]);