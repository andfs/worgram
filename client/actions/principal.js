Template.Principal.events({
	"click .nav-toggle": function(){
		$(".nav-toggle").toggleClass("active");
		$(".overlay-boxify").toggleClass("open");
	}
});