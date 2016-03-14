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
	}
});