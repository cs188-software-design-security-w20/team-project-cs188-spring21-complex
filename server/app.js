const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const fileupload = require("express-fileupload");
// const csurf = require("csurf");
// app.use(require('cors')());

// #################################################################################################
//* Express Middleware
app.use(express.json()); // parse app/json
app.use(express.urlencoded({ extended: true })); // parse x-ww-form-urlencoded

// express session
app.use(
	session({
		secret: "keyboard cat", // The secret key should be changed in the future (maybe read from .env?)
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: 7 * 86400 * 1000, // Expire after 7 days
			httpOnly: true, // prevents js running on browser to read cookies
			sameSite: "strict",
			// domain: '.our-domain.com' // Set to our domain later
			// secure: true, // This should be uncommented after we switch to HTTPS
		},
	})
);

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

// app.use(csurf());
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
