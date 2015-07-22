angular.module('matchflow').factory('managerService',['$meteor',function($meteor){
    // manager service
    return {
        eventManager : {},
        profileManager : {},
        leagueManager : {},
        teamManager : {}
    };
}]);