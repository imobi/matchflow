angular.module('matchflow').factory('userService',['$rootScope','$meteor',function($rootScope,$meteor){
    // return the aquired user data object here
    return {
        userDataObject: { empty: true },
            // load user object here after login
        bindUserData: function () {
            this.userDataObject = $meteor.object(Users,$rootScope.currentUser._id,true);
        },
        getCurrentUserData : function() {
            if (this.userDataObject.empty) {
                this.bindUserData();
            }
            // return a reference to the userDataObject
            return this.userDataObject;
        }
    };
}]);