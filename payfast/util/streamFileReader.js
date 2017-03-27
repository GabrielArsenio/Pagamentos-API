var fs = require('fs');

fs.createReadStream('./imagem.jpg')
	.pipe(fs.createWriteStream('./imagemStream.jpg'))
	.on('finish', function() {
		console.log('[streamFileReader.js] ARQUIVO ESCRITO COM STREAM');
	});