/*  Search Entry Examples:
 {
 id: 'post1',
 title: 'Example Post 1',
 description: 'This is an example post demonstrating feed data.',
 link: '#'
 },
 {
 id: 'post2',
 title: 'Example Post 2',
 description: 'This is an example post demonstrating feed data.',
 link: '#'
 }
 
 THIS DIRECTIVE USES:
 http://binarymuse.github.io/ngInfiniteScroll/
 */
angular.module('matchflow').directive(
        'mfTabFeed', ['$meteor', '$compile', 'searchService', 'tabService', function ($meteor, $compile, searchService, tabService) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: {
                        tabId: '='
                    },
                    template: '<div class="list-group">' +
                            '<h5 class="list-group-item">Finding all for: <i>{{ tabId }}</i> [loaded {{ feedData.length }} of {{ searchEntryCount }}] <button ng-click="refresh()"><span class="glyphicon glyphicon-refresh"></span></button></h5>' +
                            '<div infinite-scroll="nextPage()" infinite-scroll-distance="2">' +
                            '<a ng-repeat="entry in feedData" ng-click="openLink(entry.linkbackId)" id="{{ entry._id }}" class="list-group-item" style="height:100px;">' +
                            '<h4 class="list-group-item-heading">[{{ entry.index }}] {{ entry.type }}: {{ entry._id }}</h4>' +
                            '<p class="list-group-item-text">{{ entry.name }}</p>' +
                            '</a>' +
                            '</div>' +
                            '</div>',
                    link: function (scope, elem, attr) {
                        // we use this to determine the direction of the scroll
                        scope.lastScrollTop = 0;
                        scope.scrollDirection = 'down';
                        angular.element(window).scroll(function (event) {
                            var st = angular.element(this).scrollTop();
                            if (st > scope.lastScrollTop) {
                                // downscroll code
                                scope.scrollDirection = 'down';
                            } else {
                                // upscroll code
                                scope.scrollDirection = 'up';
                            }
                            scope.lastScrollTop = st;
                        });

                        // TODO infinite scroller
                        scope.feedData = [];
                        scope.feedDataMap = {};
                        scope.entriesPerPage = 8;
                        scope.currentPage = 1;
                        scope.sort = {
                            timestamp: -1
                        };
                        console.log('searchService: initializing collection - sdata_' + scope.tabId + ' ');

                        console.log('running collection query...');
                        scope.filterData = scope.$meteorCollection(function () {
                            return SearchData.find({}, {
                                limit: scope.getReactively('entriesPerPage'),
                                skip: (scope.getReactively('currentPage') - 1) * scope.getReactively('entriesPerPage')
                            });
                        }, true).subscribe('sdata_' + scope.tabId, {
                            sort: scope.sort
                        });

                        // general functions
                        scope.nextPage = function () {
                            // only if its currently active, load more
                            if (angular.element('#' + scope.tabId + '_tab').hasClass('active') && scope.scrollDirection === 'down' || scope.feedData.length === 0) {
                                console.log('Load next page! [' + scope.entriesPerPage + ']');
                                scope.entriesPerPage++;
                                // TODO change this to be more precise when building data into the page using an infinite scroll pagination
                                // run through the newData and see if its necessary to append/prepend/insert data into the page
                                if (scope.feedData.length === 1 && scope.feedData[0]._id === 'No Results') {
                                    // if theres just the feedData arrays No Results message, clear everything out
                                    scope.feedData = [];
                                    scope.feedDataMap = {};
                                }
                                for (var f = 0; f < scope.filterData.length; f++) {
                                    // TODO maybe do a freshness check, compare existing values to make sure there are no changes
                                    console.log('SEARCH: checking - ' + scope.filterData[f]._id + ' = ' + scope.feedDataMap[scope.filterData[f]._id]);
                                    if (scope.feedDataMap[scope.filterData[f]._id] === undefined) {
                                        //                                     add the index to the feedDataMap, this is also used to make sure we don't add a duplicate
                                        scope.feedDataMap[scope.filterData[f]._id] = scope.feedData.length;
                                        //                                     add the new object into the array at the end
                                        //                                     TODO do an injection sort
                                        var entryItem = scope.filterData[f];
                                        entryItem.index = scope.feedData.length + 1;
                                        scope.feedData[scope.feedData.length] = entryItem;
                                    }
                                }
                            }
                        };
                        scope.openLink = function (linkbackId) {

                        };
                        scope.refresh = function () {
                            scope.feedData = [];
                            scope.feedDataMap = {};
                        };

                        scope.$watch('filterData', function (newData, oldData) {
                            // use this to re-aquire the total number of entries
                            scope.searchEntryCount = searchService.getTotalSearchEntries();
                        }, true);
                    }
                };
            }
        ]);