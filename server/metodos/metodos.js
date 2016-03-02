Meteor.methods({
	"pagar": function(plano, cardHash) {
		var valor = "";
		if(plano == "bronze") {
			valor = Meteor.settings.private.valorBronze * 100
		}
		else if(plano == "prata") {
			valor = Meteor.settings.private.valorPrata * 100
		}
		else if(plano == "ouro") {
			valor = Meteor.settings.private.valorOuro * 100
		}

		HTTP.post("https://api.pagar.me/1/transactions", 
			{data: {api_key: Meteor.settings.private.pagarmeApiKey, amount: valor, card_hash: cardHash, metadata: {'app': 'instawork'}}}, 
		function(err, result) 
		{
			if(err) {
				throw new Meteor.Error("erroPagar", "Erro ao efetuar o pagamento.");
			}
			Meteor.loginWithInstagram(function (err, res) {
			    if (err !== undefined)
					console.log('sucess ' + res)
				else
					console.log('login failed ' + err)
		    });
		});
	}
});