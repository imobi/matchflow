angular.module('matchflow').controller('AnalyzerCtrl', ['$scope','$meteor','$state','$stateParams','$compile','$http','$timeout','$interval','userService','projectsService','managerService','utilsService', 'Upload',
    function ($scope,$meteor,$state,$stateParams,$compile,$http,$timeout,$interval,userService,projectsService,managerService,utilsService,Upload) {
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
        // Returns the tags grouped by category in arrays
        $scope.groupedTags = [];
        $scope.$watch(
            'currentProject.tags',
            function(newVal,oldVal){
                // This watch rebuilds the tag tree after each new tag add
                // TODO this can be made MUCH more efficient
                var newGroupedTagsArray = [];
                var groupingIndexMap = {};
                if ($scope.currentProject !== undefined &&
                        $scope.currentProject.tags !== undefined) {
                    for (var t = 0; t < $scope.currentProject.tags.length; t++) {
                        var currentTag = $scope.currentProject.tags[t];
                        if (groupingIndexMap[currentTag.category] === undefined) {
                            // add the category and store its index
                            groupingIndexMap[currentTag.category] = newGroupedTagsArray.length;
                            newGroupedTagsArray[newGroupedTagsArray.length] = {
                                name: currentTag.category,
                                colors: currentTag.colors,
                                children:[
                                    {
                                        name: currentTag.name,
                                        colors: currentTag.colors
                                    }
                                ]
                            };
                        } else {
                            newGroupedTagsArray[
                                groupingIndexMap[
                                    currentTag.category
                                ]
                            ].children[
                                newGroupedTagsArray[
                                    groupingIndexMap[
                                        currentTag.category
                                    ]
                                ].children.length
                            ] = {
                                name: currentTag.name,
                                colors: currentTag.colors
                            };
                        }
                    }
                }
                $scope.groupedTags = newGroupedTagsArray;
            },
            true
        );
        
        // Tagline functionality
        $scope.addTagToTagLine = function (tagObj,groupObj) {
            var groupName = groupObj.name;
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
                    after: tagObj.after,
                    colors: {
                        fg : groupObj.txtColor,
                        bg : groupObj.bgColor
                    }
                };
            }
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
    }]
);