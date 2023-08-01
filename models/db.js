const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'baps',
    password: '123',
    database: 'livro_db'
});

module.exports = connection;