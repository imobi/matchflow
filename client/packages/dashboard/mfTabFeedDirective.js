angular.module('matchflow').directive(
    'mfTabFeed', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                filter: '=feedFilter'
            },
            template: '<div class="list-group"></div>',
            link: function(scope,elem,attr) {
                // TODO infinite scroller
                // TODO URL feed loader
                var feedData = [
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
                ];
                var feedHtml = '';
                for (var f = 0; f < feedData.length; f++) {
                    var dataItem = feedData[f];
                    feedHtml += '<a href="'+dataItem.link+'" id="'+dataItem.id+'" class="list-group-item">'+
                            '<h4 class="list-group-item-heading">'+dataItem.title+'</h4>'+
                            '<p class="list-group-item-text">'+dataItem.description+'</p>'+
                            '</a>';
                }
                elem.html($compile(feedHtml)(scope));
            }
        };
    }
);