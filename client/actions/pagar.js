Template.Pagar.events({
	"click .bronze": function() {
		Meteor.call("pagar", "bronze", function(erro, result) {
			if(erro) {
				showMensagemErro();
			}
			else {
				showMensagemSucesso();
			}
		});
	},
	"click .prata": function() {
		Meteor.call("pagar", "prata", function(erro, result) {
			if(erro) {
				showMensagemErro();
			}
			else {
				showMensagemSucesso();
			}
		});
	},
	"click .ouro": function() {
		Meteor.call("pagar", "ouro", function(erro, result) {
			if(erro) {
				showMensagemErro();
			}
			else {
				showMensagemSucesso();
			}
		});
	},
});