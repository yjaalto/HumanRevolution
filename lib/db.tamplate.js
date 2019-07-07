var mysql = require('mysql');
var db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
    charset: 'utf8mb4'
});
db.connect();
module.exports = db;