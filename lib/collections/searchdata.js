//Initialize a searchmap meteor mongo collection
SearchData = new Mongo.Collection('searchdata');

//Set permissions for the searchmap collection
SearchData.allow({
    insert: function (userId, doc) {
        // INSERT NEW SEARCH LINK INTO THE SEARCHDATA
        console.log('SearchData: attempting to insert ['+userId+']');
        if (Roles.userIsInRole(userId, ['profile-manager'])) { // any registered user can search
            if (userId !== undefined && doc !== undefined && doc.timestamp !== undefined &&
                    doc.name !== undefined && doc.type !== undefined &&
                    doc.permissions !== undefined && doc.linkbackId !== undefined) {
                console.log('SearchData: insert success, all parameters specified');
                return true;
            } else {
                console.log('SearchData: insert failed, incorrect parameters['+userId+','+doc.timestamp+','+doc.name+','+doc.type+','+doc.permissions.length+','+doc.linkbackId+']');
            }
        } else {
            console.log('SearchData: insert failed, insufficient permissions');
            return false;
        }
    },
    update: function (userId, docs, fields, modifier) {
        // UPDATE IS TO ALTER PERMISSIONS
        // TODO redo all this logic
        console.log('SearchData: updating search entry');
        return true;
    },
    remove: function (userId, docs) {
        // REMOVE THE SEARCH LINK FROM THE SEARCH DATA
        // TODO redo all this logic
        console.log('SearchData: removing search entry');
        return true;
    }
});