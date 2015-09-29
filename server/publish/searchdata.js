/*
 * Search Object:
 *     _id - unique id
 *     name - searchable field (search meta)
 *     permissions - array
 *     type - search obj type: [profile, team, league, eventGroup, project, video, report template etc...]
 *     linkbackId - this consists of the id of the item being searched on
 *     timestamp - when the search entry was added/updated
 *
 * Permissions Array:
 * array of objects { 
 *   type[
 *      public (anyone),
 *      league (all teams in league),
 *      team (all profiles in team),
 *      user (specific user),
 *      private (owner only)
 *   ], 
 *   id[
 *      string (the specific id of the type, empty string if public)
 *   ]
 * }
 */

Meteor.publish('searchdata', function (opts) {
    if (Roles.userIsInRole(this.userId, ['profile-manager'])) { // must be a registered user
        console.log('Finding search data');
        // need to determine the users permissions and customize the query
        var orCriteria = [
            { owner: this.userId } // we include this by default
        ];
        // returns undefined if not logged in so check if logged in first
        var currentUser = undefined;
        if (this.userId) {
            currentUser = Meteor.users.findOne(this.userId);
        }
        if (!currentUser) {
            // return error if no user
            return false;
        }
        // we need to know what the users leagues, teams id's are which we compare to the permissions array
        var leagues = currentUser.leagues;
        var teams = currentUser.teams;
        // via leagues permission
        if (leagues) {
            for (var l = 0; l < leagues.length; l++) {
                orCriteria[orCriteria.length] = {
                    'permissions.type': 'league',
                    'permissions.id': leagues[l]._id
                };
            }
        }
        // via team permission
        if (teams) {
            for (var t = 0; t < teams.length; t++) {
                orCriteria[orCriteria.length] = {
                    'permissions.type': 'team',
                    'permissions.id': teams[t]._id
                };
            }
        }
        // direct permission
        orCriteria[orCriteria.length] = {
            'permissions.type': 'private',
            'permissions.id': currentUser._id
        };
        
        // counts module.. couldn't get it to work: meant to return the full number of entries
        Counts.publish(
            this, 
            'numberOfSearchEntries', 
            SearchData.find({
                    $or: orCriteria
            }), 
            {
                noReady: true
            }
        );
        
        // now we return the results of the search call, this returns all the data 
        // (in the future we can make this more efficient)
        if (opts) {
            console.log('SearchData: skip-'+opts.skip+', limit-'+opts.limit);
        }
        return SearchData.find({
            $or: orCriteria
        }, {
            skip: opts ? opts.skip : undefined,
            limit: opts ? opts.limit : undefined,
            fields: {
                _id:1,
                name:1, // searchable field (search meta)
                permissions:1, // array
                type:1, // search obj type: [profile, team, league, eventGroup, project, video, report template etc...]
                linkbackId:1, // this consists of the id of the item being searched on
                timestamp:1 // when the search entry was added
            }
        });
    } else {
        console.log('Unauthorized SEARCH access detected');
        this.stop();
        return;
    }
});