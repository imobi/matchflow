angular.module('matchflow').factory('userService',['$rootScope','$meteor',function($rootScope,$meteor){
    // return the aquired user data object here
    return {
        _userDataObject: { empty: true },
            // load user object here after login
        bindUserData: function () {
            this._userDataObject = $meteor.object(Users,$rootScope.currentUser._id,true).subscribe('users');
        },
        getCurrentUserData : function() {
            if (this._userDataObject.empty) {
                this.bindUserData();
            }
            // return a reference to the userDataObject
            return this._userDataObject;
        }
    };
}]);