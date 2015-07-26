//Make the existing 'users' meteor mongo collection available globally
Users = Meteor.users;

Users.allow({
    insert: function (userId, doc) {
        return (userId && doc.user_id === userId);
    },
    update: function (userId, docs, fields, modifier) {
        for (var i = 0; i < docs.length; i++) {
            if (docs[i].user_id !== userId) {
                return false;
            }
        }
        return true;
    },
    remove: function (userId,docs) {
        for (var i = 0; i < docs.length; i++) {
            if (docs[i].user_id !== userId) {
                return false;
            }
        }
        return true;
    }
});