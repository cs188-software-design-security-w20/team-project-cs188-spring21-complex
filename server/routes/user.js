const express = require("express");
const router = express.Router();
const path = require("path");
const dbConn = require("../db.js");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { session } = require("passport");
const authenticator = require("../totp-authenticator");
// ! rename the database table to your local one
const user_table = "users";

// #################################################################################################
//* GET
router.get("/logout", (req, res) => {
	killSession(req, res, (res) => {
		res.json({ success: true });
	});
});

router.get("/QRCode", async (req, res) => {
	res.json(await authenticator.generateSecretAndQR());
});

// #################################################################################################
//* DELETE

router.delete("/delete/:id", (req, res) => {
	dbConn.getConnection((err, db) => {
		if (err) {
			console.log("connection failed", err.message);
			res.json({ success: false, message: err.message });
		}
		db.query(`DELETE FROM ${user_table} WHERE user_id = ${req.params.id}`, (err, result) => {
			if (err) {
				// we can only alert one message at a time for "unique" keys, since db insertion errors only alert 1 at a time
				let issue = err.message;
				console.log(issue);
				// req.flash("danger", err.message);
				res.json({ success: false, message: issue });
				// res.redirect("/user/register");
			} else {
				console.log("Successfully deleted user id:", req.params.id);
				killSession(req, res, (res) => {
					res.json({ success: true });
				});
				// req.flash("success", "Account created");
			}
		});
		db.release(); // remember to release the connection when you're done
	});
});

// #################################################################################################
//* POST

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
		.withMessage("Password should be between 8-15 characters long.")
		.matches("[0-9]")
		.withMessage("Password must contain a number.")
		.matches("[A-Z]")
		.withMessage("Password must contain an uppercase letter.")
		.trim()
		.escape(),
	validator.check("totp", "Invalid Google Authenticator Code").isNumeric().trim().escape(),
];

router.post("/login", validate_login, (req, res, next) => {
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
		.check("email", "This email is not registered with UCLA.")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail()
		.matches("(@(g.)?ucla.edu){1}$"),
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
		.check("totp", "Invalid Google Authenticator Code")
		.isLength({ min: 6, max: 6 })
		.isNumeric()
		.trim()
		.escape(),
];

router.post(
	"/registration",
	validate_registration,
	runAsyncWrapper(async (req, res, next) => {
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
				res.send({ success: false, message: "Invalid Authentication Code." });
				return;
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
			req.flash("danger", err.message);
			res.redirect("/");
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
module.exports = router;
