const express = require("express");
const router = express.Router();
const dbConn = require("../db.js");
const validator = require("express-validator");
const path = require("path");
const getCsrfToken = require("../csrf").getCsrfToken;
const { v4: uuidv4 } = require('uuid');
var table = "apartment_image";

router.post("/user/:id", checkAuthentication, async function (req, res, next) {
	if (req.body.csrfToken !== getCsrfToken(req)) {
		return res.json({ success: false, message: "Invalid CSRF Token" });
	}
	// TODO: Check session, ensure user is logged in
	let file = req.files.image;
	if (file !== undefined && (file.mimetype == "image/png" || file.mimetype == "image/jpeg")) {
		// extension are stripped, mimetype checking should be sufficient
		// generate a random UUID filename and move it to the destination
		let uuid = uuidv4();
		let new_path = path.join(process.env.UPLOAD_DIR, uuid);

		let err = await file.mv(new_path);

		if (err) {
			console.log("ERROR: " + err);
		}
		console.log(`Saved ${file.name} to ${new_path}`);

		dbConn.getConnection(async (err, db) => {
			if (err) {
				console.log("connection failed", err);
				res.json({
					success: false,
					uuid: uuid,
				});
				return;
			}
			db.query(
				`UPDATE users SET image_uuid = '${uuid}' WHERE user_id = '${req.params['id']}' `,
				(err, user) => {
					db.release();
					if (err) {
						console.log(err);
						res.json({
							success: false,
							message: err,
						}); 
					}
					else
					{
						res.json({
							success: true,
							message: "success",
						});
					}
		});
	});
}});

router.post("/apt/:id", checkAuthentication, async function (req, res, next) {
	if (req.body.csrfToken !== getCsrfToken(req)) {
		return res.json({ success: false, message: "Invalid CSRF Token" });
	}
	// TODO: Check session, ensure user is logged in
	let file = req.files.image;
	if (file !== undefined && (file.mimetype == "image/png" || file.mimetype == "image/jpeg")) {
		// extension are stripped, mimetype checking should be sufficient
		// generate a random UUID filename and move it to the destination
		let uuid = uuidv4();
		let new_path = path.join(process.env.UPLOAD_DIR, uuid);

		let err = await file.mv(new_path);

		if (err) {
			console.log("ERROR: " + err);
		}
		console.log(`Saved ${file.name} to ${new_path}`);

		dbConn.getConnection(async (err, db) => {
			if (err) {
				console.log("connection failed", err);
				res.json({
					success: false,
					uuid: uuid,
				});
				return;
			}
			db.query(
				`INSERT INTO apartment_image (apt_id, image_uuid) VALUES (${req.params['id']},'${uuid}')`,
				(err, user) => {
					db.release();
					if (err) {
						console.log(err);
						res.json({
							success: false,
							message: err,
						}); 
					}
					else
					{
						res.json({
							success: true,
							message: "success",
						});
					}
		});
	});
}});

// check that req.user is valid before user accesses some URL
function checkAuthentication(req, res, next) {
	// console.log("Checking if user is authenticated", req.sessionID, req.user);
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.json({ success: false, message: "You are not logged in." });
	}
}

exports.route = router;
