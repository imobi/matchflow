Meteor.publish('projects', function () {
    if (Roles.userIsInRole(this.userId, ['project-manager'])) {
        console.log('Finding user['+this.userId+']\'s projects');
        return Projects.find(
            {
                users: this.userId
            }, 
            {
                fields: {password:0} //do not publish the password field to the front end
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
        var pw = "mfpp"+Date.now()+Math.round(Math.random()*1000000000); //This formula generates a very strong, random password
        if (pw.length+Math.round(Math.random)%2===0) pw = pw.split('').reverse().join(''); //Adds more randomness
        Projects.update({_id: project_id}, {$set: {password: pw}});
        //REST call to Node server adding the project_id and password fields, or add entire project object?
        console.log("Calling: "+videoServer+"/fileName");
        HTTP.call("POST",videoServer+"/fileName",
            { data: {"file_name":"vserve_success.mov"}},
            function (error, result) {
                console.log(error);
                if (!error) {
                    //Session.set("twizzled", true);
                    console.log(result);
                }
            }
        );
    }
});