const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
// const config = require('./config/database');
const passport = require("passport");
// app.use(require('cors')());

// #################################################################################################
// Express Middleware
app.use(express.json()); // parse app/json
app.use(express.urlencoded({ extended: true })); // parse x-ww-form-urlencoded

// express session
app.use(
	session({
		secret: "keyboard cat",
		resave: true,
		saveUninitialized: true,
		// cookie: { secure: true }
	})
);

// express flash
app.use(flash());

// express message
app.use(function (req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
});
// #################################################################################################
// Routing
const addRoute = (name) => {
	let route = require("./routes/" + name);
	app.use("/" + name, route);
};

addRoute("apartment");
addRoute("user");

// #################################################################################################
// Main page
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
