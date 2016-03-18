var easyPieChart = function(id, trackColor, scaleColor, barColor, lineWidth, lineCap, size) {
        $('.'+id).easyPieChart({
            trackColor: trackColor,
            scaleColor: scaleColor,
            barColor: barColor,
            lineWidth: lineWidth,
            lineCap: lineCap,
            size: size
        });
    }

Template.Historico.onRendered(function() {
	easyPieChart('main-pie', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.7)', 7, 'butt', 148);
});

Template.Historico.helpers({
	possuiPendencia: function() {
		return pendenciasCollection.find().count() > 0;
	},

    possuiHistorico: function() {
        return historicoCollection.find().count() > 0;
    },

    porcentagemConclusao: function() {
        var pendencias = pendenciasCollection.find();
        var hashtags = [];
        pendencias.forEach(function(pendencia) {
            hashtags.push({
                            qtdPendencia: pendencia.get('idsFotosPendentesCurtir') + pendencia.get('idsFotosPendentesComentar'),
                            hashtag: pendencia.get('hashtag')
                        });
        });

        var total = 0;
        var totalP = 0;
        for (var i = 0; i < hashtags.length; i++) {
            var hashtag = hashtags[i];
            total += historicoCollection.findOne({hashtag: hashtag.hashtag}).qtdFotoInicial;
            totalP += hashtag.qtdPendencia;
        };

        return (totalP / total) * 100;
    },

    historicos: function() {
        return historicoCollection.find();
    }
});