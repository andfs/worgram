var checarPagamento = function() {
	
	if(Meteor.user().pagamento.token && Meteor.user().pagamento.valor && Meteor.user().pagamento.dataPagamento) {
		var dtPagamento = moment(Meteor.user().pagamento.dataPagamento);
		var hj = moment();
		if(Meteor.user().pagamento.valor == Meteor.settings.public.valorBronze) 
		{
			if(dtPagamento.isAfter(hj.subtract(1, 'days')) && dtPagamento.isBefore(hj)) 
			{
			   	return true;
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
			   	return true;
			}
			else 
			{
				throw new Meteor.Error("400", "Tempo de utilização do sistema expirado. Por favor escolha um novo plano");
			}
		}
		else if(dtPagamento.isAfter(hj.subtract(1, 'months')) && dtPagamento.isBefore(hj)) 
		{
		   	return true;
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

Meteor.methods({
	
	procurarHashtag: function(hashtag) {
		if(Meteor.userId) {
			//checarPagamento();
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
	},

	procurarRecentes: function(hashtag, nextId) {
		if(Meteor.userId) {
			//checarPagamento();
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

	curtir: function(hashtag, checar) {
		this.unblock();
		if(Meteor.userId) {
			if(checar == undefined || checar == true) {
				checarPagamento();
			}

			var result = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?access_token=" + Meteor.user().services.instagram.accessToken + "&count=-1");
			var data = result.data.data;

			for (var i = 0; i < data.length; i++) 
			{
				var retorno = HTTP.post("https://api.instagram.com/v1/media/" + data[i].id + "/likes?access_token=" + Meteor.user().services.instagram.accessToken);
				
				if(retorno.data.meta.code == "429") {
					var pendenciaUsuario = new Pendencia();
					pendenciaUsuario.push('idsFotosPendentesCurtir', data.slice[i+1]);
					pendenciaUsuario.set('dataPendencia', new Date());
					pendenciaUsuario.save();
					break;
				}
				else {
					
				}
			};
		}
	},

	comentar: function(hashtag, coments, checar){
		this.unblock();
		if(Meteor.userId) {
			if(checar == undefined || checar == true) {
				checarPagamento();
			}

			var result = HTTP.get("https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?access_token=" + Meteor.user().services.instagram.accessToken + "&count=-1");
			var data = result.data.data;

			for (var i = 0; i < data.length; i++) 
			{
				var retorno = HTTP.post("https://api.instagram.com/v1/media/" + data[i].id + "/comments?access_token=" + Meteor.user().services.instagram.accessToken);
				
				if(retorno.data.meta.code == "429") {
					pendenciaUsuario.push('idsFotosPendentesComentar', data.slice[i+1]);
				}
				else {
					var pendenciaUsuario = new Pendencia();
					pendenciaUsuario.push('idsFotosPendentesCurtir', data.slice[i+1]);
					pendenciaUsuario.set('dataPendencia', new Date());
					pendenciaUsuario.save();
				}
			};
			pendenciaUsuario.save();
		}
	},

	curtirComentar: function(hashtag, coments) {
		if(Meteor.userId) {
			checarPagamento();

			Meteor.call('curtir', hashtag, false);
			Meteor.call('comentar', hashtag, coments, false);
		}
	}
});