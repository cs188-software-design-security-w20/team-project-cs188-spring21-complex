import "../css/Registration.css";

function verifyPasswordReset() {
	return (
		<div>
			<h1 className="center">Email Sent</h1>
			<p className="center">
				If the email entered is registered, you will be receiving a link to reset your password! Please check spam folder if not receiving it.
				This link will expire after 20 minutes.
			</p>
		</div>
	);
}

export default verifyPasswordReset;
