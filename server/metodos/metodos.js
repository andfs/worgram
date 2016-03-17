var checarPagamento = function(hashtag) {
	
	if(Meteor.user().pagamento.token && Meteor.user().pagamento.valor && Meteor.user().pagamento.dataPagamento) {
		var dtPagamento = moment(Meteor.user().pagamento.dataPagamento);
		var hj = moment();
		if(Meteor.user().pagamento.valor == Meteor.settings.public.valorBronze) 
		{
			if(dtPagamento.isAfter(hj.subtract(1, 'days')) && dtPagamento.isBefore(hj)) 
			{
				var historicoPesquisa = historicoCollection.find({userId: Meteor.userId(), data: {$gte: dtPagamento.toDate()}}).count();
				if(historicoPesquisa > 1) {
					throw new Meteor.Error("400", "Número de hashtags do pacote foi extrapolado. Por favor escolha um novo plano");		
				}
			   	return Meteor.settings.private.qtdBronze;
			}
			else 
			{
				throw new Meteor.Error("400", "Tempo de utilização do sistema expirado. Por favor escolha um novo plano");
			}


		}
		else if(Meteor.user().pagamento.valor == Meteor.settings.public.valorPrata) 
		{
			if(dtPagamento.isAfter(hj.subtract(1, 'weeks')) && dtPagamento.isBefore(hj)) 
			{
				var historicoPesquisa = historicoCollection.find({userId: Meteor.userId(), data: {$gte: dtPagamento.toDate()}}).count();
				if(historicoPesquisa > 3) {
					throw new Meteor.Error("400", "Número de hashtags do pacote foi extrapolado. Por favor escolha um novo plano");		
				}
			   	return Meteor.settings.private.qtdPrata;
			}
			else 
			{
				throw new Meteor.Error("400", "Tempo de utilização do sistema expirado. Por favor escolha um novo plano");
			}
		}
		else if(dtPagamento.isAfter(hj.subtract(1, 'months')) && dtPagamento.isBefore(hj)) 
		{
			var historicoPesquisa = historicoCollection.find({userId: Meteor.userId(), data: {$gte: dtPagamento.toDate()}}).count();
				if(historicoPesquisa > 10) {
					throw new Meteor.Error("400", "Número de hashtags do pacote foi extrapolado. Por favor escolha um novo plano");		
				}
		   	return Meteor.settings.private.qtdOuro;
		}
		else 
		{
			throw new Meteor.Error("400", "Tempo de utilização do sistema expirado. Por favor escolha um novo plano");
		}
	}
	else {
		throw new Meteor.Error("400", "Pagamento não realizado.");
	}
};

var getPendenciaUsuario = function (tipo, data, coments) {
	pendenciaUsuario = new Pendencia();
	pendenciaUsuario.set('userId', Meteor.userId());
	pendenciaUsuario.push(tipo, data);
	pendenciaUsuario.set('dataPendencia', new Date());
	if(coments) {
		pendenciaUsuario.set('comentarios', coments);
	}
	return pendenciaUsuario;
};

var getHistorico = function(id, hashtag, tipo) {
	historicoUsuario = new Historico();
	historicoUsuario.set('userId', Meteor.userId());
	historicoUsuario.set(tipo, id);
	historicoUsuario.set('hashtag', hashtag);
	historicoUsuario.set('data', new Date());
	return historicoUsuario;
}

