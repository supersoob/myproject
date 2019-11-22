var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'lsb74436',
    database: 'voice_user'
});

module.exports = connection;