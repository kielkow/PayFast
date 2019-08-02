var mysql = require('mysql');

function createDBConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'kielkow',
        password: 'fioriferk3',
        database: 'payfast'
    });
}

module.exports = function () {
    return createDBConnection;
}