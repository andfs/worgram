Meteor.publish('usersCollection', function() {
	if(this.userId) {
		return Meteor.users.find({_id: this.userId}, {'services.instagram.username': 1, 'services.instagram.profile_picture': 1});
	}
});

Meteor.publish('pendenciasCollection', function() {
	if(this.userId) {
		return pendenciasCollection.find({userId: this.userId});
	}
});

Meteor.publish('historicoCollection', function() {
	if(this.userId) {
		return historicoCollection.find({userId: this.userId});
	}
});

Meteor.publish('blacklistCollection', function() {
	if(this.userId) {
		return blacklistCollection.find({userId: this.userId});
	}
});