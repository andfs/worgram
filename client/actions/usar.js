Template.Usar.onRendered(function() {
	//Add blue animated border and remove with condition when focus and blur
    if($('.fg-line')[0]) {
        $('body').on('focus', '.fg-line .form-control', function(){
            $(this).closest('.fg-line').addClass('fg-toggled');
        })

        $('body').on('blur', '.form-control', function(){
            var p = $(this).closest('.form-group, .input-group');
            var i = p.find('.form-control').val();

            if (p.hasClass('fg-float')) {
                if (i.length == 0) {
                    $(this).closest('.fg-line').removeClass('fg-toggled');
                }
            }
            else {
                $(this).closest('.fg-line').removeClass('fg-toggled');
            }
        });
    }

    //Add blue border for pre-valued fg-flot text feilds
    if($('.fg-float')[0]) {
        $('.fg-float .form-control').each(function(){
            var i = $(this).val();

            if (!i.length == 0) {
                $(this).closest('.fg-line').addClass('fg-toggled');
            }

        });
    }
});

Template.Usar.onCreated(function(){
	qtdHashtag = new ReactiveVar();
	hashtagText = new ReactiveVar();
    isVisualizarFotos = new ReactiveVar();
    isVisualizarFotos.set(false);
});

Template.Usar.events({
	"submit .hashtag": function(event) {
		event.preventDefault();
		hashtagText.set(event.target.hashtag.value);
		Meteor.call('procurarHashtag', event.target.hashtag.value, function(erro, result) {
			if(erro) {
				
			}
			else {
				qtdHashtag.set(result);
			}
		});
	}
});

Template.Usar.helpers({
	resultados: function() {
		
	},
	hashtag: function () {
		return hashtagText.get();
	},
	
	qtdHashtag: function() {
		return qtdHashtag.get();
	},

    curtir: function() {

    },

    comentar: function() {

    },

    visualizar: function() {
        isVisualizarFotos.set(true);
    },

    visualizarFotos: function() {
        isVisualizarFotos.get();
    }
});