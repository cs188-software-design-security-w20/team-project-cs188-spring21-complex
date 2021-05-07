const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const dbConn = require("../db.js");

// ! rename the database table to your local one
const user_table = "users";

// https://github.com/jaredhanson/passport/issues/208  -> see "login flow of passport"
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// make sure that the local strategy key/pair for usernameField, passwordField matches the names on the form/post request
module.exports = (passport) => {
	/* given the user input email/password, query the db for a matching email (unique)
  if there's a matching email, compare the hashed password with user-inputted password
  return the user object if all goes well
  */
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
								else
									return done(null, false, { message: "User not found or password is incorrect" });
							});
						}
					}
				});

				db.release(); // remember to release the connection when you're done
			});
		})
	);

	/* OPTIMIZING PASSPORT?
  this only works if username, email, userid, roles, etc. is never changed. the db requests ensures updated user objects. also, what's returned by serializeUser is stored in the cookie

  passport.serializeUser( (user, done) => {
    var sessionUser = { _id: user._id, name: user.name, email: user.email, roles: user.roles }
    done(null, sessionUser)
  })

  passport.deserializeUser( (sessionUser, done) => {
    done(null, sessionUser)
  })
  */

	/* (1) Login --> [2] Database --> (3) serializeUser --> [4] Session --> [5] Cookie
  serializeUser is run ONCE after login authentication
    login had produced the user object and passed it to serializeUser
    the user object was loaded into req.user
    this callback is where we extract and return the user_id 
    passport will take that and store it in the cookie
  NOTE: express had already created the session + cookie, and stored the session in req.session
  */
	passport.serializeUser(function (user, done) {
		return done(null, user.user_id);
	});

	/* (1) Authenticated request --> [1] Cookie --> [2] Database --> (3) deserializeUser --> [4] Session
  deserializeUser is run each time the user makes a request after being logged in
    passport grabs the cookie's user_id and passes it to deserializeUser
		this callback is where we retrieve the user object from our db, recreate it and return it
    passport will store that object in req.user
  this ensures that req.user is always updated upon each request
  */
	passport.deserializeUser(function (id, done) {
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
