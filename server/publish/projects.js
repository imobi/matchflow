Meteor.publish('projects', function () {
    if (Roles.userIsInRole(this.userId, ['project-manager'])) {
        console.log('Finding user['+this.userId+']\'s projects');
        return Projects.find(
            {
                $or : [
                    { // if this project is public
                        permissions : { 
                            $elemMatch: { 
                                type : 'public',
                                id : 'public'
                            } 
                        } 
                    },
                    { // if this user is authorized
                        permissions : { 
                            $elemMatch: { 
                                type : 'user',
                                id : this.userId
                            } 
                        } 
                    },
                    { // if this user is the owner
                        owner : this.userId
                    }
                ]
            }, 
            {
                fields: {password:0, videoServerToken:0} //do not publish the password field or token to the front end
            }
        );
    } else {
        console.log('Unauthorized PROJECT access detected');
        this.stop();
        return;
    }
});

