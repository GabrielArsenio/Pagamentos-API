var logger = require('../servicos/Logger.js');

module.exports = function(app) {
	app.get('/pagamentos', function(req, res) {
		console.log('Recebido /teste na porta 3000');
		res.send('Teste OK');
	});

	app.get('/pagamentos/pagamento/:id', function(req, res) {
		logger.info('[pagamentos.js] CONSULTANDO PAGAMENTOS');

		var memcachedClient = app.servicos.MemcachedClient(),
			id = req.params.id;

		memcachedClient.get('pagamento-' + id, function(error, retorno) {

			if (error || !retorno) {
				console.log('[MemcachedCliente.js] MISS - CHAVE NAO ENCONTRADA');

				var connection = app.persistencia.connectionFactory(),
					pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

				pagamentoDAO.buscaPorId(id, function(error, resultado) {
					if (error) {
						console.log('[pagamentos.js] ERRO AO CONSULTAR NO BANCO');
						res.status(500).send(error);
						return;
					}
					console.log('[pagamentos.js] PAGAMENTO ENCONTRADO: ', resultado);
					res.json(resultado);
				});

			} else {
				console.log('[MemcachedCliente.js] HIT - VALOR: ', retorno);
				res.json(retorno);
			}
		});
	});

	app.post('/pagamentos/pagamento', function(req, res) {
		console.log('req> /pagamentos/pagamento');

		req.assert('pagamento.forma_de_pagamento', 'Obrigatório informar a forma de pagamento').notEmpty();
		req.assert('pagamento.valor', 'Obrigatório informar um valor decimal').notEmpty().isFloat();

		var connection = app.persistencia.connectionFactory(),
			pagamentoDAO = new app.persistencia.PagamentoDAO(connection),
			pagamento = req.body.pagamento,
			erros = req.validationErrors();

		if (erros) {
			res.status(400).send(erros);
			return;
		}


		pagamentoDAO.salvar(pagamento, function(err, result) {
			if (err) {
				console.log('Erro ao inserir no banco: ' + err);
				res.status(500).send(err);
				return;
			}

			pagamento.id = result.insertId;
			pagamento.status = 'CRIADO';
			pagamento.data = new Date;
			console.log('[PAYFAST] PAGAMENTO CRIADO>', pagamento);

			var memcachedClient = app.servicos.MemcachedClient();

			memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60000, function(error) {
				console.log('[MemcachedCliente.js] NOVA CHAVE ADICIONADA AO CACHE: pagamento-20');
			});

			if (pagamento.forma_de_pagamento == 'cartao') {
				console.log('[PAYFAST] CARTAO>', cartao);

				var cartao = req.body.cartao;

				var clienteCartoes = new app.servicos.clienteCartoes();
				clienteCartoes.autoriza(cartao, function(ex, request, response, retorno) {
					if (ex) {
						console.log('[PAYFAST] ERRO>', ex);
						res.status(400).send(ex);
						return;
					}

					console.log('[PAYFAST] RETORNO>', retorno);

					res.location('http://localhost:3000/pagamentos/pagamento/' + pagamento.id);

					var response = {
						dados_do_pagamento: pagamento,
						cartao: retorno,
						links: [{
							href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
							rel: 'confirmar',
							method: 'PUT'
						}, {
							href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
							rel: 'cancelar',
							method: 'DELETE'
						}]
					};

					res.status(201).json(response);
					return;
				});

			} else {
				res.location('/pagamentos/pagamento/' + pagamento.id);

				var response = {
					dados_do_pagamento: pagamento,
					links: [{
						href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
						rel: 'confirmar',
						method: 'PUT'
					}, {
						href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
						rel: 'cancelar',
						method: 'DELETE'
					}]
				};

				res.json(response);
			}
		});
	});

	app.put('/pagamentos/pagamento/:id', function(req, res) {

		var connection = app.persistencia.connectionFactory(),
			pagamentoDAO = new app.persistencia.PagamentoDAO(connection),
			pagamento = {
				id: req.params.id,
				status: 'CONFIRMADO'
			};

		pagamentoDAO.atualizar(pagamento, function(err) {
			if (err) {
				res.status(500).send(erro);
				return;
			}

			res.send(pagamento);
		});
	});

	app.delete('/pagamentos/pagamento/:id', function(req, res) {

		var connection = app.persistencia.connectionFactory(),
			pagamentoDAO = new app.persistencia.PagamentoDAO(connection),
			pagamento = {
				id: req.params.id,
				status: 'CANCELADO'
			};

		pagamentoDAO.atualizar(pagamento, function(err) {
			if (err) {
				res.status(500).send(erro);
				return;
			}

			res.status(204).send(pagamento);
		});
	});
};