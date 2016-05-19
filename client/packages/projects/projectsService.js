angular.module('matchflow').factory('projectsService', ['$meteor','searchService','userService',function($meteor,searchService,userService){
    return {
        _currentProject: undefined,
    	//Make all projects available and bind to variable
    	_projectsObject: { empty: true },
        // bind the projects collection to this object
        bindProjectsCollection: function () {
            console.log('ProjectService: binding project collection');
        	this._projectsObject = $meteor.collection(Projects,true).subscribe('projects');
        },        
        getProjectsData : function() {
            console.log('ProjectService: initializing project data');
        	if (this._projectsObject.empty) {
                this.bindProjectsCollection();
            }
            // return a reference to the projectsObject
          	return this._projectsObject;
        },        
        getProjectByID : function(id) {
          	return $meteor.object(Projects,id,true);
        },
        saveProject : function(project,user,callback) {
            if (!this._projectsObject.empty) {
                // push one project in
                this._projectsObject.save(project).then(function(projectObjects){
                    console.log('ProjectService: saved project',projectObjects);
                    var _id = projectObjects[0]._id;
                    // TODO run through all permissions and add them, not just users, 
                    // ALSO convert any groups into the individual permissions
                    var permissionsArr = [
                        { // Compulsory
                            type: 'user', // this is specifically for the owner/creator of the project
                            id: project.ownerId
                        }
                    ];
                    // group > league > team > user
                    var shareGroupMap = {};
                    if (user.shareGroups !== undefined) {
                        for (var s = 0; s < user.shareGroups.length; s++) {
                            shareGroupMap[user.shareGroups[s]._id] = user.shareGroups[s];
                        }
                    }
                    // we reduce the permissions into one array
                    for (var p = 0; p < project.permissions.length; p++) {
                        var permObj = project.permissions[p];
                        if (permObj.type === 'group') {
                            var groupObj = shareGroupMap[permObj.id]; // grab this from the shareGroups
                            for (var g = 0; g < groupObj.shareList.length; g++) {
                                var item = groupObj.shareList[g];
                                permissionsArr[permissionsArr.length] = {
                                    type : item.type,
                                    id : item.id
                                };
                            }
                        } else {
                            permissionsArr[permissionsArr.length] = {
                                type : permObj.type,
                                id : permObj.id
                            };
                        }
                    }
                    
                    
                    // add a search entry for the project
                    searchService.addSearchEntry(
                        // name, type, permissions, linkbackId
                        project.name,
                        'project',
                        permissionsArr,
                        _id
                    );
                    // call the callback, to hide and load the project
                    if (callback) {
                        callback(_id);
                    }
                    //Generate a password for project and add to video server's white list
                    //Meteor.call('addProjectToVideoServer',_id); 
                },function(error){
                    // TODO throw an error without hiding the create project dialog
                    console.log('ProjectService: error project not saved',error);
                });
            } else {
                console.log('ProjectService: project collection not initialized...');
            }
        },
        removeProject : function(id) {
            console.log('ProjectService: removing project');
            if (!this._projectsObject.empty) {
                // remove the project from the collection
                this._projectsObject.remove(id);
                // TODO success and error function
                
                // now also remove its search entry
                searchService.removeSearchEntryByType('project',id);
                console.log('ProjectService: project removed');
            } else {
                console.log('ProjectService: project collection not initialized...');
            }
        }
    };
}]);