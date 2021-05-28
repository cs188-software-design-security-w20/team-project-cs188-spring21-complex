const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/.env" });
const jwt = require("jwt-simple");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");

let mailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

function createVerificationHash(user) {
	var info = {};
	info.reason = "verifyHash";
	info.user = user;
	info.expire = Date.now();
	var token = jwt.encode(info, process.env.JWT_SECRET);

	return token;
}

function createPasswordReset(email) {
	var info = {};
	info.reason = "forgotPassword";
	info.email = email;
	info.expire = Date.now();
	var token = jwt.encode(info, process.env.JWT_SECRET);

	return token;
}

function createNew2FA(email) {
	var info = {};
	info.reason = "forgot2FA";
	info.email = email;
	info.expire = Date.now();
	var token = jwt.encode(info, process.env.JWT_SECRET);

	return token;
}

function sendEmail(userEmail, URL) {
	let mailDetails = {
		from: "teamcomplex.verify@gmail.com",
		to: userEmail,
		subject: "Verify Your Account",
		html: `<h1> Thank you for signing up for Complex. </h1> <br>
      <h3> Please navigate to this link to verify your account: ${URL} </h3>`,
	};

	mailTransporter.sendMail(mailDetails, function (err, data) {
		if (err) {
			console.log("Error Occurs");
		} else {
			console.log("Email sent successfully");
		}
	});
}

function sendResetPassword(userEmail, URL) {
	let mailDetails = {
		from: "teamcomplex.verify@gmail.com",
		to: userEmail,
		subject: "Reset your password",
		html: `<h1> Thank you for using complex </h1> <br>
      <h3> Please navigate to this link to reset your password: ${URL} </h3>
	  <h3>This link is good for 20 minutes.</h3>`,
	};

	mailTransporter.sendMail(mailDetails, function (err, data) {
		if (err) {
			console.log("Error Occurs");
		} else {
			console.log("Email sent successfully");
		}
	});
}

function sendReset2FA(userEmail, URL) {
	let mailDetails = {
		from: "teamcomplex.verify@gmail.com",
		to: userEmail,
		subject: "Reset your Secret Key for 2FA",
		html: `<h1> Thank you for using complex </h1> <br>
      <h3> Please navigate to this link to reset your secret key for your two-factor authentication: ${URL} </h3>
	  <h3>This link is good for 20 minutes.</h3>`,
	};

	mailTransporter.sendMail(mailDetails, function (err, data) {
		if (err) {
			console.log("Error Occurs");
		} else {
			console.log("Email sent successfully");
		}
	});
}


exports.createVerificationHash = createVerificationHash;
exports.sendEmail = sendEmail;
exports.createPasswordReset = createPasswordReset;
exports.createNew2FA = createNew2FA;
exports.sendResetPassword = sendResetPassword;
exports.sendReset2FA = sendReset2FA;