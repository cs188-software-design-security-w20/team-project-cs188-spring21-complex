const mysql = require("mysql");
require("dotenv").config({ path: __dirname + "/.env" });
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	port: process.env.DB_PORT,
});

exports.getConnection = function (callback) {
	pool.getConnection(function (err, conn) {
		if (err) {
			return callback(err);
		}
		callback(err, conn);
	});
};
