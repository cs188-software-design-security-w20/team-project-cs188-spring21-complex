const express = require("express");
const router = express.Router();
const path = require("path");
const dbConn = require("../db.js");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { session } = require("passport");
const authenticator = require("../totp-authenticator");
const getCsrfToken = require("../csrf.js").getCsrfToken;
const mailer = require("../mailer.js");
const jwt = require("jwt-simple");
require("dotenv").config({ path: __dirname + "/.env" });
// ! rename the database table to your local one
const user_table = "users";
const { serverDomain, domain } = require("../routes.js");

// #################################################################################################
//* GET
router.get("/QRCode", async (req, res) => {
	res.json(await authenticator.generateSecretAndQR());
});

router.get("/test", (req, res) => {
	console.log(domain);
	// res.redirect(`${domain}/login`);
	res.status(404).send("404: Not Found");
});

router.get("/verifyEmail/:token", (req, res) => {
	var token = req.params["token"];
	var info = jwt.decode(token, process.env.JWT_SECRET);
	console.log(info);
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err.message);
			res.json({ success: false, message: err.message });
		} else {
			db.query(`SELECT * FROM ${user_table} WHERE username = '${info["user"]}'`, (err, user) => {
				if (err) {
					db.release();
					console.log(err.message);
					res.send(err);
					// return done(null, false, { message: "Error occured, please contact the admin." });
				} else {
					// query returns a list of users, but of size 1 because username should be unique
					if (user.length !== 1) {
						db.release();
						res.json({ success: false, message: "Invalid URL" });
					} else {
						if (user[0].verified == false) {
							db.query(
								`UPDATE ${user_table} SET verified = true WHERE username = '${info["user"]}'`,
								(error, user) => {
									db.release();
									if (error) {
										console.log(error);
										res.json({ success: true, message: error });
									} else {
										console.log("Account verified!");
										res.redirect(`${domain}/login`);
									}
								}
							);
						} else {
							console.log("Already verified");
							res.send("Account already verified");
						}
					}
				}
			});
		}
	});
});

// #################################################################################################
//* DELETE

router.delete("/delete/:id", (req, res) => {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err.message);
			res.json({ success: false, message: err.message });
		}

		// find user based on session user_id & verify 6-digit 2FA with secret key
		db.query(`SELECT * FROM ${user_table} WHERE user_id = '${req.params.id}'`, (err, user) => {
			if (authenticator.verifyTOTP(user[0].secretKey, req.body.totp)) {
				if (user[0].verified) {
					db.query(`DELETE FROM ${user_table} WHERE user_id = ${req.params.id}`, (err, result) => {
						if (err) {
							// we can only alert one message at a time for "unique" keys, since db insertion errors only alert 1 at a time
							let issue = err.message;
							console.log(issue);
							res.json({
								success: false,
								message: "Delete request cannot be processed at this time.",
							});
						} else {
							console.log("Successfully deleted user id:", req.params.id);
							killSession(req, res, (res) => {
								res.json({
									success: true,
									message: "Your account has been erased from existence.",
								});
							});
						}
					});
				} else res.json({ success: false, message: "User email is not verified, can't login." });
			} else res.json({ success: false, message: "The time based code is incorrect." });
		});

		db.release(); // remember to release the connection when you're done
	});
});

// #################################################################################################
//* POST
router.post("/logout", (req, res) => {
	console.log(req.body);
	if (req.body.csrfToken !== getCsrfToken(req)) {
		return res.json({ success: false, message: "Invalid CSRF Token" });
	}
	killSession(req, res, (res) => {
		res.json({ success: true });
	});
});

validate_login = [
	validator
		.check("email")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail()
		.matches("(@(g.)?ucla.edu){1}$")
		.withMessage("This email is not registered with UCLA."),
	validator
		.check("pass")
		.isLength({ min: 8, max: 15 })
		.matches("[0-9]")
		.matches("[A-Z]")
		.withMessage("Password is incorrect.")
		.trim()
		.escape(),
	validator.check("totp", "Invalid Google Authenticator Code").isNumeric().trim().escape(),
];

router.post("/login", validate_login, (req, res, next) => {
	if (req.body.csrfToken !== getCsrfToken(req)) {
		return res.json({ success: false, message: "Invalid CSRF Token" });
	}
	const errors = validator.validationResult(req);
	if (errors.isEmpty()) {
		// if authenticated, redirect to main page, and req.user will have the user_id
		passport.authenticate("local", (err, user, info) => {
			if (err) res.json({ success: false, message: err.message });
			else if (!user) res.json({ success: false, message: info.message });
			else {
				req.login(user, (err) => {
					// at this point, req.user and req.session.passport exists
					if (err) res.json({ success: false, message: err.message });
					req.session.save(() => {
						console.log("Logged in and saving session.", req.sessionID, req.session);
						res.json({ success: true });
					});
				});
			}
		})(req, res, next);
	} else {
		// incorrect inputs
		console.log(errors.errors);
		res.json({ success: false, message: errors.errors });
	}
});

