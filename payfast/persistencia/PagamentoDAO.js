module.exports = function() {

	// Construtor
	function PagamentoDAO(connection) {
		this._connection = connection;
	}

	PagamentoDAO.prototype.salvar = function(pagamento, callback) {
		this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
	};

	PagamentoDAO.prototype.atualizar = function(pagamento, callback) {
		this._connection.query('UPDATE pagamentos SET status = ? WHERE id = ?', 
			[pagamento.status, pagamento.id], callback);
	};

	PagamentoDAO.prototype.listar = function(callback) {
		this._connection.query('SELECT * FROM pagamentos', callback);
	};

	PagamentoDAO.prototype.buscaPorId = function(id, callback) {
		this._connection.query('SELECT * FROM pagamentos WHERE id=?', [id], callback);
	};

    return PagamentoDAO;
};