Meteor.publish('projects', function () {
    if (Roles.userIsInRole(this.userId, ['project-manager'])) {
        console.log('Finding user['+this.userId+']\'s projects');
        return Projects.find({
            users: this.userId
        });
    } else {
        console.log('Unauthorized PROJECT access detected');
        this.stop();
        return;
    }
});