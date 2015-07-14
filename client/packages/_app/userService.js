angular.module('matchflow').factory('userService',['$meteor',function($meteor){
    // TODO load user object here after login
    var userDataObject = {
        id: 'default-user',
        firstName: 'Default',
        lastName: 'User',
        email: 'defaulty@email.com',
        password: '123',
        loginTime: 0,
        leagueList: [],
        teamList: [],
        eventGroupList: [],
        projectList: [],
        feedList: [
            {
                id: 'tab1',
                name: 'TAB 1',
                filter: ''
            },
            {
                id: 'tab2',
                name: 'TAB 2',
                filter: ''
            }
        ],
        notes: [
            {
                id: 'note1',
                name: 'NOTE 1',
                type: 'standard',
                action: ''
            },
            {
                id: 'note2',
                name: 'NOTE 2',
                type: 'info',
                action: ''
            },
            {
                id: 'note3',
                name: 'NOTE 3',
                type: 'success',
                action: ''
            },
            {
                id: 'note4',
                name: 'NOTE 4',
                type: 'critical',
                action: ''
            },
            {
                id: 'note5',
                name: 'NOTE 5',
                type: 'warning',
                action: ''
            }
        ],
        permissions: [
            { // default, everyone should have this
                id: 'profileManager',
                name: 'Profile Manager'
            },
            {
                id: 'eventManager',
                name: 'Event Manager'
            },
            {
                id: 'leagueManager',
                name: 'League Manager'
            },
            {
                id: 'reportManager',
                name: 'Report Manager'
            },
            {
                id: 'subscriptionManager',
                name: 'Subscription Manager'
            },
            {
                id: 'teamManager',
                name: 'Team Manager'
            }
        ]
    };
    // return the aquired user data object here
    return {
        getCurrentUserData : function() { 
            // return a reference to the userDataObject
            return userDataObject;
        }
    };
}]);