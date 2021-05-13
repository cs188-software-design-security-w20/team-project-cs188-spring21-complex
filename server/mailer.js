const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/.env" });
const jwt = require("jwt-simple");

let mailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

function createVerificationHash(user) {
	var info = {};
	info.user = user;
	info.expire = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	var token = jwt.encode(info, process.env.JWT_SECRET);

	return token;
}

function sendEmail(userEmail, URL) {
	let mailDetails = {
		from: "teamcomplex.verify@gmail.com",
		to: userEmail,
		subject: "Verify Your Account",
		text: `Thank you for signing up for Complex. Please follow this link to verify your account:\n${URL}`,
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
