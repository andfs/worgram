Meteor.startup(function () {
	SyncedCron.add({
	  name: 'Executar Pendências',
	  schedule: function(parser) {
	    return parser.text('every 28 mins');
	  },
	  job: function() {
	    var pendencias = pendenciasCollection.find({$or: [{idsFotosPendentesCurtir: { $exists: true, $ne: [] } }, 
	    												  {idsFotosPendentesComentar: { $exists: true, $ne: [] } } ]}, {sort: {dataPendencia: -1}});

	    for (var i = 0; i < pendencias.length; i++) {
	    	var pendencia = pendencias[i];

	    	if(pendencia.get(idsFotosPendentesComentar).length > 0 && pendencia.get(idsFotosPendentesCurtir).length > 0) {
	    		Meteor.call('comentarJob', pendencia.get('hashtag'), pendencia.get('comentarios'), pendencia.get('idsFotosPendentesComentar'));
	    		Meteor.call('curtirJob', pendencia.get('hashtag'), pendencia.get('idsFotosPendentesCurtir'));
	    	}
	    	else if(pendencia.get(idsFotosPendentesComentar).length > 0) {
	    		Meteor.call('comentarJob', pendencia.get('hashtag'), pendencia.get('comentarios'), pendencia.get('idsFotosPendentesComentar'));
	    	}
	    	else if(pendencia.get(idsFotosPendentesCurtir).length > 0) {
	    		Meteor.call('curtirJob', pendencia.get('hashtag'), pendencia.get('idsFotosPendentesCurtir'));
	    	}
	    	pendencia.remove();
	    };
	  }
	});
	SyncedCron.start();   
});