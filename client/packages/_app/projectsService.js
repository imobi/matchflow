angular.module('matchflow').factory('projectsService', ['$meteor',function($meteor){
    return {
    	//Make all projects available and bind to variable
    	projectsObject: { empty: true },
        // bind the projects collection to this object
        bindProjectsCollection: function () {
        	this.projectsObject = $meteor.collection(Projects);
        },        
        getProjects : function() {
        	if (this.projectsObject.empty) {
                this.bindProjectsCollection();
            }
            // return a reference to the projectsObject
          	return this.projectsObject;
        }
    };
}]);