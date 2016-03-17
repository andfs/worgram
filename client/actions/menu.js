Template.Menu.events({
        "click #menu-trigger": function(e) {
        	e.preventDefault();
            var x = $(e.currentTarget).data('trigger');

            $(x).toggleClass('toggled');
            $('#menu-trigger').toggleClass('open');

    	    //Close opened sub-menus
    	    $('.sub-menu.toggled').not('.active').each(function(){
        		$('#menu-trigger').removeClass('toggled');
        		$('#menu-trigger').find('ul').hide();
    	    });

	    	$('.profile-menu .main-menu').hide();

            $elem = '#sidebar';
            $elem2 = '#menu-trigger';

            $('#chat-trigger').removeClass('open');

            $('#header').toggleClass('sidebar-toggled');		

            //When clicking outside
            if ($('#header').hasClass('sidebar-toggled')) {
                $(document).on('click', function (e) {
                    if (($(e.target).closest($elem).length === 0) && ($(e.target).closest($elem2).length === 0)) {
                        setTimeout(function(){
                            $($elem).removeClass('toggled');
                            $('#header').removeClass('sidebar-toggled');
                            $($elem2).removeClass('open');
                        });
                    }
                });
            }
        },

        "click .profileMenu": function(e) {
	         e.preventDefault();
	         $(e.currentTarget).parent().toggleClass('toggled');
	    	 $(e.currentTarget).next().slideToggle(200);
        },

        "click .logout": function() {
            Meteor.logout(function(err) {
                if(err) {
                    swal("Erro", "Algum erro aconteceu", "error");
                }
                else {
                    FlowRouter.go('principal');
                }
            });
        }
        
});

Template.Menu.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('usersCollection');
    });
});

Template.Menu.helpers({
	foto: function() {
		return Meteor.user().services.instagram.profile_picture;
    },

    userName: function() {
		return Meteor.user().services.instagram.username;
    }
});