Meteor.methods({
	
	procurarHashtag: function(hashtag) {
		if(Meteor.userId) {
			checarPagamento(hashtag);
			var result = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "?access_token=" + Meteor.user().services.instagram.accessToken); 
			
			resultados = result.data.data.media_count;
				
			return resultados;
		} else {
			throw new Meteor.Error("401", "Você deve estar logado para realizar esta operação.");	
		}
	},

	salvarPagamento: function(valor, token) {
		if(Meteor.userId) {
			Meteor.users.update({_id: Meteor.userId}, {$set: {pagamento: {valor: valor, token: token, dataPagamento: new Date()}}})
		}
		else {
			throw new Meteor.Error("401", "Você deve estar logado para realizar esta operação.");	
		}
	},

	procurarRecentes: function(hashtag, nextId) {
		if(Meteor.userId) {
			checarPagamento(hashtag);
			var param = "&count=50";
			if(nextId) {
				param += "&MAX_TAG_ID = " + nextId;
			}

			var result = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?access_token=" + Meteor.user().services.instagram.accessToken + param);
			var data = result.data.data;
			var nextId = result.data.meta.next_min_id;
			var recentes = {data: data, nextId: nextId};
			
			return recentes;		

		} else {
			throw new Meteor.Error("401", "Você deve estar logado para realizar esta operação.");	
		}
	},

	curtir: function(hashtag, checar, qtd) {
		this.unblock();
		if(Meteor.userId) {
			if(checar == undefined || checar == true) {
				qtd = checarPagamento(hashtag);
			}

			var result = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?access_token=" + Meteor.user().services.instagram.accessToken+"&count="+qtd);
			var data = result.data.data;

			for (var i = 0; i < data.length; i++) 
			{
				var retorno = HTTP.post("https://api.instagram.com/v1/media/" + data[i].id + "/likes?access_token=" + Meteor.user().services.instagram.accessToken);
				
				if(retorno.data.meta.code == "429") {
					var pendenciaUsuario = getPendenciaUsuario('idsFotosPendentesCurtir', data.slice[i+1]);
					pendenciaUsuario.save();
					break;
				}
				else {
					var historicoUsuario = getHistorico(data[i].id, hashtag, 'idFotoCurtida');
					historicoUsuario.set('qtdFotoInicial', data.length);
					historicoUsuario.save();
				}
			};
		}
	},

	curtirJob: function(hashtag, ids) {
		this.unblock();

		for (var i = 0; i < ids.length; i++) 
		{
			var retorno = HTTP.post("https://api.instagram.com/v1/media/" + ids[i].id + "/likes?access_token=" + Meteor.user().services.instagram.accessToken);
			
			if(retorno.data.meta.code == "429") {
				var pendenciaUsuario = getPendenciaUsuario('idsFotosPendentesCurtir', ids.slice[i+1]);
				pendenciaUsuario.save();
				break;
			}
			else {
				var historicoUsuario = getHistorico(ids[i].id, hashtag, 'idFotoCurtida');
				historicoUsuario.save();
			}
		};
	},

	comentar: function(hashtag, coments, checar, qtd){
		this.unblock();
		if(Meteor.userId) {
			if(checar == undefined || checar == true) {
				qtd = checarPagamento(hashtag);
			}

			var result = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?access_token=" + Meteor.user().services.instagram.accessToken+"&count="+qtd);
			var data = result.data.data;

			for (var j = 0; j < coments.length; j++) {
				var comentarioAtual = coments[j];
				for (var i = 0; i < data.length; i++) 
				{
					var retorno = HTTP.post("https://api.instagram.com/v1/media/" + data[i].id + "/comments", {params: {access_token: Meteor.user().services.instagram.accessToken, text: comentarioAtual}});
					if(retorno.data.meta.code == "429") {
						var pendenciaUsuario = getPendenciaUsuario('idsFotosPendentesComentar', data.slice[i+1], coments);
						pendenciaUsuario.save();
						break;
					}
					else {
						var historicoUsuario = getHistorico(data[i].id, hashtag, 'idFotoComentada');
						historicoUsuario.set('qtdFotoInicial', data.length);
						historicoUsuario.save();
					}
					
					if(++j >= 3) {
						j = 0;
					}
				}
			}
		};
			
	},

	comentarJob: function(hashtag, coments, ids){
		this.unblock();
		for (var j = 0; j < coments.length; j++) {
			var comentarioAtual = coments[j];
			for (var i = 0; i < ids.length; i++) 
			{
				var retorno = HTTP.post("https://api.instagram.com/v1/media/" + ids[i].id + "/comments", {params: {access_token: Meteor.user().services.instagram.accessToken, text: comentarioAtual}});
				if(retorno.data.meta.code == "429") {
					var pendenciaUsuario = getPendenciaUsuario('idsFotosPendentesComentar', ids.slice[i+1], coments);
					pendenciaUsuario.save();
					break;
				}
				else {
					var historicoUsuario = getHistorico(ids[i].id, hashtag, 'idFotoComentada');
					historicoUsuario.save();
				}
				
				if(++j >= 3) {
					j = 0;
				}
			}
		}
	},

	curtirComentar: function(hashtag, coments, checar) {
		if(Meteor.userId) {
			var qtd;
			if(checar == undefined || checar == true) {
				qtd = checarPagamento(hashtag);
			}

			Meteor.call('curtir', hashtag, false, qtd);
			Meteor.call('comentar', hashtag, coments, false, qtd);
		}
	}
});