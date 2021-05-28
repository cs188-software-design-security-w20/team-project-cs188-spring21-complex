import React, { useEffect, useState } from "react";
import "../App.css";
import "../css/Registration.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";

function ForgotPassword() {
	
	const [email, setEmail] = useState("");

	let history = useHistory();

	const submitRegistration = (e) => {
		e.preventDefault();
		fetch(`${domain}/user/forgotPassword`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				email: email
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				// server says correctly authenticated. so redirect to the main page
				console.log(response);

				if (response.success) {
					history.push("/verifyPasswordReset");
				} else {
					// message can be an array (if input errors) or string (if database errors)
					if (Array.isArray(response.message))
						alert(response.message.reduce((acc, m) => acc + "\n" + m.msg, ""));
					else alert(response.message);
				}
			})
			.catch((err) => alert(err));
	};

	return (
		<div>
			<div className="wrapper">
				<form className="form-register" onSubmit={submitRegistration}>
					<h2 className="form-register-heading">Forgot Password</h2>
                    <p className="form-register-heading">Please enter the email address associated with your account to create a new password.</p>

					<input
						type="text"
						className="form-control"
						name="email"
						placeholder="Email"
						required=""
						onChange={(e) => setEmail(e.target.value)}
					/>

					<button className="registerButton" type="submit">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default ForgotPassword;
