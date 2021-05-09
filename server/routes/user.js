const express = require("express");
const router = express.Router();
const path = require("path");
const dbConn = require("../db.js");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { session } = require("passport");

// ! rename the database table to your local one
const user_table = "users";

// #################################################################################################
//* GET
router.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "../html/login.html"));
});

router.get("/registration", (req, res) => {
	res.sendFile(path.join(__dirname, "../html/register.html"));
});

router.get("/profile", checkAuthentication, (req, res) => {
	console.log("Authorization granted for profile.");
	res.json({ success: true, user: req.user });
});

// logout
router.get("/logout", (req, res) => {
	req.logout(); // clears req.user
	req.flash("success", "You've logged out");
	req.session.destroy(() => {
		// res.clearCookie(req.session.cookie.id);
		req.session = null;
		res.redirect("/");
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
];

router.post(
	"/registration",
	validate_registration,
	runAsyncWrapper(async (req, res, next) => {
		const errors = validator.validationResult(req);
		if (errors.isEmpty()) {
			({ email, first, last, username, pass } = req.body);

			hash = await bcrypt.hash(pass, 14);

			// create new account and store the ENCRYPTED information, only if inputs were valid
			let info = {
				legal_name: first + " " + last,
				username: username,
				email: email,
				password: hash,
			};
			console.log(info);

			dbConn.getConnection((err, db) => {
				if (err) {
					console.log("connection failed", err.message);
					res.json({ success: false, message: err.message });
				}
				// SET ? takes the entire info object created above
				db.query(`INSERT INTO ${user_table} SET ?`, info, (err, result) => {
					if (err) {
						console.log(err.message);
						// req.flash("danger", err.message);
						res.json({ success: false, message: err.message });
						// res.redirect("/user/register");
					} else {
						console.log(result);
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
			req.flash("danger", err.message);
			res.redirect("/");
			next(err);
		}
	};
}
module.exports = router;
