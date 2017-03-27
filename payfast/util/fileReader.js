var fs = require('fs');

fs.readFile('./imagem.jpg', function(error, buffer) {
	console.log('[fileReader.js] ARQUIVO LIDO', error);

	fs.writeFile('./imagem2.jpg', buffer, function(err) {
		console.log('[fileReader.js] ARQUIVO ESCRITO', err);
	});
});