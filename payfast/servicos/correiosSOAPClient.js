var soap = require('soap');

module.exports = function() {

	//Construtor
	function CorreiosSOAPClient() {
		this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
	}

	CorreiosSOAPClient.prototype.calculaPrazo = function(args, callback) {
		soap.createClient(this._url, function(erro, cliente) {
				console.log('[correiosSOAPClient] CLIENTE SOAP CRIADO');
				cliente.CalcPrazo(args, callback);
			}
		);
	};

	return CorreiosSOAPClient;
};