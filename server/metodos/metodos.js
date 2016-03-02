Meteor.methods({
	associarTokenUsuario: function(data, valor) {
		if(Meteor.userId()) {
			HTTP.post("https://api.pagar.me/1/transactions/" + data.token + "/capture", {data: {api_key: Meteor.settings.private.pagarmeApiKey, amount: valor}},
			function(err, result) {
				if(err) {
					throw new Meteor.Error("erroPagar", "N�o conseguimos identificar o pagamento.");
				}
				else {
					console.log(result);
				}
			});
		}
		else {
			throw new Meteor.Error("erroLogar", "Voc� n�o est� logado. N�o podemos confirmar o valor pago.");
		}
	}
});