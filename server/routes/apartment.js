const express = require("express");
const router = express.Router();
const dbConn = require("../db.js");
const path = require("path");
const getCsrfToken = require("../csrf").getCsrfToken;

// ! rename the database table to your local one
const apt_table = "apartments";
const review_table = "reviews";
const image_table = "apartment_image";

const { checkAuthentication } = require('./user');


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

// url/apartment/list
router.get("/list", function (req, res) {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		db.query(`SELECT apt_id, apt_name, address, lower_price, latitude, longitude, home_image from ${apt_table}`, (err, rows) => {
			if (err) {
				res.send("ERROR");
			} else {
				res.send(rows);
			}
		});
		db.release(); // remember to release the connection when you're done
	});
});

// url/apartment/{id}
router.get("/:id", function (req, res) {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		console.log("connection success");
		db.query(`SELECT * from ${apt_table} WHERE apt_id = ?`, req.params.id, (err, rows) => {
			if (err) {
				res.send("ERROR");
			} else {
				res.send(rows);
			}
		});
		db.release(); // remember to release the connection when you're done
	});
	// res.send('success');
});

const vote_table = "user-votes";
// url/apartment/{id}/votes
router.get("/:id/votes", checkAuthentication, function (req, res) {
	dbConn.getConnection(async (err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		try {
			const rows = await db.query(`SELECT * FROM ${vote_table} WHERE user_id = ?`, req.user.user_id);
			res.json({ success: true, result: rows })
		} catch (e) {
			res.send({ success: false, error: e });
			throw e;
		} finally {
			db.release(); // release connection back to pool regardless of outcome
		}
	});
});

// url/apartment/{id}/reviews
router.get("/:id/reviews", function (req, res) {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		db.query(`SELECT r.review_num, r.user_id, r.review_text, r.bedbath, r.date, r.cleanliness, r.location, r.amenities, r.landlord, r.noise,
					COUNT(IF(vote_type=1, 1, null)) as upvotes, COUNT(IF(vote_type=2, 1, null)) as downvotes
					FROM ${review_table} r
					LEFT JOIN user_votes uv ON r.review_num=uv.review_id
					WHERE apt_id = ?
					GROUP BY IF(vote_type IS NULL, 0, vote_type)`, req.params.id, (err, rows) => {
			if (err) {
				res.send({ success: false, error: err });
			} else {
				res.send(rows);
			}
		});
		db.release(); // remember to release the connection when you're done
	});
	// res.send('success');
});

router.get("/:id/images", function (req, res) {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		db.query(`SELECT image_uuid AS image FROM ${image_table} WHERE apt_id = ${req.params.id} `, (err, rows) => {
			if (err) {
				res.send({ success: false, error: err });
			} else {
				res.send(rows);
				console.log(rows);
			}
		});
		db.release(); // remember to release the connection when you're done
	});
	// res.send('success');
});


const review_columns = "(apt_id, user_id, bedbath, review_text, date)";
router.post("/:id/review", checkAuthentication, function (req, res) {
	// Validate review
	({ bedbath, review_text } = req.body);
	const row = [req.params.id, req.user.user_id, bedbath, review_text, new Date()];
	let image = null;

	dbConn.getConnection(async (err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		try {
			await db.beginTransaction(); // start a unit of work
			await db.query(`INSERT INTO ${review_table} ${review_columns} VALUES (?)`, [row]);
			if (image) {
				await db.query(`INSERT INTO ${image_table} (?, ?)`, [req.params.id, image]);
			} 
			await db.commit();
			res.json({ success: true })
		} catch (e) {
			res.send({ success: false, error: e });
			throw e;
		} finally {
			db.release(); // release connection back to pool regardless of outcome
		}
	});
});

exports.route = router;
