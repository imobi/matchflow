angular.module('matchflow').factory('searchService',function(){
    return {
        /*
         * Search service is responsible for saving search links and removing search links
         * from the database. It might make sense to break the search objects into different
         * types which will allow the search to function much faster.
         */
        _searchBuffer : [],
        search : function(criteria) {
            // TODO load all search links matching the criteria mentioned
            // this should probably load via an interval, startIndex, endIndex, and load more 
            // if scrolling occurs, keep incrementing the endIndex, we can pre-load the next
            // 20 items, until there are none left to allow for smooth loading and scrolling
            // maybe the ability of adding multiple items to a search filter, to keep refining
        },
        clearSearch : function() {
            // TODO implement the search clear, this ensures that the users search criteria,
            // as well as the search buffer
        },
        addSearchLink : function(searchLinkField,searchLinkType,actionCallback) {
            // TODO add search link to the collection, it will persist a callback 
            // which performs the required action for that type of link
            // remember to add timestamps
        },
        removeSearchLink : function(searchLinkId) {
            // TODO remove search link from the collection
        }
    };
});