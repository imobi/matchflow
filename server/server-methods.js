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