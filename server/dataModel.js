
Meteor.startup(function () {
  	//Let's add some initial items to our Parties collection if it's empty (on startup)
    if (Parties.find().count() === 0) {
      var parties = [
        {'name': 'Dubstep-Free Zone',
          'description': 'Can we please just for an evening not listen to dubstep.'},
        {'name': 'All dubstep all the time',
          'description': 'Get it on!'},
        {'name': 'Savage lounging',
          'description': 'Leisure suit required. And only fiercest manners.'}
      ];
      //Insert into Parties collection by looping through array and inserting each party
      for (var i = 0; i < parties.length; i++)
        Parties.insert(parties[i]);

    }
});