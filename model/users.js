//Make the exisiting 'users' meteor mongo collection available globally
Users = Meteor.users;

Users.allow({
  insert: function () {
  	return true;
  },
  update: function () {
    return true;
	},
  remove: function () {
  	return true;
  }
});