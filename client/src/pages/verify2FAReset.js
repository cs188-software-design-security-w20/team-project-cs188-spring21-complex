import "../css/Registration.css";

function verify2FAReset() {
	return (
		<div>
			<h1 className="center">Email Sent</h1>
			<p className="center">
				If the email entered is registered, you will be receiving a link to create a new secret key for your two-factor authentication! Please check spam folder if not receiving it.
				This link will expire after 20 minutes.
			</p>
		</div>
	);
}

export default verify2FAReset;
