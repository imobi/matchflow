angular.module('matchflow').directive('mfEventTagLines', function ($interval,$window) {
    return {
        scope: {
            timer: '=ngModel',
            tags: '=eventTagsToAdd',
            tagLineStatus: '=playStatus',
            totalDuration: '=videoDuration',
            tagLinesData: '=eventGroups'
        },
        template: '' +
            '<div class="row mf-event-tag-line-container-parent">' +
                '<div class="mf-time-overview-line" ng-click="slideTo($event)">' +
                // TODO show the current position on the jumpto% line
                    '<span class="glyphicon glyphicon-arrow-left"></span> click to jump to % time <span class="glyphicon glyphicon-arrow-right"></span>' +
                    '<div class="mf-current-playback-point" style="width:{{ percentComplete }}%;"></div>' +
                '</div>' +
                '<div class="mf-event-tag-line-container">' +
                    '<div class="mf-event-tag-line-spacer">' +
                        '<div id="tagNumbers" class="mf-event-tag-line-markers" style="margin-left:0px;"></div>' +
                        '<div id="tagContainer" class="mf-event-tag-lines" style="height: {{ tagLinesData.length * 30 }}px;"></div>' +
                        '<div class="mf-time-bar red"></div>' +
                    '</div>' +
                    '<div class="mf-time-bar blue"></div>' +
                    '<button ng-click="zoomIn()" class="mf-button zoom-in"><span class="glyphicon glyphicon-plus-sign"></span></button>' +
                    '<button ng-click="zoomRestore()" class="mf-button zoom-restore"><span class="glyphicon glyphicon-eye-open"></span></button>' +
                    '<button ng-click="zoomOut()" class="mf-button zoom-out"><span class="glyphicon glyphicon-minus-sign"></span></button>' +
                    '<button ng-click="slideRight()" class="mf-button slide-right"><span class="glyphicon glyphicon-chevron-right"></span></button>' +
                    '<button ng-click="slideLeft()" class="mf-button slide-left"><span class="glyphicon glyphicon-chevron-left"></span></button>' +
                    '<button ng-click="slidePositionReset()" class="mf-button slide-reset"><span class="glyphicon glyphicon-screenshot"></span></button>' +
                '</div>' +
            '</div>',
        replace: true,
        restrict: 'E',
        link: function (scope, element, attr) {
            // important variables:
            scope.stepper = scope.timer.timestamp / scope.timeModulater;
            scope.timeModulater = 1000; // move to timer
            scope.timerStep = 1; // move to timer
            scope.timer.timerPosition = 0;
            scope.groupMap = {};
            scope.mode = 'video'; // or 'livestream'
            scope.percentComplete = 0;
            scope.zoomLevel = 0;
            scope.zoomPadding = 15;
            scope.slidePosition = 0;
            // TODO tags must have a unique ID when added to this timeline
            scope.currentAddedTagMap = {}; // keeps track of the tags that have been added to the timeline, so we don't end up with duplicates
            // useful timeline info
            // these display differently for each mode
            scope.startTime = 0;
            scope.currentTime = 0;
            scope.endTime = 0;
            scope.totalTime = 0;
            
            scope._refreshTags = function() {
                if (scope.tags !== undefined) {
                    // FIRST WE ADD THE EXISTING TAGS IN ONE BATCH
                    var tagHTML = '';
                    for (var t = 0; t < scope.tags.length; t++) {
                        var tag = scope.tags[t];
                        var width = (Number(tag.before) + Number(tag.after)) / 1000 * scope.zoomPadding;
                        var offset = Number(tag.before) / 1000 * scope.zoomPadding;
                        var position = tag.time * scope.zoomPadding;
                        var group = scope.groupMap[tag.category];
                        var top = 30 * group.index; // TODO Why is this throwing an error on initial project load??? 
                       // TODO need a tooltip with the tag name in it
                        // TODO need a mechanism to adjust before, end and position
                        //angular.element('#tagContainer').html(tagHTML);
                        tag.added = undefined;
                        scope.currentAddedTagMap[tag.id] = true;
                        tagHTML += '<div class="mf-event-tag-indicator mf-' + tag.time + '-t mf-' + tag.category + '-c mf-' + tag.name + '-n" style="top:' + top + 'px; left:' + position + 'px; width:' + width + 'px; margin-left:-' + offset + 'px; background-color:' + group.bgColor + ';" mf-tag-width="'+width+'"></div>';
                    }
                    angular.element('#tagContainer').html(tagHTML);
                }
            };
            
            // TODO not happy with the zoom levels
            // the max zoom isn't big enough, tags should become much smaller
            var zoomData = {
                '-2' : {
                           zoomPadding : 30,
                           multiplier: 1,
                           slideRatio: 2
                       },
                '-1' : {
                           zoomPadding : 25,
                           multiplier: 2,
                           slideRatio: 4
                       },
                 '0' : {
                           zoomPadding : 15,
                           multiplier: 5,
                           slideRatio: 10
                       },
                 '1' : {
                           zoomPadding : 10,
                           multiplier: 10,
                           slideRatio: 20
                       },
                 '2' : {
                           zoomPadding : 15,
                           multiplier: 15,
                           slideRatio: 30
                       }
            };
            
            scope._getZoomPadding = function() {
                return zoomData[scope.zoomLevel].zoomPadding;
            };
            
            scope._getZoomMultiple = function() {
                return zoomData[scope.zoomLevel].multiplier;
            };
            
            scope._adjustZoomPadding = function() {
                return zoomData[scope.zoomLevel].slideRatio*scope.zoomPadding;
            };
            
            scope._changeZoom = function() {
                // verify upper and lower limit has not been breached
                if (scope.zoomLevel < -2) {
                    scope.zoomLevel = -2;
                    return;
                }
                if (scope.zoomLevel > 2) {
                    scope.zoomLevel = 2;
                    return;
                }
                // first clear
                element.find('.mf-show-1').removeClass('mf-show-number');
                scope.zoomPadding = scope._getZoomPadding();
                // change what is shown
                element.find('.mf-show-'+scope._getZoomMultiple()).addClass('mf-show-number');
                // adjust the spacer size
                element.find('.mf-timeline-spacer').css('paddingLeft',scope.zoomPadding+'px');
                scope._refreshTags();
            };
            // inner functions
            scope.zoomIn = function() {
                console.log('zoom in');
                scope.zoomLevel--;
                scope._changeZoom();
            };
            scope.zoomOut = function() {
                console.log('zoom out');
                scope.zoomLevel++;
                scope._changeZoom();
            };
            scope.zoomRestore = function() {
                console.log('zoom restore');
                scope.zoomLevel = 0;
                scope._changeZoom();
            };
            
            scope.slideRight = function() {
                console.log('slide right');
                scope.slidePosition-= scope._adjustZoomPadding();
                // TODO dont go further than the end of the total playback time
                // TODO update % track
            };
            scope.slideLeft = function() {
                console.log('slide left');
                scope.slidePosition+= scope._adjustZoomPadding();
                // TODO dont go further back than 0
                // TODO update % track
            };
            scope._updatePercentagePosition = function(x) {
                var totalWidth = element.outerWidth();
                if (totalWidth === 0) {
                    totalWidth = 1;
                }
                scope.percentComplete = x / totalWidth * 100;
            };
            scope.slideTo = function(e) {
                // TODO fix this function, and use it each time zoom is used to correct the issues with positioning after zooming in or out, jump to markers
                scope._updatePercentagePosition(e.offsetX);
                // Now we have the percentage, calculate the jump to the nearest second
                // we also need to take into account which multiples are being shown
                var spacing = scope._adjustZoomPadding()/scope._getZoomMultiple();
                
                var relativeTime = Math.round(scope.percentComplete*scope.totalDuration/100); // rounded percentage of the total duration
                // need to remove/add offset of the red bars position
                var paddedPosition = scope.timer.timerPosition * spacing;
                scope.slidePosition = 0-spacing*relativeTime+paddedPosition;
                console.log('jumpto: '+scope.percentComplete+'% spacing:'+spacing+' relTime:'+relativeTime+' totDur:'+scope.totalDuration+' zPad:'+scope.zoomPadding+' pPos:'+paddedPosition);
            };
            scope.slidePositionReset = function() {
                // jump back to the position of the red bar 
                scope.slidePosition = 0;
                // TODO update % track
            };
            scope.$watch('slidePosition',function(newVal,oldVal) {
                angular.element('.mf-event-tag-line-spacer').css('marginLeft',scope.slidePosition+'px');
            },true);
            /* 
                We need to support two modes of operation:
                 - realtime mode, clock runs constantly, start offset
                 - video specific time. start and end time specified
            
                We need to support moving the timeline back and forward, and zooming in and out
                We need to also have a full timeline and relative location indicator
            
            */
            // we use interval to control the repetition
            var intervalID = $interval(function () {
                scope.timer.timestamp = new Date().getTime();
                // we need to update the position here
                // TODO fix this for realtime or specified time
                
            }, 1);
            scope.killInterval = function () {
                if (angular.isDefined(intervalID)) {
                    $interval.cancel(intervalID);
                    intervalID = undefined;
                }
            };
            scope.$on('$destroy', function () {
                scope.killInterval();
            });
            // adding the numbers
            var toAdd = '';
            for (var i = 0; i < scope.totalDuration; i++) {
                // add special classes to be used to filter visible and invisible numbers
                // mf-show-1
                // mf-show-2
                // mf-show-5
                // mf-show-10
                // mf-show-15
                // mf-show-30
                // mf-show-60
                var filterClasses = 'mf-show-1';
                if (i % 2 === 0) {
                    filterClasses += ' mf-show-2';
                }
                if (i % 5 === 0) {
                    filterClasses += ' mf-show-5';
                }
                if (i % 10 === 0) {
                    filterClasses += ' mf-show-10';
                }
                if (i % 15 === 0) {
                    filterClasses += ' mf-show-15';
                }
                if (i % 30 === 0) {
                    filterClasses += ' mf-show-30';
                }
                if (i % 60 === 0) {
                    filterClasses += ' mf-show-60';
                }
                // TODO make this number more meaningful
                toAdd += '<div class="mf-time-indicator mf-timeline-spacer '+filterClasses+'"><div class="number-text">' + i + '</div></div>';
            }
            angular.element('#tagNumbers').append(toAdd);
            
            scope.$watch(
                function () {
                    scope.stepper = Math.trunc(scope.timer.timestamp / scope.timeModulater);
                    return scope.stepper;
                },
                function (newVal, oldVal) {
                    // need to offset against time to allow for pauses
                    if (scope.timer.timerPosition <= scope.totalDuration * scope.zoomPadding && scope.tagLineStatus === 'playing') {
                        scope.timer.timerPosition += scope.timerStep;
                        var paddedPosition = scope.timer.timerPosition * scope.zoomPadding;
                        //angular.element('.mf-time-bar.red').css('marginLeft',paddedPosition+'px');
                        angular.element('.mf-event-tag-line-markers').css('marginLeft',(0-paddedPosition)+'px');
                        angular.element('.mf-event-tag-lines').css('marginLeft',(0-paddedPosition)+'px');
                        // TODO update % track
                        // TODO because the blue relative tracking moves with the playback,
                        // we need to take into account the scenario where its either 
                        // off to the left or right of the tag timeline, we need to 
                        // max and min limit its position
                    }
                },
                true
            );
            /*
             * TODO what about when tag groups are removed?
             */
            scope.$watch(
                'tagLinesData',
                function (newGroupsObject) {
                    scope.groupMap = {};
                    if (scope.tagLinesData !== undefined) {
                        for (var g = 0; g < scope.tagLinesData.length; g++) {
                            var groupToAdd = scope.tagLinesData[g];
                            groupToAdd.index = g;
                            scope.groupMap[groupToAdd.name] = groupToAdd;
                        }
                    }
                },
                true
            );
            
            scope._changeZoom();
            
            /*
             * TODO Refactor the tag adding system here, tags must be added at the current playback spot
             */
            scope.$watch(
                'tags',
                function () {
                    if (scope.tags !== undefined) {
                        /*
                          IDEA: to add the tag, we need to run through all the existing tags, check if they already exist, and then add them if not
                        */
                        // append the new tag (always the last one in the list)
                        for (var t = 0; t < scope.tags.length; t++) {
                            var tag = scope.tags[t];
                            if (scope.currentAddedTagMap[tag.id] === undefined) {
                                var width = (Number(tag.before) + Number(tag.after)) / 1000 * scope.zoomPadding;
                                var offset = Number(tag.before) / 1000 * scope.zoomPadding;
                                var position = tag.time * scope.zoomPadding;
                                var group = scope.groupMap[tag.category];
                                var top = 30 * group.index;
                                // TODO need a tooltip with the tag name in it
                                // TODO need a mechanism to adjust before, end and position
                                tag.added = undefined;
                                scope.currentAddedTagMap[tag.id] = true;
                                angular.element('#tagContainer').append('<div class="mf-event-tag-indicator mf-' + tag.time + '-t mf-' + tag.category + '-c mf-' + tag.name + '-n" style="top:' + top + 'px; left:' + position + 'px; width:' + width + 'px; margin-left:-' + offset + 'px; background-color:' + group.bgColor + ';" mf-tag-width="'+width+'" mf-tag-time="'+position+'"></div>');
                            }
                        }
                    }
                    
                },
                true
            );
        }
    };
});