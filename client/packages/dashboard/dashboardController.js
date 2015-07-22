angular.module('matchflow').controller('DashboardCtrl', ['$scope','$meteor','$state','userService','managerService',
    function ($scope,$meteor,$state,userService,managerService) {
        $scope.logout = function() {
            $meteor.logout().then(function() {
                $state.go('home');
            },function(err) {
                $state.go('home');
                console.log('Error trying to logout');
            });
        };
        
        // GENERAL CONFIG NEEDS TO BE LOADED FROM METEOR AND ACCESSED FROM A SERVICE
        $scope.user = userService.getCurrentUserData();
        // manage events service
        $scope.manageEvents = managerService.getEventsManager($scope.user.eventGroupList);
        // mf-sidebar
        $scope.sideBarConfiguration = {
            onclick: function(id) {
                $scope.showManagerDialog(id);
            },
            data: $scope.user.permissions
        };
        $scope.showManagerDialog = function (id) {
            if (id === 'eventManager') {
                $scope.manageEvents.clearEventInput();
                $scope.manageEvents.loadEventGroups();
            } else if (id === 'profileManager') {
//                $scope.managePlayer = {
//                    id: 'player_1',
//                    firstName: 'Firsty',
//                    surnameName: 'Namey',
//                    idPhoto: '<img src="img/idphoto.png" alt="idphoto" class="player-manager-id-photo">',
//                    history: [
//                        '...1','...2','...3'
//                    ]
//                };
            } else if (id === 'leagueManager') {
//                $scope.manageLeague = {
//                    leagues: [
//                        {
//                            id: 'league_1',
//                            name: 'League 1',
//                            teams: ['team_1','team_2','team_3'],
//                            startDate: '01/01/2001',
//                            endDate: '31/12/2001',
//                            fixtures: [],
//                            results: []
//                        }
//                    ]
//                };
            } else if (id === 'teamManager') {
//                $scope.manageCategories.categoryToAdd = {
//                    teams: [
//                        {
//                            id: 'team_1',
//                            name: 'Team 1',
//                            players: ['player_1'],
//                            coach: ''
//                        }
//                    ]
//                };
            }
            angular.element('#'+id+'Dialog').modal('show');
        };
    }]
);