//Initialize a projects meteor mongo collection
Projects = new Mongo.Collection('projects');

//Set permissions for the project collection, only users that are authorized to access the project should be able to change it