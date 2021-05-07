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

const review_table = 'reviews';
const review_columns = '(apt_id, user_id, bedbath, review_text, date)';
router.post("/review/:id", function (req, res) {

	// Validate review
	({ user_id, bedbath, review_text } = req.body);

	const row = [req.params.id, user_id, bedbath, review_text, new Date()];

	console.log(`INSERT INTO ${review_table} ${review_columns} VALUES (${row})`);

	dbConn.getConnection((err, db) => {
		if (err) {
			console.err("connection failed", err);
			res.send(err);
			return;
		}

		db.query(`INSERT INTO ${review_table} ${review_columns} VALUES (?)`, [row], (err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.json(result);
			}
		})
		db.release();
	});
});

module.exports = router;
