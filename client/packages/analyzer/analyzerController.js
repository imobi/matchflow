angular.module('matchflow').controller('AnalyzerCtrl', ['$scope','$meteor','$state','$stateParams','$compile','$http','$timeout','$interval','userService','projectsService','managerService','utilsService',
    function ($scope,$meteor,$state,$stateParams,$compile,$http,$timeout,$interval,userService,projectsService,managerService,utilsService) {
        // standard logout functionality
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
        // Loading the user collection onto the scope
        $scope.user = userService.getCurrentUserData();
        
        // Loading the project collection onto the scope
        $scope.projects = projectsService.getProjectsData();
        
        /**************************************/
        // we expecting a project ID in the URL
        var projectID = $stateParams['pid'];
        if (projectID !== 'new') { // if there is one, load that project
            //Binds current project object from Projects meteor collection
            $scope.currentProject = projectsService.getProjectByID(projectID);
        } else { // else open the create project popup
            $scope.currentProject = {
                public: true,
                users: [],
                name: '',
                search_meta: [],
                videoDate: "",
                videoURL: "",
                creationDate: '',
                leagueSelection: '',
                eventGroupSelection:[],
                teamSelection:[],
                event_groups: [],
                tags: []
            };
            angular.element('#newProjectDetails').modal('show');
        }
        $scope.manageEvents = managerService.getEventsManager();
        /*************************************/
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
        var userEventGroupsList = [];
        for (var e = 0; e < $scope.user.profile.eventGroups.length; e++) {
            var group = $scope.user.profile.eventGroups[e];
            userEventGroupsList[userEventGroupsList.length] = group;
            userEventGroupMap[group.id] = group;
        }
        $scope.newProject = {
            name: '',
            users: [$scope.user._id], // we always make sure this user has access
            selectedTeams: '',
            selectedLeague: '',
            selectedEventGroups: [],// we save an array of references
            selectedGameDate: new Date(),
            // INHERITED DATA
            // we pull through important references for the create project dialog
            eventGroupData : {
                groupList : userEventGroupsList,
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
                var l = $scope.currentProject.tags.length;
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
                $scope.currentProject.tags[l] = {
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
                // save new project into meteor
                $scope.currentProject.name = $scope.newProject.name;
                $scope.currentProject.users = $scope.newProject.users;
                $scope.currentProject.league = $scope.newProject.selectedLeague;
                $scope.currentProject.teams = $scope.newProject.selectedTeams;
                $scope.currentProject.eventGroups = $scope.newProject.selectedEventGroups;
                $scope.currentProject.gameDate = $scope.newProject.selectedGameDate;
                // push one project in
                $scope.projects.save($scope.currentProject).then(function(projectObjects){
                    console.log('saved project',projectObjects);
                    $scope.currentProject = projectsService.getProjectByID(projectObjects[0]._id);
                    // now we can hide and clear things
                    angular.element('#newProjectDetails').modal('hide');
                    $scope.newProject = {
                        name: '',
                        users: [$scope.user._id], // we always make sure this user has access
                        selectedTeams: '',
                        selectedLeague: '',
                        selectedEventGroups: [],// we save an array of references
                        selectedGameDate: '',
                        // INHERITED DATA
                        // we pull through important references for the create project dialog
                        eventGroupData : {
                            groupList : userEventGroupsList,
                            groupMap : userEventGroupMap
                        }
                    };
                },function(error){
                    console.log('error project not saved',error);
                });
            } else {
                // TODO form field validation
            }
        };
        $scope.returnToDashboard = function(dialogId) {
            angular.element('#'+dialogId).modal('hide');
            $timeout(function() {
                $state.go('dashboard');
                angular.element('html, body').animate({ scrollTop: 0 }, 'fast');
            },300);
        };
    }]
);