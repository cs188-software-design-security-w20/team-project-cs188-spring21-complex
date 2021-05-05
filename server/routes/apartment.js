const express = require("express");
const router = express.Router();
const dbConn = require("../db.js");
const path = require("path");

// ! rename the database table to your local one
const apt_table = "apartments";

// url/apartment
router.get("/", function (req, res) {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		console.log("connection success");
		db.query(`SELECT * from ${apt_table}`, (err, rows) => {
			if (err) {
				res.send("ERROR");
			} else {
				// res.sendFile(path.join(__dirname, '../html/apartment.html'));
				res.send(rows);
			}
		});
		db.release(); // remember to release the connection when you're done

	});
	// res.send('success');
});

// url/apartment/{id}
router.get("/:id", function (req, res) {
	res.sendFile(path.join(__dirname, "../html/apartment.html"));
});

module.exports = router;
