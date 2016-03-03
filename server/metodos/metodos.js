Meteor.methods({
	associarTokenUsuario: function(token, valor) {
		if(Meteor.userId()) {
			HTTP.post("https://api.pagar.me/1/transactions/" + data.token, {data: {api_key: Meteor.settings.private.pagarmeApiKey, amount: valor}},
			function(err, result) {
				if(err) {
					throw new Meteor.Error("erroPagar", "Não conseguimos identificar o pagamento.");
				}
				else {
					if(result.status == "refused") {
						throw new Meteor.Error("400", "Pagamento não autorizado.");
					}
					
				}
			});
		}
		else {
			throw new Meteor.Error("erroLogar", "Você não está logado. Não podemos confirmar o valor pago.");
		}
	},
	
	procurarHashtag: function(hashtag, valor, token) {
		if(Meteor.userId) {
			try {
				Meteor.call('associarTokenUsuario', token, valor);
				HTTP.post("https://api.instagram.com/v1/tags/" + hashtag + "?access_token=" + Meteor.user().services.instagram.accessToken, function(err, result) 
				{
					if(err) {
						throw new Meteor.Error("erroPagar", "Erro ao efetuar o pagamento.");
					}
					resultados = result.media_count;
				});
				
			} catch(e) {
				throw new Meteor.Error("400", "Não conseguimos identificar o pagamento realizado. Entre em contato com o administrador do sistema");
			}
		} else {
			throw new Meteor.Error("401", "Você deve estar logado para realizar esta operação.");	
		}
	}
});