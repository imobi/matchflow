angular.module('matchflow').factory('notesService',function(){
    return {
        /*
         * NOTE Types:
         * Standard - gray
         * Critical - red pulse
         * Warning - yellow
         * Success - green
         * Info - blue
         * 
         * NOTE Behavior:
         * Standard - General message from system
         * Info - System notice
         * Success - Completed, Approved
         * Warning - Expiry, returned task
         * Critical - Failed, rejected task
         * 
         * Notes need to have:
         *  - ID
         *  - Name
         *  - Description
         *  - ActionType [on click: show message, open link]
         */
        _notificationCollection: [],
        _notificationsBuffer : [],
        loadNotifications : function(collection) {
            // TODO need to load the collection of notifications and store them in the buffer
        },
        addNote : function(noteClass,note) {
            // TODO add note to the collection
        },
        removeNote : function(noteId) {
            // TODO remove note from collection
        }
    };
});