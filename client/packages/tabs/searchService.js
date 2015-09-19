angular.module('matchflow').factory('searchService',['$meteor',function($meteor){
    return {
        /*
         * Search service is responsible for saving search links and removing search links
         * from the database. It might make sense to break the search objects into different
         * types which will allow the search to function much faster.
         *  Search Entry fields: {
                _id:1,
                value:1, // searchable field (search meta)
                permissions:1, // array
                type:1, // search obj type: [profile, team, league, eventGroup, project, video, report template etc...]
                linkbackId:1 // this consists of the id of the item being searched on
            }
         */
        // used to store the search data meteor collection
    	_searchData: { empty: true },
        // bind the search data collection to this object
        bindSearchDataCollection: function () {
            console.log('SearchService: binding searchData collection...');
        	this._searchData = $meteor.collection(SearchData,true).subscribe('searchdata');
        },        
        initSearchData : function() {
            console.log('SearchService: initializing...');
        	if (this._searchData.empty) {
                this.bindSearchDataCollection();
            }
            // return a reference to the searchData, maybe we should hide this...
          	return this._searchData;
        },       
        search : function(criteria) {
            console.log('SearchService: searching...');
            // TODO load all search links matching the criteria mentioned
            // this should probably load via an interval, startIndex, endIndex, and load more 
            // if scrolling occurs, keep incrementing the endIndex, we can pre-load the next
            // 20 items, until there are none left to allow for smooth loading and scrolling
            // maybe the ability of adding multiple items to a search filter, to keep refining
            
            // The entire search data is already loaded into the UI, so we just need to run through it
            // TODO we should also rank for similarity (smaller parts of the criteria etc)
            var searchResults = undefined;
            for (var s = 0; s < this._searchData.length; s++) {
                var searchLink = this._searchData[s];
                if (searchLink.value !== undefined && searchLink.value.indexOf(criteria)>=0) {
                    searchResults[searchResults.length] = searchLink;
                }
            }
            return searchResults;
        },
        clearSearch : function() {
            // TODO implement the search clear, this ensures that the users search criteria,
            // as well as the search buffer
        },
        // TODO add a function for updating an existing search entry
        addSearchEntry : function(value,type,permissions,id) {
            console.log('SearchService: Trying to add search entry');
            // add search link to the collection, it will persist a callback 
            // which performs the required action for that type of link
            // remember to add timestamps
            if (!this._searchData.empty) {
                this._searchData.save(
                    {
                        value : value,
                        type : type,
                        permissions : permissions,
                        linkbackId : id,
                        timestamp : new Date().getTime() // this should be done service side or be in GMT format
                    },
                    function(error,_id){
                        console.log('SearchService: Search entry inserted ['+_id+']');
                    }
                );
            } else {
                console.log('SearchService: data empty');
            }
        },
        removeSearchEntry : function(id) {
            console.log('SearchService: Trying to remove search entry by id ['+id+']');
            // remove search link from the collection
            if (!this._searchData.empty) {
                this._searchData.remove(id);
            }
        },
        removeSearchEntryByType : function(type,id) {
            console.log('SearchService: Trying to remove search entry by type and linkbackid');
            // remove search link from the collection using type and the linkbackId
            if (!this._searchData.empty) {
                this._searchData.remove({
                    type : type,
                    linkbackId : id
                });
            }
        }
    };
}]);