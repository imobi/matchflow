angular.module('matchflow').factory('userService',['$rootScope','$meteor',function($rootScope,$meteor){
    
    // return the aquired user data object here
    var userDataObject;
    return {
            // load user object here after login
        bindUserData: function () {
            userDataObject = $meteor.object(Users,$rootScope.currentUser._id,true);
        },
        getCurrentUserData : function() { 
            // return a reference to the userDataObject
            return userDataObject;
        }
    };
}]);