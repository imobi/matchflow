Meteor.startup(function () {
    
    //Schema to use when creating user accounts
    var createUser = function (first_name, last_name, email, password) {
        return Accounts.createUser({
            "email": email,
            "password": password,
            "profile": {
                "firstName": first_name,
                "lastName": last_name,
                "picture": "",
                "reportPacks": [],
                "subscriptions": [],
                "tabFilters": [],
                "leagues": [],
                "teams": [],
                "videos": [],
                "shareGroups": [],
                "projects": [],
                "feed": [],
                "notes": [],
                "eventGroups": []
            }
        });
    };
    /*
     PERMISSIONS:
     - admin (admin screen)
     - profile-manager (default, everyone has access to this, helps you manage your profile)
     - analyzer-only (analyzer screen, and allows you access to just one project in the analyzer, you can only edit it, not delete it, and its your only project)
     - analyzer-full (allows full access to analyzer, you not just limited to one project)
     - eventgroups-manager (event groups functionality, otherwise just have access to whats provided in the analyzer - public groups)
     - project-manager (allows you to create multiple, edit and delete projects)
     - league-manager (allows you to create and manage leagues)
     - team-manager (allows you to create and manage teams)
     - subscription-manager (allows you to create and manage your subscription channels, basically custom feeds linked to a monthly cost other users can peruse and subscribe to)
     - report-manager (allows you to create reports)
     - delegation-manager (allows users in the analyzer to split up a project into segments/tasks which are passed onto other users/groups to work on)
     */

    if (!Meteor.users.find().count()) {
        var users = [
            {first: 'Free', last: 'User', email: 'free@demo.com', password: 'free', roles: ['profile-manager', 'analyzer-only']},
            {first: 'Project', last: 'User', email: 'project@demo.com', password: 'project', roles: ['profile-manager', 'project-manager', 'analyzer-full', 'eventgroups-manager']},
            {first: 'Admin', last: 'User', email: 'admin@demo.com', password: 'admin', roles: ['admin-manager', 'profile-manager', 'analyzer-full', 'eventgroups-manager', 'project-manager', 'league-manager', 'team-manager', 'subscription-manager', 'report-manager', 'delegation-manager']}
        ];
        console.log('No users present, creating demo users...');
        _.each(users, function (user) {
            var id = createUser(user.first, user.last, user.email, user.password);
            if (user.roles.length > 0) {
                // Need _id of existing user record so this call must come 
                // after `Accounts.createUser` or `Accounts.onCreate`
                console.log('Adding roles to User ID: '+id);
                Roles.addUsersToRoles(id, user.roles);
            }
        });
    }
});