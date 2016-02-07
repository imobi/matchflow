angular.module('matchflow').controller('AnalyzerCtrl', ['$scope','$meteor','$state','$stateParams','$compile','$http','$timeout','$interval','userService','projectsService','managerService','utilsService', 'Upload', 'modalDialogService', 'videoPlayerService',
    function ($scope,$meteor,$state,$stateParams,$compile,$http,$timeout,$interval,userService,projectsService,managerService,utilsService,Upload,modalDialogService,videoPlayerService) {
        // general tag description dialog key and general callback function for dialogs
        $scope.activeDialogKey = '';
        $scope.activeDialog = {
            getData : function(value) {
                return modalDialogService.data($scope.activeDialogKey)[value];
            }
        };
        $scope.fireCallback = function(type) {
            modalDialogService.executeCallback($scope.activeDialogKey,type);
        };
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

        // close the currently open project
        $scope.closeCurrentProject = function() {
            // show choose dialog again
            $scope.goBack();
        };
        
        // used to decide when to show the cancel button in the WDYWTD dialog
        // requires the current project variable to be accurate
        $scope.showWDYWTDCancelButton = function() {
            return projectsService._currentProject !== undefined && projectsService._currentProject !== 'choose' && projectsService._currentProject !== 'new';
        };
        
        /**************************************/
        $scope.showCreateNew = function() {
            angular.element('#whatDoYouWantToDo').modal('hide');
            $scope.currentProject = {
                name: '',
                owner: $scope.user._id,
                permissions: [],
                searchMeta: [],
                videoDate: "",
                videoURL: "",
                liveStream: false, // NEW 
                twitchChannel: 'nightblue3', // NEW
                creationDate: '',
                leagueSelection: '',
                eventGroupSelection:[],
                teamSelection:[],
                eventGroups: [],
                tags: [],
                password: "",
                videoServerToken: null
            };
            angular.element('#newProjectDetails').modal('show');
        };

        // we expecting a project ID in the URL
        var projectID = $stateParams['pid'];
        if (projectID === 'new') { // else open the create project popup
            $scope.showCreateNew();
        } else if (projectID !== 'new' && projectID !== 'choose') { // if there is one, load that project
            //Binds current project object from Projects meteor collection
            $scope.currentProject = projectsService.getProjectByID(projectID);
            console.log('setting current project here: '+projectID);
            projectsService._currentProject = projectID;
        } else {
            // choose
            angular.element('#whatDoYouWantToDo').modal('show');
        }
        
        $scope.showChooseExisting = function() {
            angular.element('#whatDoYouWantToDo').modal('hide');
            angular.element('#existingProject').modal('show');
        };
        $scope.manageEvents = managerService.getEventsManager();
        /*************************************/
        // VIDEO PLAYER
        $scope.videoPlayer = videoPlayerService.registerPlayer('player',{
            timer : {
                timestamp : new Date().getTime(),
                timerPosition : 0
            },
            playerMode: 'video',
            videoPlaybackLength : 60 * 90, // 60 sec x 90 minutes
            status: videoPlayerService.state.PAUSED,
            url: "http://127.0.0.1:3005/cfs/files/video/3o5nZTgdtjFyjuBGz/Waterscape_2.mp4"
        });
        $scope.livePlayer = videoPlayerService.registerPlayer('live',{
            playerMode: 'livestream',
            streamType : 'twitchtv',
            channel: 'nightblue3',
            status: videoPlayerService.state.PLAYING
        });
        // INPUT FORMS
        // Populate the users event groups map and list
        var userEventGroupMap = {};
        var userEventGroupsList = [];
        for (var e = 0; e < $scope.user.profile.eventGroups.length; e++) {
            var group = $scope.user.profile.eventGroups[e];
            userEventGroupsList[userEventGroupsList.length] = group;
            userEventGroupMap[group.id] = group;
        }
        // Populate the permissions map and list
        /*
        * Permissions Array:
        * array of objects { 
        *   type[
        *      public (anyone),
        *      league (all teams in league),
        *      team (all profiles in team),
        *      user (specific user),
        *      private (owner only)
        *   ], 
        *   id[
        *      string (the specific id of the type, empty string if public)
        *   ]
        * }
        */
        var permissionsMap = {};
        var permissionsList = [];
        // first add all share groups
        for (var s = 0; s < $scope.user.profile.shareGroups.length; s++) {
            var group = $scope.user.profile.shareGroups[s];
            var permissionItem = { // these get expanded out on saving to other items such as a searchEntry creation
                type: 'group',
                group: group,
                id: group.id
            };
            permissionsList[permissionsList.length] = permissionItem;
            permissionsMap[group.id] = permissionItem;
        }
        // add a permission entry for the user himself, this has to be compulsory so no need to have this here
        /*var userPermission = {
            type: 'Private',
            id: $scope.user._id // ID of the current user
        };
        permissionsList[permissionsList.length] = userPermission;
        permissionsMap[userPermission.id] = userPermission;*/
        var publicPermission = {
            type: 'public',
            id: 'public'
        };
        permissionsList[permissionsList.length] = publicPermission;
        permissionsMap[publicPermission.id] = publicPermission;
        // TODO now add all leagues, and teams this user has access to so they can add them specifically as a permission
        
        $scope.newProject = {
            name: '',
            selectedTeams: '',
            selectedLeague: '',
            selectedEventGroups: [],// we save an array of references
            selectedPermissions: [],// we save an array of references
            selectedGameDate: new Date(),
            // INHERITED DATA
            // we pull through important references for the create project dialog
            eventGroupData : {
                groupList : userEventGroupsList,
                groupMap : userEventGroupMap
            },
            permissionsData : {
                groupList : permissionsList,
                groupMap : permissionsMap
            }
        };
        // CHART DATA
        $scope.eventGroupChart = {
            hasLabel : {},
            labels : [],
            data : []
        };
                
        // Tagline functionality
        $scope.addTagToTagLine = function (tagObj,groupObj) {
            var groupName = groupObj.name;
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
                after: tagObj.after,
                colors: {
                    fg : groupObj.txtColor,
                    bg : groupObj.bgColor
                }
            };
        };
        // DIALOG FUNCTIONS
        $scope.createNewProject = function() {
            if ($scope.newProject.name && $scope.newProject.name.length > 0 &&
                    $scope.newProject.selectedTeams !== undefined && $scope.newProject.selectedTeams.length > 0 &&
                    $scope.newProject.selectedLeague !== undefined && $scope.newProject.selectedLeague.length > 0 &&
                    $scope.newProject.selectedEventGroups !== undefined && $scope.newProject.selectedEventGroups.length > 0 &&
                    $scope.newProject.selectedPermissions !== undefined && $scope.newProject.selectedGameDate !== undefined) { // if no permissions are defined, its just private
                // save new project into meteor
                $scope.currentProject.name = $scope.newProject.name;
                // owner is already set, no need to set it again
                $scope.currentProject.league = $scope.newProject.selectedLeague;
                $scope.currentProject.teams = $scope.newProject.selectedTeams;
                $scope.currentProject.eventGroups = $scope.newProject.selectedEventGroups;
                $scope.currentProject.gameDate = $scope.newProject.selectedGameDate;
                $scope.currentProject.permissions = $scope.newProject.selectedPermissions;
                // save the project here
                projectsService.saveProject(
                    $scope.currentProject,
                    $scope.user,
                    function(_id){
                        $scope.currentProject = projectsService.getProjectByID(_id);
                        // now we can hide and clear things
                        angular.element('#newProjectDetails').modal('hide');
                        $scope.newProject = {
                            name: '',
                            selectedTeams: '',
                            selectedLeague: '',
                            selectedEventGroups: [],// we save an array of references
                            selectedPermissions: [],// we save an array of references
                            selectedGameDate: '',
                            // INHERITED DATA
                            // we pull through important references for the create project dialog
                            eventGroupData : {
                                groupList : userEventGroupsList,
                                groupMap : userEventGroupMap
                            },
                            permissionsData : {
                                groupList : permissionsList,
                                groupMap : permissionsMap
                            }
                        };
                    }
                );
            } else {
                // TODO form field validation
            }
        };
        $scope.goBack = function(dialogId,allTheWay) {
            angular.element('#'+dialogId).modal('hide');
            if (allTheWay) {
                // reset the identifier
                projectsService._currentProject = undefined;
                $timeout(function() {
                    $state.go('dashboard');
                    angular.element('html, body').animate({ scrollTop: 0 }, 'fast');
                },300);
            } else {
                angular.element('#whatDoYouWantToDo').modal('show');
            }
        };

        //Bring up video upload modal
        $scope.uploadVideo = function () {
            angular.element('#videoUploadBox').modal('show');
        };

        //Watch for when a file is dropped or selected
        $scope.$watch('files', function (oldVal,newVal) {
            console.log('Files being watched has changed',oldVal,newVal);
            $scope.upload($scope.files);
        });

        //Log files as they are uploaded
        $scope.status = '';
        $scope.complete = 'Processing...';

        $scope.upload = function (files) {
            console.log("File upload starting...");
            if (files && files.length) {
                console.log("Inside if",files);
                for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  if (!file.$error) {
                    Upload.upload({
                        url: videoServer+"/upload",
                        fields: {
                            'video_name': $scope.videoName
                        },
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);                        
                        $scope.status = 'Progress: ' + progressPercentage + '% ' +
                                    evt.config.file.name + '\n';
                    }).success(function (data, status, headers, config) {
                        $timeout(function() {
                            $scope.complete = 'Original file:' + config.file.name + ', Result: ' + JSON.stringify(data) + '\n';
                        });
                    });
                  }
                }
            }
        };
        
        // EXPORT DATA FUNCTIOMALITY
        $scope.dataToExport = '';
        $scope.dataSections = {
            generalProjectData : true, // name, dateOfEvent
            leagueData : true,
            teamData : true,
            eventGroupData : true,
            tagData : true
        };
        //Watch for when the export data selection changes
        $scope.$watch('dataSections', function () {
            $scope._updateTagData();
        },true);
        $scope._updateTagData = function() {
            // run through all the different segments of data and concat into one
            // large json object
            var dataToExp = {};
            if ($scope.dataSections['generalProjectData']) {
                dataToExp.projectName = $scope.currentProject.name;
                dataToExp.dateOfEvent = $scope.currentProject.gameDate;
            }
            if ($scope.dataSections['leagueData']) {
                dataToExp.league = $scope.currentProject.league;
            }
            if ($scope.dataSections['teamData']) {
                dataToExp.teams = [];
                if ($scope.currentProject.teams) {
                    for (var i = 0; i < $scope.currentProject.teams.length; i++) {
                        var team = $scope.currentProject.teams[i];
                        // add the team data here
                        dataToExp.teams[i] = {
                            name: team.name
                        };
                    }
                }
            }
            if ($scope.dataSections['eventGroupData']) {
                dataToExp.eventGroups = [];
                if ($scope.currentProject.eventGroups) {
                    for (var i = 0; i < $scope.currentProject.eventGroups.length; i++) {
                        var eventGroup = $scope.currentProject.eventGroups[i];
                        // add the team data here
                        var eventList = [];
                        if (eventGroup.eventList) {
                            for (var j = 0; j < eventGroup.eventList.length; j++) {
                                var eventObj = eventGroup.eventList[j];
                                eventList[j] = {
                                    name : eventObj.name,
                                    before : eventObj.before,
                                    after : eventObj.after
                                };
                            }
                        }
                        dataToExp.eventGroups[i] = {
                            name: eventGroup.name,
                            events: eventList,
                            bgColor: eventGroup.bgColor,
                            txtColor: eventGroup.txtColor
                        };
                    }
                }
            }
            if ($scope.dataSections['tagData']) {
                dataToExp.tags = [];
                if ($scope.currentProject.tags) {
                    for (var i = 0; i < $scope.currentProject.tags.length; i++) {
                        var tag = $scope.currentProject.tags[i];
                        // add the team data here
                        dataToExp.tags[i] = {
                            name: tag.name,
                            category: tag.category,
                            time: tag.time,
                            before: tag.before,
                            after: tag.after
                        };
                    }
                }
            }
            $scope.dataToExport = JSON.stringify(dataToExp);
        };
        
        // open the export project data dialog
        $scope.exportProjectData = function() {
            $scope._updateTagData();
            modalDialogService.open('exportTagData');
        };
        
        /* 
         * ==== TODO ====
         * - Load the projects video data from our video server via API or TDD
         * - Integrate the video controls into our player service
         * - Adjust video sequence in the list
         * - Must play through the list of videos in sequence
         * - Space must be limited
         * - Authenticate by granting each project its own storage space.
         * 
         */
        
    }]
);