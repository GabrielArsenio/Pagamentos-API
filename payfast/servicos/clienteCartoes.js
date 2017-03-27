var restify = require('restify');
	
module.exports = function() {

	//Construtor
	function CartoesClient() {
		this._cliente = restify.createJsonClient({
			url: 'http://localhost:3001'
		});
	}

	CartoesClient.prototype.autoriza = function(cartao, callback) {
		console.log('[PAYFAST clienteCartoes] CARTAO>', cartao);
		this._cliente.post('/cartoes/autoriza', cartao, callback);
	};

	return CartoesClient;
};