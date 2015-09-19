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
        saveProject : function(project,callback) {
            if (!this._projectsObject.empty) {
                // push one project in
                this._projectsObject.save(project).then(function(projectObjects){
                    console.log('ProjectService: saved project',projectObjects);
                    var _id = projectObjects[0]._id;
                    // add a search entry for the project
                    searchService.addSearchEntry(
                        // value, type, permissions, linkbackId
                        project.name,
                        'project',
                        [ // TODO run through all permissions and add them, not just users, 
                          // ALSO convert any groups into the individual permissions
                          // Just adding the following for testing purposes
                            {
                                type: 'private',
                                id: project.users[0] 
                            }
                        ],
                        _id
                    );
                    // call the callback, to hide and load the project
                    callback(_id);
                    //Generate a password for project and add to video server's white list
                    Meteor.call('addProjectToVideoServer',_id);
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