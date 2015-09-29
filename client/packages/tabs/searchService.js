angular.module('matchflow').factory('searchService',['$meteor',function($meteor){
    return {
        /*
         * Search service is responsible for saving search links and removing search links
         * from the database. It might make sense to break the search objects into different
         * types which will allow the search to function much faster.
         *  Search Entry fields: {
         *      _id
         *      name - searchable field (search meta)
         *      permissions - array
         *      type - search obj type: [profile, team, league, eventGroup, project, video, report template etc...]
         *      linkbackId - this consists of the id of the item being searched on,
         *      timestamp - time when the entry was added/updated
         *  }
         */
        // used to store the search data meteor collection
    	_searchData: { empty: true },
        // bind the search data collection to this object
        bindSearchDataCollection: function () { // TODO need to make separate collections for each filter
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
        search : function(filter,sort) {
            console.log('SearchService: searching...');
            if (!this._searchData.empty) {
                return this._searchData.find(filter,sort);
            } else {
                return [
                    {
                        _id: 'public_'+new Date().getTime(),
                        name: 'No Results Matching Filter Found...',
                        type: 'other',
                        permissions: [],
                        linkbackId: -1,
                        timestamp: new Date().getTime()
                    }
                ];
            }
        },
        // this initializes a collection and subscription for a specific tab
        initTabFilter : function(tabFilter,entriesPerPage,currentPage,sort) {
            if (tabFilter !== undefined) {
                return $meteor.collection(function () {
                    return SearchData.find(
                        tabFilter,
                        sort
                    );
                }).subscribe('searchdata',{
                    limit: entriesPerPage,
                    skip: (currentPage-1)*entriesPerPage,
                    sort: sort
                });
            } else {
                return undefined;
            }
            
        },
        // TODO add a function for updating an existing search entry
        addSearchEntry : function(name,type,permissions,id) {
            console.log('SearchService: Trying to add search entry');
            // add search link to the collection, it will persist a callback 
            // which performs the required action for that type of link
            // remember to add timestamps
            if (!this._searchData.empty) {
                this._searchData.save(
                    {
                        name : name,
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
                var searchEntry = $meteor.object(SearchData,{
                    type : type,
                    linkbackId : id
                },true);
                this._searchData.remove(searchEntry._id);
            }
        },
        getTotalSearchEntries : function() {
            return $meteor.object(Counts,'numberOfSearchEntries',false).count;
        }
    };
}]);