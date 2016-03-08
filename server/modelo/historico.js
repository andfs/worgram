historicoCollection = new Mongo.Collection('historico');

Historico = new Astro.Class({
  name: 'Historico',
  collection: historicoCollection,

  fields: {
	    userId: 'string',
	    idsFotosCurtidas: {
	    	type: 'array',
		    default: function() {
		        return [];
		    }
	    },
	    idsFotosComentadas: {
	    	type: 'array',
		    default: function() {
		        return [];
		    }
	    },
	    hashtagsUsadas: {
	    	type: 'array',
	    	nested: 'HashtagsUsadas',
		    default: function() {
		    	return [];
		    }
	    }
  }
});