angular.module('matchflow').directive('mfVideoPlayer', function($compile) {
	return {
		scope: {
			playerData : '=videoPlayerData'
		},
		// TODO make this player responsive, change video size for screen
		// we also want nodes, playback touch areas etc
		template: '<div class="row mf-video-player-container">'+
					  '<div id="videoPlayerHolder" class="col-lg-12"></div>'+
				  '</div>',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attrs) {
            scope.channelURL = 'http://player.twitch.tv/?channel='+scope.playerData.channel;
			scope.play = function() {
				scope.playerData.status = scope.playerData.PLAYING;
			};
			scope.pause = function() {
				scope.playerData.status = scope.playerData.PAUSED;
			};
			var contentHTML = ''+
                '<div ng-show="playerData.showLive">'+
                    '<div id="twitchplayer" class="mf-video-player">'+
//                        '<iframe src="'+scope.channelURL+'" frameborder="0" scrolling="no" height="400" width="840"></iframe>'+
                        '<button class="btn btn-success">START</button>'+
                        '<button class="btn btn-danger">STOP</button>'+
                    '</div>'+
                '</div>'+
                '<div ng-show="!playerData.showLive">'+
                    '<div id="videoPlayerTimestamp" class="mf-video-player"></div>'+
//                    '<video width="320" height="240" controls style="position:absolute; top:0px; left:0px;">'+
//                        '<source src="http://127.0.0.1:8085/stream.mp4" type="video/mp4">'+
//                    '</video>'+
                    '<button class="btn btn-danger">START</button>'+
                    '<button class="btn btn-success" ng-click="play()">Play</button>'+
                    '<button class="btn btn-info" ng-click="pause()">Pause</button>'+
                    '<button class="btn btn-danger">END</button>'+
                '</div>';
            /*
             * There are two different modes for this, each needs its own set of controls:
             *
             *  - buffered playback or normal video mode
             *    play
             *    pause
             *    increase playback speed
             *    decrease playback speed
             *    jumpto location
             *    jumpto start
             *    jumpto end
             *    
             *    tags are added at the playback point in this mode, so where ever you are, the blue line shows you where the tag will be added
             *    
             *  - live stream mode
             *    start tracking (you can only start tracking once so this button will become disabled after tracking has begun)
             *    end tracking (this toggles into continue tracking, and because it uses real timestamps, it will jump to the current time, you can go back and add events in normal video mode)
             *    adjust tracking (this allows you to alter precisely when the start happened, move it forward or later)
             *    
             *    tags can only be added at the current time in this mode
             */
			element.find('#videoPlayerHolder').html($compile(contentHTML)(scope));
			scope.$watch(
				'playerData.timer.timestamp',
				function() {
					element.find('#videoPlayerTimestamp').html(scope.playerData.timer.timestamp+'['+scope.playerData.status+']');
				},
				true
			);
            
		}            
	};
});