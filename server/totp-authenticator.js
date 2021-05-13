const speakeasy = require("speakeasy");
const QRcode = require("qrcode");

const KEYLENGTH = 20;

//We will be using base-32 to store the secret keys in the DB
//Generates a secret key that the user will add to google Authenticate to generate codes
async function generateSecretAndQR() {
	//Generate a secret key that will need to be inputted to Google Authenticator
	var secret = speakeasy.generateSecret({
		length: KEYLENGTH,
		name: "Team-Complex",
	});

	var data_url = await QRcode.toDataURL(secret.otpauth_url);

	return {
		//"secret": secret.base32,
		secret: secret.base32,
		QRcode: data_url,
	};
}

//Verifies whether the given code is valid, given the secret key.
function verifyTOTP(secretKey, totpToken) {
	let result = speakeasy.totp.verify({
		secret: secretKey,
		encoding: "base32",
		token: totpToken,
	});

	return result;
}

//Tests the implementation of the 2FA.
let test = async () => {
	var mysecret = await generateSecretAndQR();
	console.log(mysecret["secret"]);
	console.log(await QRcode.toString(mysecret["secret"].otpauth_url));
};

exports.generateSecretAndQR = generateSecretAndQR;
exports.verifyTOTP = verifyTOTP;
