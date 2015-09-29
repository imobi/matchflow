angular.module('matchflow').factory('utilsService',function(){
    return {
        replaceAll : function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },
        idify : function(string) {
            return this.replaceAll(string,' ','_');
        }
    };
});