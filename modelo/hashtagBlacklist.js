blacklistCollection = new Mongo.Collection('blacklist');

blacklistCollection.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return doc.userId == userId;
	},
	remove: function(userId, doc) {
		return doc.userId == userId;
	}
});

Blacklist = new Astro.Class({
  name: 'Blacklist',
  collection: blacklistCollection,

  fields: {
	    userId: 'string',
	    'hashtags': {
				      type: 'array',
				      nested: 'string',
				      default: function() { return []; }
				   }
  }
});