angular.module('matchflow').controller('DashboardCtrl', ['$scope','$meteor','$state','userService','utilsService',
    function ($scope,$meteor,$state,userService,utilsService) {
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
        // mf-sidebar
        $scope.sideBarConfiguration = {
            onclick: function(id) {
                $scope.showManagerDialog(id);
            },
            data: $scope.user.permissions
        };
        $scope.showManagerDialog = function (id) {
            if (id === 'eventManager') {
                $scope.manageEvents.clearInput();
                $scope.manageEvents.loadEventGroups();
            } else if (id === 'profileManager') {
                $scope.managePlayer = {
                    id: 'player_1',
                    firstName: 'Firsty',
                    surnameName: 'Namey',
                    idPhoto: '<img src="img/idphoto.png" alt="idphoto" class="player-manager-id-photo">',
                    history: [
                        '...1','...2','...3'
                    ]
                };
            } else if (id === 'leagueManager') {
                $scope.manageLeague = {
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
                $scope.manageCategories.categoryToAdd = {
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
        };
        // Event Groups
        $scope.manageEvents = { // TODO MOVE INTO SERVICE
            eventGroupToAdd: {
                id: '',
                name: '',
                bgColor: 'green',
                txtColor: 'white',
                eventToAdd: { 
                    name: '',
                    before: 500,
                    after: 500
                },
                eventList : []
            },
            eventGroupList: [],
            eventGroupMap: {},
            loadEventGroups : function() {
                // save the event groups into the user's variable
                $scope.manageEvents.eventGroupList = $scope.user.eventGroupList;
                // and add them to the map
                $scope.manageEvents.eventGroupMap = {};
                for (var e = 0; e < $scope.manageEvents.eventGroupList.length; e++) {
                    var eventGroup = $scope.manageEvents.eventGroupList[e];
                    $scope.manageEvents.eventGroupMap[eventGroup.id] = eventGroup;
                }
            },
            saveEventGroups : function() {
                // TODO Isolate the scope of the lists, so we only overwrite here:
                // save the event groups into the user's variable
                $scope.user.eventGroupList = $scope.manageEvents.eventGroupList;
                angular.element('#eventManagerDialog').modal('hide');
            },
            addEventGroup: function () {
                if ($scope.manageEvents.eventGroupToAdd && $scope.manageEvents.eventGroupToAdd.name && 
                    $scope.manageEvents.eventGroupToAdd.name.length > 0) {
                    $scope.manageEvents.eventGroupToAdd.id = utilsService.replaceAll($scope.manageEvents.eventGroupToAdd.name,' ','_');
                    $scope.manageEvents.eventGroupList[$scope.manageEvents.eventGroupList.length] = $scope.manageEvents.eventGroupToAdd;
                    $scope.manageEvents.eventGroupMap[$scope.manageEvents.eventGroupToAdd.id] = $scope.manageEvents.eventGroupToAdd;
                    $scope.manageEvents.clearInput();
                }
            },
            clearInput: function() {
                $scope.manageEvents.eventGroupToAdd = {
                    id: '',
                    name: '',
                    bgColor: 'green',
                    txtColor: 'white',
                    eventToAdd: { 
                        name: '',
                        before: 500,
                        after: 500
                    },
                    eventList : []
                };
            },
            removeEventGroup: function (index) {
                var eventGroup = $scope.manageEvents.eventGroupList[index];
                $scope.manageEvents.eventGroupMap[eventGroup.id] = undefined;
                eventGroup = undefined;
                $scope.manageEvents.eventGroupList.splice(index, 1);
            },
            addEventToGroup : function(id) {
                if ($scope.manageEvents.eventGroupMap[id] !== undefined) {
                    $scope.manageEvents.eventGroupMap[id].eventList[$scope.manageEvents.eventGroupMap[id].eventList.length] = $scope.manageEvents.eventGroupMap[id].eventToAdd;
                    $scope.manageEvents.clearEventInput(id);
                }
            },
            clearEventInput: function(id) {
                if ($scope.manageEvents.eventGroupMap[id] !== undefined) {
                    $scope.manageEvents.eventGroupMap[id].eventToAdd = { 
                        name: '',
                        before: 500,
                        after: 500
                    };
                }
            },
            removeEventFromGroup : function(id,index) {
                if ($scope.manageEvents.eventGroupMap[id] !== undefined) {
                    $scope.manageEvents.eventGroupMap[id].eventList.splice(index, 1);
                }
            }
        };
    }]
);