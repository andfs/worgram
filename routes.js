FlowRouter.route('/', {
	name: 'principal',
	action: function() {
		BlazeLayout.render('Principal', {main: 'Apresentacao'});
	}
});

FlowRouter.route('/saiba-mais', {
	name: 'saiba-mais',
	action: function() {
		BlazeLayout.render('Principal', {main: 'SaibaMais'});
	}
});

FlowRouter.route('/login', {
	name: 'instagram',
	action: function() {
		BlazeLayout.render('Principal', {main: 'Login'});
	}
});

FlowRouter.route('/instagram', {
	name: 'instagram',
	action: function() {
		BlazeLayout.render('Principal', {main: 'Instagram'});
	}
});