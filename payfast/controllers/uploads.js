var fs = require('fs');

module.exports = function(app) {

	app.post('/upload/imagem', function(req, res) {
		console.log('[uploads.js] RECEBENDO IMAGEM');

		var filename = res.headers.filename;

		req.pipe(fs.createWriteStream('files/' + filename))
			.on('finish', function() {
				console.log('[uploads.js] ARQUIVO ESCRITO');
				res.status(201).send('OK');
			});
	});

};