const express = require("express");
const router = express.Router();
const dbConn = require("../db.js");
const validator = require("express-validator");
const crypto = require("crypto");
const path = require("path");
<<<<<<< HEAD
const getCsrfToken = require("../csrf").getCsrfToken;

router.post("/", async function(req, res, next) {
    if (req.body.csrfToken !== getCsrfToken(req)) {
        return res.json({ success: false, message: "Invalid CSRF Token"})
    }
	// TODO: Check session, ensure user is logged in

	let file = req.files.image;
	if (file !== undefined && (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')) {
        // extension are stripped, mimetype checking should be sufficient
=======

const validate_image = [
	// TODO
];

router.post("/", validate_image, async function(req, res, next) {
	// TODO: Check session, ensure user is logged in

	let file = req.files.image;
	console.log(file);
	// Check if the uploaded file is a valid image
	const errors = validator.validationResult(req);
	if (file !== undefined && errors.isEmpty()) {
>>>>>>> ac94658... Merge front-end and back-end changes
		// generate a random UUID filename and move it to the destination
		let uuid = crypto.randomUUID()
		let new_path = path.join(process.env.UPLOAD_DIR, uuid);

		let err = await file.mv(new_path);

		if (err) {
			console.log("ERROR: " + err);
		}
<<<<<<< HEAD
		console.log(`Saved ${file.name} to ${new_path}`);

		res.send({
			success: true, uuid: uuid
		});
	} else {
		res.send({
            success: false, message: "Invalid File"
=======
		console.log(`moved ${file.name} to ${new_path}`);

		res.send({
			result: "Success", uuid: uuid
		});
	} else {
		// incorrect inputs
		console.log(errors.errors);
		res.send({
			result: "Invalid File"
>>>>>>> ac94658... Merge front-end and back-end changes
		});
	}
});

module.exports = router;
