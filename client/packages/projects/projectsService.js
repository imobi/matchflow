angular.module('matchflow').factory('projectsService', ['$meteor','searchService','userService',function($meteor,searchService,userService){
    return {
        _currentProject: undefined,
    	//Make all projects available and bind to variable
    	_projectsObject: { empty: true },
        // bind the projects collection to this object
        bindProjectsCollection: function () {
        	this._projectsObject = $meteor.collection(Projects,true).subscribe('projects');
        },        
        getProjectsData : function() {
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
            // push one project in
            $scope.projects.save($scope.currentProject).then(function(projectObjects){
                console.log('saved project',projectObjects);
                var _id = projectObjects[0]._id;
                //Generate a password for project and add to video server's white list
                Meteor.call('addProjectToVideoServer',_id);
                // add a search entry for the project
                searchService.addSearchEntry(projectObjects[0].name,'project',[
                    {
                        type: 'user',
                        id: $scope.user._id
                    }
                ],_id);//value,type,permissions,id
                // call the callback, to hide and load the project
                callback(_id);
            },function(error){
                // TODO throw an error without hiding the create project dialog
                console.log('error project not saved',error);
            });
        },
        removeProject : function(id) {
            if (!this._projectsObject.empty) {
                // remove the project from the collection
                this._projectsObject.remove(id);
                // TODO success and error function
                
                // now also remove its search entry
                searchService.removeSearchEntryByType('project',id);
            }
        }
    };
}]);