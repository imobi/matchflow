/*
 * The purpose of this service is to provide an easy modal control interface.
 */
angular.module('matchflow').factory('videoPlayerService',function(){
    var videoPlayers = {};
    var playerService = {
        state : {
            PAUSED:'paused',
            PLAYING:'playing',
            FORWARD:'fastforwarding',
            REWIND:'rewinding'
        },
        registerPlayer : function(id,player) {
            videoPlayers[id] = angular.merge({
                timer : {
                    timestamp : 0,
                    timerPosition : 0
                },
                playerMode : 'video',
                videoPlaybackLength : 0,
                status : this.state.PAUSED,
                streamType : '',
                channel : ''
            },player);
            return videoPlayers[id];
        },
        getPlayer : function(id) {
            return videoPlayers[id];
        },
        pause : function(id) {
            if (videoPlayers[id]) {
                videoPlayers[id].status = 'paused';
            } else {
                console.log('player['+id+'] doesnt exist');
            }
        },
        play : function(id){
            if (videoPlayers[id]) {
                videoPlayers[id].status = 'playing';
            } else {
                console.log('player['+id+'] doesnt exist');
            }
        },
        reset : function(id) {
            if (videoPlayers[id]) {
                videoPlayers[id].status = 'paused';
                videoPlayers[id].timer.timestamp = 0;
                videoPlayers[id].timer.timerPosition = 0;
            } else {
                console.log('player['+id+'] doesnt exist');
            }
        }
    };
    return playerService;
});