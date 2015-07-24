angular.module('matchflow').factory('projectsService', ['$meteor',function($meteor){
    return {
    	//Make all projects available and bind to variable
    	_projectsObject: { empty: true },
        // bind the projects collection to this object
        bindProjectsCollection: function () {
        	this._projectsObject = $meteor.collection(Projects);
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
        }
    };
}]);