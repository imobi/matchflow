Meteor.publish('users', function () {
    return Meteor.users.find({}, {fields: { _id:1, emails: 1, profile: 1, services: 1, roles: 1, shareGroups: 1, tabs:1 }});
});