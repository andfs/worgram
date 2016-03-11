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
    recentes = new ReactiveVar([]);
    nextId = new ReactiveVar();
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
	},

    "click .visualizar": function(event) {
        event.preventDefault();
        Meteor.call('procurarRecentes', hashtagText.get(), function(erro, result) {
            if(erro) {
                
            }
            else {
                var arrayRecentes = recentes.get().concat(result.data);
                recentes.set(arrayRecentes);
                nextId.set(result.nextId);
            }
        });
    },

    "click .visualizarMais": function(event) {
        event.preventDefault();
        Meteor.call('procurarRecentes', hashtagText.get(), nextId.get(), function(erro, result) {
            if(erro) {
                
            }
            else {
                var arrayRecentes = recentes.get().concat(result.data);
                recentes.set(arrayRecentes);
                nextId.set(result.nextId);
            }
        });
    },

    "click .curtir": function(event) {
        event.preventDefault();
        Meteor.call('curtir', hashtagText.get(), function(erro, result) {
            if(erro) {
                
            }
            
        });
    },

    "click .comentar": function(event, template) {
        event.preventDefault();
        var coments = [
                        template.find('#comentario1').value,
                        template.find('#comentario2').value,
                        template.find('#comentario3').value,
                        template.find('#comentario4').value
                    ];


        Meteor.call('comentar', hashtagText.get(), coments, function(erro, result) {
            if(erro) {
                
            }
        });
    },
});

Template.Usar.helpers({
	resultados: function() {
		return recentes.get();
	},
	hashtag: function () {
		return hashtagText.get();
	},
	
	qtdHashtag: function() {
		return qtdHashtag.get();
	}
});