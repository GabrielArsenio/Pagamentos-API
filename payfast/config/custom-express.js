var express = require('express'),
	consign = require('consign'),
	bodyParser = require('body-parser'),
 	expressValidator = require('express-validator'),
 	morgan = require('morgan'),
 	logger = require('../servicos/Logger.js');

module.exports = function() {
	var app = express();

	app.use(morgan('common', {
		stream: {
			write: function(mensagem) {
				logger.info(mensagem);
			}
		}
	}));

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	app.use(expressValidator());

	consign()
		.include('controllers')
		.then('persistencia')
		.then('servicos')
		.into(app);

	return app;
};