var express = require("express");
var router = express.Router();
const path = require("path");
var mysql = require("mysql");
var dbConn = require("../db.js");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// GET #############################################################################################
router.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "../html/login.html"));
});

router.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, "../html/register.html"));
});

router.get("/profile", checkAuthentication, (req, res) => {
	res.sendFile(path.join(__dirname, "../html/profile.html"));
});

// logout
router.get("/logout", (req, res) => {
	req.logout();
	/* destroy cookies upon logout? figure out how to do it when i exit the tab too
  res.status(200).clearCookie('connect.sid', {
      path: '/'
  });
  req.session.destroy(function (err) {
      res.redirect('/');
  });
  req.session = null; // delete cookie

  */
	req.flash("success", "You've logged out");
	res.redirect("/");
});
// POST ############################################################################################
router.post(
	"/register",
	[
		validator.check("first", "First name minimum 2-15 characters").isLength({ min: 2, max: 10 }),
		validator.check("last", "Last name minimum 2-15 characters").isLength({ min: 2, max: 10 }),
		validator.check("email", "Email must be a valid @ucla.edu").isEmail().isLength({ max: 23 }),
		validator
			.check("pass", "Password should be at least 8 characters, up to 15")
			.isLength({ min: 8, max: 15 }),
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
	],
	runAsyncWrapper(async (req, res, next) => {
		const errors = validator.validationResult(req);
		if (errors.isEmpty()) {
			console.log("%s %s %s %s", req.body.first, req.body.last, req.body.email, req.body.pass);

			hash = await bcrypt.hash(req.body.pass, 14);

			// create new account and store the ENCRYPTED information, only if inputs are valid
			let acc = new Account();
			acc.first = req.body.first;
			acc.last = req.body.last;
			acc.email = req.body.email;
			acc.pass = hash;
			acc.save((err) => {
				if (err) {
					console.log(err.message);
					if (err.code === 11000) {
						req.flash("danger", "Email was taken");
						res.redirect("/accounts/register");
					} else {
						req.flash("danger", err.message);
						res.redirect("/accounts/register");
					}
				} else {
					req.flash("success", "Account was successfully created");
					res.redirect("/accounts/login");
				}
			});
		} else {
			// invalid inputs
			console.log(errors.errors);
			res.redirect("/user/register");
		}
	})
);

// access control, check that user is logged in before they try to access some URL
function checkAuthentication(req, res, next) {
	// passport feature
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("danger", "Please login");
		res.redirect("/accounts/login");
	}
}

// avoids tons of 'try catch' statements for async functions
function runAsyncWrapper(callback) {
	/*
  return async (req, res, next) => {
      callback(req, res, next).catch(next);
  }
  */

	// /*
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
	// */
}
module.exports = router;
