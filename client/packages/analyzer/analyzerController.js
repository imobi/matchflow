angular.module('matchflow').controller('AnalyzerCtrl', ['$scope','$meteor','$state','$stateParams','$compile','$http','$timeout','$interval','userService','managerService','utilsService',
    function ($scope,$meteor,$state,$stateParams,$compile,$http,$timeout,$interval,userService,managerService,utilsService) {
        // standard logout functionality
        $scope.logout = function() {
            $meteor.logout().then(function() {
                $state.go('home');
            },function(err) {
                $state.go('home');
                console.log('Error trying to logout');
            });
        };
        // load user data from user service here
        $scope.user = userService.getCurrentUserData();
        /**************************************/
        // we expecting a project ID in the URL
        var projectID = $stateParams['pid'];
        if (projectID !== 'new') { // if there is one, load that project
            // TODO load project data from meteor collection
        } else { // else open the create project popup
            angular.element('#newProjectDetails').modal('show');
        }
        $scope.manageEvents = managerService.getEventsManager();
        /*************************************/
        // PROJECT SPECIFIC
        $scope.currentProject = {
            id: '',
            name: '',
            teams: '',
            league: '',
            eventGroups: [],
            addedTags: [],
            creationDate: '',
            gameDate: ''
        };
        // VIDEO PLAYER
        $scope.videoPlayer = {
            timer : {
                timestamp : new Date().getTime(),
                timerPosition : 0
            },
            videoPlaybackLength : 60 * 90, // 60 sec x 90 minutes
            status: 'paused',
            PAUSED:'paused',
            PLAYING:'playing',
            FORWARD:'fastforwarding',
            REWIND:'rewinding'
        };
        // INPUT FORMS
        var userEventGroupMap = {};
        for (var e = 0; e < $scope.user.eventGroupList.length; e++) {
            var group = $scope.user.eventGroupList[e];
            userEventGroupMap[group.id] = group;
        }
        $scope.newProject = {
            name: '',
            selectedTeams: '',
            selectedLeague: '',
            selectedEventGroups: [],// we save an array of references
            selectedGameDate: new Date(),
            // INHERITED DATA
            // we pull through important references for the create project dialog
            eventGroupData : {
                groupList : $scope.user.eventGroupList,
                groupMap : userEventGroupMap
            }
        };
        // CHART DATA
        $scope.eventGroupChart = {
            hasLabel : {},
            labels : [],
            data : []
        };
        
        // Tagline functionality
        $scope.addTagToTagLine = function (tagObj,groupName) {
            // only add if currently playing
            if ($scope.videoPlayer.status === 'playing') {
                var l = $scope.currentProject.addedTags.length;
                var time = $scope.videoPlayer.timer.timerPosition;
                // update chart data (event group)
                if ($scope.eventGroupChart.hasLabel[groupName] === undefined) {
                    // we can set the colors of the chart here: Chart.defaults.global.colours | Chart.defaults.Doughnut
                    $scope.eventGroupChart.hasLabel[groupName] = $scope.eventGroupChart.labels.length;
                    $scope.eventGroupChart.labels[$scope.eventGroupChart.labels.length] = groupName;
                    $scope.eventGroupChart.data[$scope.eventGroupChart.hasLabel[groupName]] = 1;
                } else {
                    $scope.eventGroupChart.data[$scope.eventGroupChart.hasLabel[groupName]]++;
                }
                $scope.currentProject.addedTags[l] = {
                    id: 'group_'+groupName+'_event_' + l + '_' + time,
                    time: time,
                    category: groupName,
                    name: tagObj.name,
                    before: tagObj.before,
                    after: tagObj.after
                };
            }
        };
        // DIALOG FUNCTIONS
        $scope.createNewProject = function() {
            if ($scope.newProject.name && $scope.newProject.name.length > 0 &&
                    $scope.newProject.selectedTeams !== undefined && $scope.newProject.selectedTeams.length > 0 &&
                    $scope.newProject.selectedLeague !== undefined && $scope.newProject.selectedLeague.length > 0 &&
                    $scope.newProject.selectedEventGroups !== undefined && $scope.newProject.selectedEventGroups.length > 0 &&
                    $scope.newProject.selectedGameDate !== undefined) {
                $scope.currentProject.name = $scope.newProject.name;
                $scope.currentProject.id = utilsService.replaceAll($scope.newProject.name, ' ', '_');
                $scope.currentProject.league = $scope.newProject.selectedLeague;
                $scope.currentProject.teams = $scope.newProject.selectedTeams;
                $scope.currentProject.eventGroups = $scope.newProject.selectedEventGroups;
                $scope.currentProject.gameDate = $scope.newProject.selectedGameDate;
                angular.element('#newProjectDetails').modal('hide');
                $scope.newProject = {
                    name: '',
                    selectedTeams: '',
                    selectedLeague: '',
                    selectedEventGroups: [],// we save an array of references
                    selectedGameDate: '',
                    // INHERITED DATA
                    // we pull through important references for the create project dialog
                    eventGroupList : $scope.manageEvents.eventGroupList
                };
            } else {
                // TODO form field validation
            }
        };
        $scope.returnToDashboard = function(dialogId) {
            angular.element('#'+dialogId).modal('hide');
            $timeout(function() {
                $state.go('dashboard');
            },300);
        };
    }]
);