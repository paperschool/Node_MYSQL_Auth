var mysql = require('mysql')

var dbParameters = {
  host       : process.env.DB_HOST,
  user       : process.env.DB_USER,
  password   : process.env.DB_PASSWORD,
  database   : process.env.DB_NAME,
  socketPath : '/var/run/mysqld/mysqld.sock'
}

// process.env is fetching information from .env files by given variable
var connection = mysql.createConnection(dbParameters)

connection.connect()

module.exports = connection;

module.exports.parameters = dbParameters;
