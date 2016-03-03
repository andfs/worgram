function pagar(valor) {
	var checkout = new PagarMeCheckout.Checkout({"encryption_key":Meteor.settings.public.pagarmeKey_criptografia, success: function(data) {
		if(data && data.token) {
			Meteor.loginWithInstagram(function (err, res) {
				if (err) {
					console.log("login falhou");
				} 
				else {
					Session.set('valor', valor);
					Session.set('token', data.token);
				}
			});
		}
	}});

	var params = {"customerData":false, "amount":valor*100, "createToken": "true", "paymentMethods": "credit_card" };
	checkout.open(params);
}

Template.Pagar.events({
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