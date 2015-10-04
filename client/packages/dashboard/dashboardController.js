angular.module('matchflow').controller('DashboardCtrl', ['$scope','$meteor','$state','userService','projectsService','managerService','searchService',
    function ($scope,$meteor,$state,userService,projectsService,managerService,searchService) {
        $scope.logout = function() {
            $meteor.logout().then(function() {
                $state.go('home');
                angular.element('html, body').animate({ scrollTop: 0 }, 'fast');
            },function(err) {
                $state.go('home');
                angular.element('html, body').animate({ scrollTop: 0 }, 'fast');
                console.log('Error trying to logout');
            });
        };
        // Test Function TOREMOVE
        $scope.addSearchEntry = function() {
            searchService.addSearchEntry(
                'Test', // value
                'project', // type
                [ // search entry permissions: who can see this?
                    {
                        type: 'private',
                        id: $scope.user._id
                    }
                ],
                99 // linkbackId the id of the type of entry being added
            );
        };
        
        // LOAD EVERYTHING HERE
        // Loading the user collection onto the scope
        $scope.user = userService.getCurrentUserData();
        
        // Loading the search data
        $scope.searchData = searchService.initSearchData();
        
        // Loading the project collection onto the scope
        $scope.projects = projectsService.getProjectsData();
        $scope.currentAnalyzerProjectId = projectsService._currentProject === undefined ? 'choose': projectsService._currentProject;
        
        // manage tab filter feeds
        $scope.tabManager = managerService.getTabFilterManager();
        
        // manage events service
        $scope.manageEvents = managerService.getEventsManager();
        // mf-sidebar
        $scope.sideBarConfiguration = {
            onclick: function(id) {
                $scope.showManagerDialog(id);
            },
            data: $scope.user.roles
        };
        $scope.saveEventGroups = function() {
            $scope.user.profile.eventGroups = $scope.manageEvents.getEventGroups();
            angular.element('#eventManagerDialog').modal('hide');
        };
        $scope.showManagerDialog = function (id) {
            if (id === 'eventManager') {
                $scope.manageEvents.clearEventInput();
                $scope.manageEvents.setEventGroups($scope.user.profile.eventGroups);
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