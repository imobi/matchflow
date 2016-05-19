// details for connecting to the video server
var VIDEO_SERVER = {
    ip: '127.0.0.1',
    port: '3005',
    secret: '1234567890', // TODO this should be generated
    publicKey: 'encrypt' // TODO use this public key to perform encryption of the generated secret
};

var GENAPIURL = function(restcall) {
    return 'http://'+VIDEO_SERVER.ip+':'+VIDEO_SERVER.port+'/'+restcall;
};

/*
 * For security reasons, we should always call the matchflowvideoserver using methods
 * This way we can keep the communication protocol a secret, and the client just calls
 * methods from the local server.
 */
Meteor.methods({
    'getVideoServerSessionKey': function (projectId,password) {
        // Construct the API URL
        // TODO the secret should be generated and then encrypted using the video servers public key <- impossible to decrypt this
        var apiUrl = GENAPIURL('register/'+VIDEO_SERVER.secret+'/'+projectId+'/'+password);
        console.log('getting video server session key> '+apiUrl);
        // query the API
        var response = HTTP.get(apiUrl).data;
        return response;
    }
});

Meteor.methods({
    'getProjectVideoList': function (key) { // TODO do we need to  pass the session key to the Client??? YES, there will be multiple clients, UNLESS we add sessions
        // Construct the API URL
        // TODO the secret should be generated and then encrypted using the video servers public key <- impossible to decrypt this
        var apiUrl = GENAPIURL('videos/all/'+key);
        // query the API
        var response = HTTP.get(apiUrl).data;
        return response;
    }
});

Meteor.methods({
    // Method that returns the url where the video is stored, just needs the id and the name of the video record and the authentication key
    'getVideoURL': function (videoId,videoName,key) {
        return {
            url: 'http://'+VIDEO_SERVER.ip+':'+VIDEO_SERVER.port+'/cfs/files/videos/'+videoId+'/'+videoName+'?key='+key
        };
    }
});

//When adding project, generate secret project password and add these to project doc
//Meteor.methods({   
//    'addProjectToVideoServer': function (project_id) {
//        console.log("generating password for project");
//        var pw = "mfpp"+Date.now()+Math.round(Math.random()*1000000000); //This formula generates a very strong, random password
//        if (pw.length+Math.round(Math.random)%2===0) pw = pw.split('').reverse().join(''); //Adds more randomness
//        //Update the project document with this new password
//        Projects.update({_id: project_id}, {$set: {password: pw}});
//        var videoServer = 'http://'+VIDEO_SERVER.ip+':'+VIDEO_SERVER.port;
//        //REST call to Node server adding the project_id and password fields, or add entire project object?
//        console.log("Calling: "+videoServer+"/addProject");
//        HTTP.call("POST",videoServer+"/addProject",
//            { data: {"pid":project_id, "password":pw}},
//            function (error, result) {
//                if (error) console.log(error);
//                else {
//                    //Session.set("twizzled", true);
//                    console.log(result);
//                }
//            }
//        );
//    },
//    'validToken': function (token) {
//        console.log("Checking if token is recognized by video server...");        
//
//    }
//});