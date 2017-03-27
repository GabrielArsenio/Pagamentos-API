var cluster = require('cluster'),
	os = require('os');

var cpus = os.cpus();

console.log('EXECUTANDO THREAD');

if (cluster.isMaster) {
	console.log('THREAD MASTER');

	cpus.forEach(function() {
		cluster.fork();
	});

	cluster.on('listening', function(worker) {
		console.log('CLUSTER RODANDO ' + worker.process.pid);
	});

	cluster.on('exit', worker => {
		console.log('CLUSTER %d PAROU ', worker.process.pid);
		cluster.fork();
	});

} else {
	console.log('THREAD SLAVE');
	require('./index.js');
}