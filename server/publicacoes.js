Meteor.publish('usersCollection', function(estacionamentoId) {
	if(this.userId) {
		return Meteor.users.find({_id: this.userId}, {'services.instagram.username': 1, 'services.instagram.profile_picture': 1});
	}
});