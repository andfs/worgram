hashtagsUsadasCollection = new Mongo.Collection('hashtagsUsadas');


HashtagsUsadas = new Astro.Class({
	name: 'HashtagsUsadas',
	collection: hashtagsUsadasCollection

	fields: {
		hashtag: 'string',
		usadaEm: 'date'
	}
});