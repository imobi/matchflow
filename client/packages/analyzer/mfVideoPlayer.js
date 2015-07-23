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
			scope.play = function() {
				scope.playerData.status = scope.playerData.PLAYING;
			};
			scope.pause = function() {
				scope.playerData.status = scope.playerData.PAUSED;
			};
			var contentHTML = '<h1>Video Player</h1>'+
				'<div id="videoPlayerTimestamp"></div>'+
				'<button class="btn btn-success" ng-click="play()">Play</button>'+
				'<button class="btn btn-info" ng-click="pause()">Pause</button>';
			element.find('#videoPlayerHolder').html($compile(contentHTML)(scope));
			scope.$watch(
				'playerData.timer.timestamp',
				function(){
					element.find('#videoPlayerTimestamp').html(scope.playerData.timer.timestamp+'['+scope.playerData.status+']');
				},
				true
			);
		}            
	};
})