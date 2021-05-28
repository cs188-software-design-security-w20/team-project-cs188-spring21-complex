import React, { useEffect, useState } from "react";
import "../App.css";
import "../css/Registration.css";
import { useHistory, useParams } from "react-router-dom";
import { domain } from "../routes";

function ResetPassword() {

	const { token } = useParams();
	
	const [pass, setPass] = useState("");
	const [confirm, setConfirm] = useState("");

	let history = useHistory();

	const submitRegistration = (e) => {
		e.preventDefault();
		fetch(`${domain}/user/resetPassword`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				pass: pass,
				confirm: confirm,
				token: token
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				// server says correctly authenticated. so redirect to the main page
				console.log(response);

				if (response.success) {
					history.push("/login");
					alert("Password successfully reset!");
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
					<h2 className="form-register-heading">Reset Password</h2>

					<input
						type="password"
						className="form-control"
						name="password"
						placeholder="Password"
						required=""
						onChange={(e) => setPass(e.target.value)}
					/>
					<input
						type="password"
						className="form-control"
						name="password"
						placeholder="Confirm Password"
						required=""
						onChange={(e) => setConfirm(e.target.value)}
					/>

					<button className="registerButton" type="submit">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default ResetPassword;
