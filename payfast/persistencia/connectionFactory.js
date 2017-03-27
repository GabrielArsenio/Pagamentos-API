var mysql = require('mysql');

module.exports = function() {
	function createDBConnection() {
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'mysql4474',
			database: 'payfast'
		});
	}

	return createDBConnection;
}