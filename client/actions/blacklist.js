Template.Blacklist.onCreated(function(){
    var self = this;
    self.autorun(function() {
        self.subscribe('blacklistCollection');
    });
});

Template.Blacklist.events({
	"submit .hashtagBlacklist": function(event, template) {
		event.preventDefault();
		var blacklist = blacklistCollection.findOne({userId: Meteor.userId()});
		if(!blacklist) {
			blacklist = new Blacklist();
			blacklist.set('userId', Meteor.userId());
		}
		blacklist.push('hashtags', event.target.hashtag.value);
		blacklist.save(function(err, id) {
			if(err) {
				console.log(err.message);
			}
		});

		$('.hashtagBlacklist')[0].reset();
	},

	"click .excluir": function(event) {
		Meteor.call('excluirBlacklist', this.toString());
	}
});

Template.Blacklist.helpers({
	hashtags: function(event, template) {
		if(Template.instance().subscriptionsReady()) {
			var blacklist = blacklistCollection.findOne({userId: Meteor.userId()});
			var result = _.values(blacklist.get('hashtags'))
			return result;
		}
	}
});