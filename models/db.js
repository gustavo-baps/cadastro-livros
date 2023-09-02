const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'sql10.freemysqlhosting.net',
    user: 'sql10644036',
    password: 'Fn1VF5iWir',
    database: 'sql10644036'
});

module.exports = connection;