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

//When adding project, generate secret project password and add these to project doc
Meteor.methods({   
    addProjectToVideoServer: function (project_id) {
        console.log("generating password for project");
        var pw = "mfpp"+Date.now()+Math.round(Math.random()*1000000000); //This formula generates a very strong, random password
        if (pw.length+Math.round(Math.random)%2===0) pw = pw.split('').reverse().join(''); //Adds more randomness
        //Update the project document with this new password
        Projects.update({_id: project_id}, {$set: {password: pw}});
        //REST call to Node server adding the project_id and password fields, or add entire project object?
        console.log("Calling: "+videoServer+"/addProject");
        HTTP.call("POST",videoServer+"/addProject",
            { data: {"pid":project_id, "password":pw}},
            function (error, result) {
                if (error) console.log(error);
                else {
                    //Session.set("twizzled", true);
                    console.log(result);
                }
            }
        );
    },
    validToken: function (token) {
        console.log("Checking if token is recognized by video server...");        

    }
});