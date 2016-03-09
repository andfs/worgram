historicoCollection = new Mongo.Collection('historico');

Historico = new Astro.Class({
  name: 'Historico',
  collection: historicoCollection,

  fields: {
	    userId: 'string',
	    idFotoCurtida: 'string',
	    idFotoComentada: 'string',
	    hashtag: 'string',
	    data: 'date'
  }

});