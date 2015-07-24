Meteor.startup(function () {
	// code to run on server at startup, creates collection. might not have existed before, so this adds the colleciton to mongo.
	if (Projects.find().count() === 0) {
		Projects.insert({
			"name":"sample_project"
		});
		Projects.remove({
			"name":"sample_project"
		});
		
	}

});