Template.Principal.events({
	"click .nav-toggle": function(){
		$(".nav-toggle").toggleClass("active");
		$(".overlay-boxify").toggleClass("open");
	},

	"click .linkMenu": function() {
		$(".nav-toggle").toggleClass("active");
		$(".overlay-boxify").toggleClass("open");
	},

	"click .overlay": function() {
		$(".nav-toggle").toggleClass("active");
		$(".overlay-boxify").toggleClass("open");
	},

	"click .efetuarLogin": function() {
		Meteor.loginWithInstagram(function (err, res) {
			if (err) {
				swal(':(', 'Não foi possível efetuar o login.', 'error');
			} 
			else {
				FlowRouter.go('instagram');
			}
		});
	}
});