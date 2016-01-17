/*
 * The purpose of this service is to provide an easy modal control interface.
 */
angular.module('matchflow').factory('modalDialogService',function(){
    var performDialogOperation = function(id,operation) {
        var dialogElement = angular.element('#'+id);
        if (dialogElement.length === 1) {
            dialogElement.modal(operation);
        } else if (dialogElement.length > 1) {
            console.error('More than one dialog for "'+id+'" found, unable to '+operation+'.');
        } else {
            console.error('Dialog "'+id+'" not found.');
        }
    };
    return {
        open : function (id) {
            performDialogOperation(id,'show');
        },
        close : function(id) {
            performDialogOperation(id,'hide');
        }
    };
});