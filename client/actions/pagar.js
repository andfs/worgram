var pagarFunction = function(valor) {
	var checkout = new PagarMeCheckout.Checkout({"encryption_key":Meteor.settings.public.pagarmeKey_criptografia, success: function(data) {
		if(data && data.token) {
			Session.set('valor', valor);
			Session.set('token', data.token);
			Meteor.call('salvarPagamento', valor, data.token, function(err, result) {
				if(err) {
					swal('Erro', err.data, 'result');
				}
				else {
					FlowRouter.go('/instagram');
				}
			});					
		}
	}});
	
	var params = {"customerData":false, "amount":valor*100, "createToken": "true", "paymentMethods": "credit_card" };
	checkout.open(params);
}

function pagar(valor) {
	if(Meteor.userId()) {
		pagarFunction(valor);
	}
	else
	{
		Meteor.loginWithInstagram(function (err, res) {
			if (err) {
				swal(':(', 'Não foi possível efetuar o login.', 'error');
			} 
			else {
				pagarFunction(valor);
			}
		});
	}
}

Template.Precos.events({
	"click .bronze": function() {
		pagar(Meteor.settings.public.valorBronze);
	},
	"click .prata": function() {
		pagar(Meteor.settings.public.valorPrata);
	},
	"click .ouro": function() {
		pagar(Meteor.settings.public.valorOuro);
	},
});