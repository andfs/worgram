Meteor.methods({
	associarTokenUsuario: function(data, valor) {
		if(Meteor.userId()) {
			HTTP.post("https://api.pagar.me/1/transactions/" + data.token + "/capture", {data: {api_key: Meteor.settings.private.pagarmeApiKey, amount: valor}},
			function(err, result) {
				if(err) {
					throw new Meteor.Error("erroPagar", "Não conseguimos identificar o pagamento.");
				}
				else {
					console.log(result);
				}
			});
		}
		else {
			throw new Meteor.Error("erroLogar", "Você não está logado. Não podemos confirmar o valor pago.");
		}
	}
});