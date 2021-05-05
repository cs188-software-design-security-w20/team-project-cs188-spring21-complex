const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const dbConn = require("../db.js");

// ! rename the database table to your local one
const user_table = "users";

// make sure that local strat key/pair is username/password matching the name on the req
// mines is req.email, req.pass
module.exports = (passport) => {
	passport.use(
		new LocalStrategy({ usernameField: "email", passwordField: "pass" }, (email, pass, done) => {
			dbConn.getConnection((err, db) => {
				if (err) {
					console.log("connection failed", err);
					throw err;
				}
				db.query(`SELECT * FROM ${user_table} WHERE email = '${email}'`, (err, user) => {
					if (err) {
						console.log(err);
						return done(null, false, { message: "Error occured, please contact the admin." });
					} else {
                        // query returns a list of users, but of size 1 because email should be unique
                        if (user.length !== 1) {
                            return done(null, false, { message: "User not found or password is incorrect!" });
                        } else {
                            bcrypt.compare(pass, user[0].password, (err, match) => {
                                if (err) throw err;
                                else if (match) return done(null, user[0]);
                                else return done(null, false, { message: "User not found or password is incorrect" });
                            });
                        }
					}
				});

				db.release(); // remember to release the connection when you're done
			});
		})
	);
	passport.serializeUser(function (user, done) {
		// console.log(user);
		return done(null, user.user_id);
	});

	passport.deserializeUser(function (id, done) {
		// Account.findById(id, function (err, user) {
		// 	return done(err, user);
		// });

		dbConn.getConnection((err, db) => {
			if (err) {
				console.log("connection failed", err);
				throw err;
			}
			db.query(`SELECT * FROM ${user_table} WHERE user_id = ${id}`, (err, user) => {
				return done(err, user[0]);
			});

			db.release(); // remember to release the connection when you're done
		});
	});
};
