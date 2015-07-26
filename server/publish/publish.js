// publish roles to all clients
Meteor.publish(null, function (){ 
  return Meteor.roles.find({});
});