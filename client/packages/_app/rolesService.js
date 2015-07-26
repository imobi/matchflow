angular.module('matchflow').factory('rolesService', ['$meteor',function($meteor){
    return {
        _roleData : {
            'admin-manager' : {
                id: 'admin',
                label: 'Admin',
                sideBar : false,
                description: ''
            },
            'profile-manager' : {
                id: 'profileManager',
                label: 'Profile',
                sideBar : true,
                description: ''
            },
            'analyzer-only' : {
                id: 'analyzer',
                label: 'Analyzer (single)',
                sideBar : false,
                description: ''
            },
            'analyzer-full' : {
                id: 'analyzer',
                label: 'Analyzer (full)',
                sideBar : false,
                description: ''
            },
            'eventgroups-manager' : {
                id: 'eventManager',
                label: 'Events',
                sideBar : true,
                description: ''
            },
            'project-manager' : {
                id: 'projectManager',
                label: 'Projects',
                sideBar : true,
                description: ''
            },
            'league-manager' : {
                id: 'leagueManager',
                label: 'Leagues',
                sideBar : true,
                description: ''
            },
            'team-manager' : {
                id: 'teamManager',
                label: 'Teams',
                sideBar : true,
                description: ''
            },
            'subscription-manager' : {
                id: 'subscriptionManager',
                label: 'Subscriptions',
                sideBar : true,
                description: ''
            },
            'report-manager' : {
                id: 'reportManager',
                label: 'Reporting',
                sideBar : true,
                description: ''
            },
            'delegation-manager' : {
                id: 'delegationManager',
                label: 'Delegation',
                sideBar : false,
                description: ''
            }
        },
    	getRoleDataFor : function(role) { 
            return this._roleData[role];
        }
    };
}]);