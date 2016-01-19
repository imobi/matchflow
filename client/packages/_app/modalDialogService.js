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
    var modalCallbacks = {};
    var modalService = {
        executeCallback : function(callbackKey,type) {
            if (callbackKey && modalCallbacks[callbackKey]) {
                var callback = modalCallbacks[callbackKey][type];
                if (callback) {
                    callback(modalCallbacks[callbackKey]['data']);
                }
            }
        },
        data : function(callbackKey) {
            if (callbackKey && modalCallbacks[callbackKey]) {
                return modalCallbacks[callbackKey]['data'];
            } else {
                return {};
            }
        },
        open : function (id,callbackKey,callbackMapping) {
            if (callbackKey && callbackMapping) {
                modalCallbacks[callbackKey] = callbackMapping;
            }
            performDialogOperation(id,'show');
            this.executeCallback(callbackKey,'open');
        },
        close : function(id,callbackKey) {
            performDialogOperation(id,'hide');
            this.executeCallback(callbackKey,'close');
        }
    };
    return modalService;
});