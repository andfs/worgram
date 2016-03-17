FlowRouter.route('/', {
	name: 'principal',
	action: function() {
		if(Meteor.userId()) {
			FlowRouter.go('instagram');
		}
		else {
			BlazeLayout.render('Principal', {main: 'Apresentacao'});
		}
	}
});

FlowRouter.route('/ajuda', {
	name: 'ajuda',
	action: function() {
		BlazeLayout.render('Principal', {main: 'Ajuda'});
	}
});

FlowRouter.route('/instagram', {
	name: 'instagram',
	action: function() {
		BlazeLayout.render('Principal', {main: 'Instagram'});
	}
});

FlowRouter.route('/comprar-pacote', {
	name: 'comprar-pacote',
	action: function() {
		BlazeLayout.render('Principal', {main: 'ComprarPacote'});
	}
});

FlowRouter.route('/historico-pendencias', {
	name: 'historico-pendencias',
	action: function() {
		BlazeLayout.render('Principal', {main: 'Historico'});
	},
	subscriptions: function(params, queryParams) {
        this.register('pendenciasCollection', Meteor.subscribe('pendenciasCollection'));
        this.register('historicoCollection', Meteor.subscribe('historicoCollection'));
    }
});

FlowRouter.triggers.enter([function(context, redirect){
	if(!Meteor.userId() && context.path != "/ajuda") {
		FlowRouter.go('/')
	}
}]);