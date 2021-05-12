const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const fileupload = require("express-fileupload");

app.use(
	require("cors")({
		credentials: true,
		methods: ["POST", "PUT", "DELETE", "GET", "OPTIONS", "HEAD"],
		origin: "http://localhost:4200",
	})
);

// #################################################################################################
//* Express Middleware
// cookierparser > session > passport initialize/session > app.router

app.use(express.json()); // parse app/json
app.use(express.urlencoded({ extended: true })); // parse x-ww-form-urlencoded

/* express session (static files must come before this)
express creates the session whenver it doesn't detect a session cookie in a request
  the cookie (stores session id, or SID) is stored in the user's browser
  it is sent for every request between server/client, in the request header
if cookie detected, express extracts the SID, searches for the corresoonding session, and loads it into 'req.session', which will be used by passport
! connect-redis to store user sessions? or fileStore 
*/
app.use(
	session({
		secret: "keyboard cat", // The secret key should be changed in the future (maybe read from .env?)
		// dbops.randomString(16),   // generate a 16 random char string, store in .env file
		resave: true,
		saveUninitialized: false, // only store sessions when they've been modified
		cookie: {
			maxAge: 3 * 60 * 1000, // in ms, so minutes = x * 60 * 1000
			httpOnly: true, // prevents browser js from reading cookie session data
			sameSite: "strict",
			// domain: '.our-domain.com' // Set to our domain later
			// secure: true, // This should be uncommented after we switch to HTTPS
		},
	})
);
// --------- after this line, everything is invoked for every user request

app.use(
	fileupload({
		limits: {
			filesize: 50 * 1024 * 1024, // 50MB for now
		},
		useTempFiles: true,
		tempFileDir: "/tmp",
		abortOnLimit: true,
	})
);

// /* refresh the session upon each request
app.use(function (req, res, next) {
	// console.log("%i seconds until session expires!", (10000 - req.session.cookie.maxAge) / 1000);
	req.session._garbage = Date();
	req.session.touch();
	next();
});
// */

// express flash
app.use(flash());

// express message
app.use(function (req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
});

// #################################################################################################
//* Passport

require("./config/passport")(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
	res.locals.user = req.user || null;
	next(); // after handling any request, continue looking for the next route handler to do something more specific (add route argument if you want to directly skip somewhere)
});

// #################################################################################################
//* Routing
const addRoute = (name) => {
	let route = require("./routes/" + name);
	app.use("/" + name, route);
};

addRoute("apartment");
addRoute("user");
addRoute("upload");

// #################################################################################################
//* Main page
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/checkAuthorization", (req, res) => {
	// console.log("Checking if user is authenticated", req.sessionID, req.user);
	if (req.isAuthenticated()) {
		res.json({ user: req.user });
	} else {
		res.json({ user: {} });
	}
});

// Last route hit, nothing found
app.use(function (req, res, next) {
	res.status(404);

	/*if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }*/

	// respond with json
	if (req.accepts("json")) {
		res.json({ error: "Not found" });
		return;
	}
});

app.listen(port, () => {
	console.log(`\nComplex app listening at http://localhost:${port}\n`);
});
