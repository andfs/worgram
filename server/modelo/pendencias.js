pendenciasCollection = new Mongo.Collection('pendencias');

Pendencia = new Astro.Class({
  name: 'Pendencia',
  collection: pendenciasCollection,

  fields: {
	    userId: 'string',
	    dataPendencia: {
	    	type: 'date',
	    	immutable: true
	    },
	    idsFotosPendentesCurtir: {
	    	type: 'array',
		    default: function() {
		        return [];
		    }
	    },
	    idsFotosPendentesComentar: {
	    	type: 'array',
		    default: function() {
		        return [];
		    }
	    },
	    hashtag: 'string'
  }
});