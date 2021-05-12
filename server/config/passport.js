const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const dbConn = require("../db.js");
const totpAuthenticate = require('../totp-authenticator');
// ! rename the database table to your local one
const user_table = "users";

// https://github.com/jaredhanson/passport/issues/208  -> see "login flow of passport"
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// make sure that the local strategy key/pair for usernameField, passwordField matches the names on the form/post request
module.exports = (passport) => {
	/* given the user input email/password, query the db for a matching email (unique)
  we store emails up until the @____, because an @g.ucla.edu = @ucla.edu 
  if there's a matching email, compare the hashed password with user-inputted password
  return the user object if all goes well
  */
	passport.use(
		new LocalStrategy({ usernameField: "email", passwordField: "pass", passReqToCallback: true }, (req, email, pass, done) => {
			dbConn.getConnection((err, db) => {
				if (err) {
					console.log("connection failed", err.message);
					db.release();
					return done(err);
				}
				db.query(
					`SELECT * FROM ${user_table} WHERE email = '${email.split("@", 1)[0]}'`,
					(err, user) => {
						db.release();
						if (err) {
							console.log(err.message);
							return done(err.message);
							// return done(null, false, { message: "Error occured, please contact the admin." });
						} else {
							// query returns a list of users, but of size 1 because email should be unique
							if (user.length !== 1) {
								return done(null, false, {
									message: "This email is not registered with any account.",
								});
							} else {
								bcrypt.compare(pass, user[0].password, (err, match) => {
									if (err) return done(err);
									// throw err;
									else if (match) {
										if(totpAuthenticate.verifyTOTP(user[0].secretKey, req.body.totp)) {
											return done(null, user[0]);
										}
										else return done(null, false, { message: "The time-based code is incorrect." });
									} else return done(null, false, { message: "The password is incorrect." });
								});
							}
						}
					}
				);
			});
		})
	);

	/* (1) Login --> [2] Database --> (3) serializeUser --> [4] Session --> [5] Cookie
  serializeUser is run ONCE after login authentication
    login had produced the user object and passed it to serializeUser
    this callback is where we extract and return whatever we want to store in req.session.passport.user
    passport will also take that and store it in the cookie?
  NOTE: express had already created the session + cookie, and assigned the session to req.session
  */
	passport.serializeUser(function (user, done) {
		let sessionUser = {
			user_id: user.user_id,
			username: user.username,
			legal_name: user.legal_name,
			email: user.email,
		};
		return done(null, sessionUser);
	});

	/* (1) Authenticated request --> [1] Cookie --> [2] Database --> (3) deserializeUser --> [4] Session
  deserializeUser is run each time the user makes a request after being logged in
    passport grabs the cookie's user_id and passes it to deserializeUser
		typically, this callback is where we retrieve the user object from our db, recreate it and return it
      then, passport would store that object in req.user, ensuring that req.user is always updated
    instead, we only need user_id to check whether someone's logged in. so now, just the user_id is stored in req.user
  */
	passport.deserializeUser(function (sessionUser, done) {
		return done(null, sessionUser);
		/*
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
    */
	});
};