validate_registration = [
	validator
		.check("first", "First name must be 3-15 characters.")
		.isLength({ min: 3, max: 15 })
		.trim()
		.escape(),
	validator
		.check("last", "Last name must be 3-15 characters.")
		.isLength({ min: 3, max: 15 })
		.trim()
		.escape(),
	validator
		.check("email")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail()
		.matches("(@(g.)?ucla.edu){1}$")
		.withMessage("This email is not registered with UCLA."),
	validator
		.check("username", "Username must be 3-15 characters.")
		.isLength({ min: 3, max: 15 })
		.trim()
		.escape(),
	validator
		.check("pass")
		.isLength({ min: 8, max: 15 })
		.withMessage("Password should be between 8-15 characters long.")
		.matches("[0-9]")
		.withMessage("Password must contain a number.")
		.matches("[A-Z]")
		.withMessage("Password must contain an uppercase letter.")
		.trim()
		.escape(),
	validator
		.check("confirm", "Second password should match the first")
		.custom((value, { req, loc, path }) => {
			if (value !== req.body.pass) {
				// throw error if passwords do not match
				throw new Error("Passwords don't match");
			} else {
				return value;
			}
		}),
	validator
		.check("totp")
		.isLength({ min: 6, max: 6 })
		.withMessage("The code should be 6 characters long.")
		.isNumeric()
		.withMessage("The code should be 6 digits.")
		.trim()
		.escape(),
];

router.post(
	"/registration",
	validate_registration,
	runAsyncWrapper(async (req, res, next) => {
		if (req.body.csrfToken !== getCsrfToken(req)) {
			return res.json({ success: false, message: "Invalid CSRF Token" });
		}
		const errors = validator.validationResult(req);
		if (errors.isEmpty()) {
			({ email, first, last, username, pass, secretKey, totp } = req.body);

			hash = await bcrypt.hash(pass, 14);

			// create new account and store the ENCRYPTED information, only if inputs were valid
			// we store emails up until the @____, because an @g.ucla.edu = @ucla.edu
			let info = {
				legal_name: first + " " + last,
				username: username,
				email: email.split("@", 1)[0], // only store everything up to @
				password: hash,
				secretKey: secretKey,
			};

			if (!authenticator.verifyTOTP(secretKey, totp)) {
				return res.send({ success: false, message: "Invalid Authentication Code." });
			}

			console.log(secretKey);
			dbConn.getConnection((err, db) => {
				if (err) {
					console.log("connection failed", err.message);
					res.json({ success: false, message: err.message });
				}
				// SET ? takes the entire info object created above
				db.query(`INSERT INTO ${user_table} SET ?`, info, (err, result) => {
					if (err) {
						// we can only alert one message at a time for "unique" keys, since db insertion errors only alert 1 at a time
						let issue = err.message;
						if (issue.search("username") > -1) issue = "The username is already taken.";
						if (issue.search("'email'") > -1) issue = "This email has already been registered.";

						console.log(issue);
						// req.flash("danger", err.message);
						res.json({ success: false, message: issue });
						// res.redirect("/user/register");
					} else {
						let emailHash = mailer.createVerificationHash(username);
						let URL = `${serverDomain}/user/verifyEmail/${emailHash}`;
						mailer.sendEmail(email, URL);

						console.log("Successfully registered account:", info);
						res.json({ success: true, message: "Account created." });
						// req.flash("success", "Account created");
					}
				});

				db.release(); // remember to release the connection when you're done
			});
		} else {
			// invalid inputs
			console.log(errors.errors);
			res.json({ success: false, message: errors.errors });
		}
	})
);

const vote_table = "user_votes";
const vote_columns = "(user_id, review_id, vote_type)";
router.patch("/review/:id/vote", checkAuthentication, function (req, res) {
	// Logged In

	({ vote_type } = req.body);

	dbConn.getConnection(async (err, db) => {
		if (err) {
			console.log("connection failed", err);
			res.send(err);
			return;
		}
		try {
			const rows = await db.query(
				`SELECT * FROM ${vote_table} WHERE user_id = ${req.user.user_id} AND review_id = ${req.params.id}`
			);
			if (rows.length == 0) {
				// user never voted for this review yet, insert a new row
				await db.query(`INSERT INTO ${vote_table} ${vote_columns} VALUE (?)`, [
					req.user.user_id,
					req.params.id,
					vote_type,
				]);
			} else {
				// Update
				await db.query(
					`UPDATE ${vote_table} SET vote_type = ? WHERE user_id = ${req.user.user_id} AND review_id = ${req.params.id}`,
					vote_type
				);
			}
			res.json({ success: true });
		} catch (e) {
			res.send({ success: false, error: e });
			throw e;
		} finally {
			db.release(); // release connection back to pool regardless of outcome
		}
	});
});

// check that req.user is valid before user accesses some URL
function checkAuthentication(req, res, next) {
	// console.log("Checking if user is authenticated", req.sessionID, req.user);
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.json({ success: false, message: "You are not logged in." });
	}
}

// avoids tons of 'try catch' statements for async functions
function runAsyncWrapper(callback) {
	/*
  return async (req, res, next) => {
      callback(req, res, next).catch(next);
  }
  */
	return async (req, res, next) => {
		try {
			await callback(req, res, next);
		} catch (err) {
			console.log(err.message);
			res.send({ success: false, message: "Error with asynchronous registration." });
			next(err);
		}
	};
}

function killSession(req, res, callback) {
	req.logout(); // clears req.user
	req.session.destroy(() => {
		// res.clearCookie(req.session.cookie.id);
		req.session = null;
		callback(res);
	});
}

exports.checkAuthentication = checkAuthentication;
exports.route = router;
