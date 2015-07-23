Meteor.startup(function () {
	// code to run on server at startup
	if (Projects.find().count() === 0) {
		Projects.insert({
			"name":"sample_project"
		});
	}

});