//Initialize a projects meteor mongo collection
Projects = new Mongo.Collection('projects');

//Set permissions for the project collection, only users that are authorized to access the project should be able to change it
Projects.allow({
    insert: function (userId, doc) {
        console.log('Projects: attempting to insert ['+userId+']');
        if (Roles.userIsInRole(userId, ['project-manager'])){
            if (userId !== undefined && doc !== undefined && doc.users !== undefined) {
                for (var u = 0; u < doc.users.length; u++) {
                    if (doc.users[u] === userId) {
                        console.log('Projects: insert success');
                        return true;
                    }
                }
                console.log('Projects: insert failed, user must be in their own project');
                return false;
            } else {
                console.log('Projects: insert failed, incorrect parameters');
            }
        } else {
            console.log('Projects: insert failed, insufficient permissions');
            return false;
        }
    },
    update: function (userId, docs, fields, modifier) {
        // TODO redo all this logic
        console.log('Projects: attempting to update');
        for (var i = 0; i < docs.length; i++) {
            if (docs[i].user_id !== userId) {
                return false;
            }
        }
        return true;
    },
    remove: function (userId, docs) {
        // TODO redo all this logic
        console.log('Projects: attempting to remove');
        for (var i = 0; i < docs.length; i++) {
            if (docs[i].user_id !== userId) {
                return false;
            }
        }
        return true;
    }
});