Template.Ajuda.onRendered(function() {
	$( '.panel-group' ).searchable({
	    searchField: '#search',
	    selector: '.panel-collapse',
	    childSelector: '.panel-title, .panel-body',
	    show: function( elem ) {
	        elem.slideDown(100);
	        elem.find('.clique').click();
	    },
	    hide: function( elem ) {
	        elem.slideUp( 100 );
	    }
	});

	if ($('.collapse')[0]) {

        //Add active class for opened items
        $('.collapse').on('show.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });

        $('.collapse').on('hide.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').removeClass('active');
        });

        //Add active class for pre opened items
        $('.collapse.in').each(function(){
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });
    }
});