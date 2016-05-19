angular.module('matchflow').directive('mfVideoPlayer', ['$compile','videoPlayerService',function($compile,videoPlayerService) {
	return {
		scope: {
			playerId : '=',
            playerData : '='
		},
		// TODO make this player responsive, change video size for screen
		// we also want nodes, playback touch areas etc
		template: '<div id="{{ playerId }}" class="row mf-video-player-container">'+
                      'totalPlaybackLength:{{ totalPlaybackLength }}'+
					  '<div id="videoPlayerHolder" class="col-lg-12"></div>'+
				  '</div>',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attrs) {
            // TODO maybe move this into a service
            scope.channelURL = 'http://player.twitch.tv/?channel='+scope.playerData.channel;
            scope.restart = function() {
				videoPlayerService.reset(scope.playerId);
                element.find('#'+scope.playerId+'_'+scope.currentVideoPlaybackIndex)[0].load();
			};
			scope.play = function() {
				videoPlayerService.play(scope.playerId);
                element.find('#'+scope.playerId+'_'+scope.currentVideoPlaybackIndex)[0].play();
			};
			scope.pause = function() {
				videoPlayerService.pause(scope.playerId);
                element.find('#'+scope.playerId+'_'+scope.currentVideoPlaybackIndex)[0].pause();
			};
            scope.isPlaying = function() {
                return scope.playerData.status === videoPlayerService.state.PLAYING;
            };
            scope.isPaused = function() {
                return scope.playerData.status === videoPlayerService.state.PAUSED;
            };
            if (scope.playerData.playerMode === 'livestream') {
                scope.showLive = true;
                scope.showPlayer = true;
            } else if (scope.playerData.playerMode === 'headless') {
                scope.showLive = true;
                scope.showPlayer = false;
            } else {
                // else playerMode = player
                scope.showLive = false;
                scope.showPlayer = true;
            }
            
            // TODO run through all video names and get their relative URL's recursively
            var key = '1'; // authentication key
            // important player control metadata
            scope.videoDurationArray = [];
            scope.totalPlaybackLength = 0;
            scope.currentVideoPlaybackIndex = 0;
            var loadVideos = function(videos,index) {
                if (index < videos.length) {
                    var video = scope.playerData.videos[index];
                    Meteor.call('getVideoURL', video.id, video.name, key, function (err, res) {
                        if (res !== undefined && res !== null) {
                            console.log('video url aquired: '+res.url);
                            // we hide each player initially, the loader is always shown in the background
                            // the video player shows when its ready, and only one is shown at a time
                            // this directive will manage the position and switching between the different videos
                            // must be as seamless as possible until the backend is developed to the point where
                            // it can handle streaming properly
                            var videoPlayerId = scope.playerId+'_'+index;
                            // last player must be at the top of the pile, but we show the index 0 video first
                            var displayIfFirst = index === 0 ? ' mf-show-player' : '';
                            var videoPlayerHtml = '<video id="'+videoPlayerId+'" class="mf-video-player'+displayIfFirst+'" style="display:none; z-index:100'+index+';">'+
                                    '<source src="'+res.url+'" type="video/mp4">'+
                                '</video>';
                            element.find('.mf-video-container').append(videoPlayerHtml);
                            var vidElement = element.find('#'+videoPlayerId);
                            // TODO get the length of the videos and sum them up, this forms the total playback length
                            // we must store this point as well in a map so we know when to switch
                            // we must now use this and the project counter to determine when to switch
                            if (vidElement[0] !== undefined) {
//                                var video = document.querySelector('video');
//                                video.addEventListener('timeupdate', function() {
//                                  // don't have set the startTime yet? set it to our currentTime
//                                  if (!this._startTime) this._startTime = this.currentTime;
//                                  var playedTime = this.currentTime - this._startTime;
//                                  if (playedTime >= 10) this.pause();
//                                });
                                //vid.onended = function() {
                                    // play next video...
                                //};
                                // we have to load this data asynchronously, as it is only known at the point where the data is ready
                                var videoIndex = scope.videoDurationArray.length;
                                scope.videoDurationArray[videoIndex] = 0;
                                vidElement.attr('index',videoIndex);
                                // we add a native listener... TODO CHANGE THIS
                                vidElement[0].addEventListener('loadeddata',function(){
                                    var vidElem = angular.element(this);
                                    var playbackLength = this.duration;
                                    // set the loaded duration
                                    vidElem.attr('duration',this.duration);
                                    // get the loaded index
                                    var vidIndex = vidElem.attr('index');
                                    console.log('video - loadeddata: '+playbackLength+' @ '+vidIndex);
                                    scope.videoDurationArray[vidIndex]=playbackLength;
                                    scope.totalPlaybackLength += playbackLength;
                                    scope.$apply();
                                });

                                
                            } else {
                                console.log('video player - no duration found');
                            }
                        } else {
                            console.log('unable to get the video url');
                        }
                        loadVideos(videos,index+1);
                    });
                }
                return;
            };
                            
            // TODO show a video loader screen, and then append the video once its ready
            // TODO incrementally add more video players, and manage the seamless switching between them
            
			var contentHTML = ''+
                '<div ng-show="playerData.showLive && showPlayer">'+
                    '<div id="twitchplayer" class="mf-video-player">'+
//                        '<iframe src="'+scope.channelURL+'" frameborder="0" scrolling="no" height="400" width="840"></iframe>'+
                        '<button class="btn btn-success">START</button>'+
                        '<button class="btn btn-danger">STOP</button>'+
                    '</div>'+
                '</div>'+
                '<div ng-show="!playerData.showLive">'+
                    '<div class="mf-video-container">'+
                        '<img src="img/video-loader.gif" alt="video loading animation" class="mf-video-loading-gif" />'+
                        '<div class="mf-no-videos"><span class="glyphicon glyphicon-remove"></span> No Videos To Load</div>'+
                    '</div>'+
                    '<button class="btn btn-danger" ng-click="restart()"><span class="glyphicon glyphicon-step-backward"></span></button>'+
                    '<button class="btn btn-success" ng-click="play()" ng-show="isPaused()"><span class="glyphicon glyphicon-play"></span></button>'+
                    '<button class="btn btn-info" ng-click="pause()" ng-show="isPlaying()"><span class="glyphicon glyphicon-pause"></span></button>'+
                    '<button class="btn btn-danger"><span class="glyphicon glyphicon-step-forward"></span></button>'+
                '</div>'+
                '<div ng-show="!showPlayer">'+
                    'Headless Mode'+
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
            // Load videos after the basic interface is setup, the player will manage what is shown
            // also only watch if this video player is in player mode
            if (scope.playerData.playerMode === 'video') {
                scope.$watch(
                    'playerData.videos',
                    function(videos) {
                        if (videos !== undefined && videos.length > 0) {
                            element.find('.mf-no-videos').css('display','none');
                            element.find('.mf-video-loading-gif').css('display','block');
                            loadVideos(scope.playerData.videos,0);
                        } else {
                            element.find('.mf-no-videos').css('display','block');
                            element.find('.mf-video-loading-gif').css('display','none');
                        }
                    }, 
                    true
                );
                scope.$watch(
                    'playerData.timer.timestamp',
                    function() {
                        // do a range check to find out where the new timestamp is
                        // check if the right video is playing and move on
                        var index = 0;
                        var previousTimestamp = 0;
                        var newTimestamp = scope.playerData.timer.timerPosition;
                        for (var i = 0, found = false; !found && i < scope.videoDurationArray.length; i++) {
                            var timestampToCheck = scope.videoDurationArray[i];
                            if (newTimestamp >= previousTimestamp && newTimestamp < (previousTimestamp+timestampToCheck)) {
                                index = i;
                                found = true;
                            }
                            previousTimestamp += timestampToCheck;
                        }
                        
                        if (index !== undefined) {
                            var newPlayer = element.find('#'+scope.playerId+'_'+index);
                            if (newPlayer.css('display') === 'none') { // if its not showing, wrong player is visible, time to switch
                                console.log('Switching to player: '+index);
                                // quick show the new player and start playing
                                var oldPlayer = element.find('.mf-show-player');
                                newPlayer.addClass('mf-show-player');
                                newPlayer[0].play(); // start playing
                                // and hide the previous
                                oldPlayer[0].pause(); // pause playing on old player, just a formalit                     y
                                oldPlayer.removeClass('mf-show-player');
                                
                            }
                        }
                    },
                    true
                );
            }
            
		}            
	};
}]);