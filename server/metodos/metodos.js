Meteor.methods({
	
	procurarHashtag: function(hashtag) {
		if(Meteor.userId) {
			var resultados = 0;
			var result = HTTP.get("https://api.pagar.me/1/transactions/" + Meteor.user().pagamento.token, {data: {api_key: Meteor.settings.private.pagarmeApiKey, amount: Meteor.user().pagamento.valor*100}});
			if(result.data.status == "refused") {
				throw new Meteor.Error("400", "Pagamento não autorizado.");
			}
						
			var post = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "?access_token=" + Meteor.user().services.instagram.accessToken); 
			
			resultados = post.data.data.media_count;
				
			return resultados;
		} else {
			throw new Meteor.Error("401", "Você deve estar logado para realizar esta operação.");	
		}
	},

	salvarPagamento: function(valor, token) {
		if(Meteor.userId) {
			Meteor.users.update({_id: Meteor.userId}, {$set: {pagamento: {valor: valor, token: token}}})
		}
	}
});