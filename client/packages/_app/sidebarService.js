angular.module('matchflow').factory('sidebarService',['$meteor','rolesService',function($meteor,rolesService){
    // sidebar service
    return {
        getSidebarConfig : function(user,managers) { 
            return {
                onclick: function(role) {
                    var id = rolesService.getRoleDataMappings[role].id;
                    if (id === 'eventManager') {
                        managers['eventManager'].clearInput();
                        managers['eventManager'].loadEventGroups();
                    } else if (id === 'profileManager') {
                        managers['profileManager'].currentUserProfile = {
                            id: 'player_1',
                            firstName: 'Firsty',
                            surnameName: 'Namey',
                            idPhoto: '<img src="img/idphoto.png" alt="idphoto" class="player-manager-id-photo">',
                            history: [
                                '...1','...2','...3'
                            ]
                        };
                    } else if (id === 'leagueManager') {
                        managers['leagueManager'].leagueToAdd = {
                            leagues: [
                                {
                                    id: 'league_1',
                                    name: 'League 1',
                                    teams: ['team_1','team_2','team_3'],
                                    startDate: '01/01/2001',
                                    endDate: '31/12/2001',
                                    fixtures: [],
                                    results: []
                                }
                            ]
                        };
                    } else if (id === 'teamManager') {
                        managers['teamManager'].categoryToAdd = {
                            teams: [
                                {
                                    id: 'team_1',
                                    name: 'Team 1',
                                    players: ['player_1'],
                                    coach: ''
                                }
                            ]
                        };
                    }
                    angular.element('#'+id+'Dialog').modal('show');
                },
                data: user.permissions
            };
        }
    };
}]);