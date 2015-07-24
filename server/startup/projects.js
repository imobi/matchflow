Meteor.publish('projects', function () {
  return Projects.find({
    $or:[ // we can add more conditions here like ensure user is part of list of users who have access etc.
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]}
    ]});
});