import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import "../css/Login.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";
import { getUser, genCsrfToken } from "../context/auth";

function Login() {
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	const [totp, setTotp] = useState("");
	let history = useHistory();

	const submitLogin = (e) => {
		e.preventDefault();
		fetch(`${domain}/user/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: email, pass: pass, totp: totp, csrfToken: genCsrfToken() }),
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				// server says correctly authenticated. so redirect to the main page
				if (response.success) {
					history.push("/");
					alert("Successfully logged in!");
				} else {
					// message can be an array (if input errors) or string (if database errors)
					if (Array.isArray(response.message))
						alert(response.message.reduce((acc, m) => acc + "\n" + m.msg, ""));
					else alert(response.message);
				}
			})
			.catch((err) => alert(err));
	};

	// if already logged in, kick them out
	useEffect(() => {
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) {
				history.push("/");
				alert("You are already logged in.");
			}
		});
	}, []);

	return (
		<div>
			<div className="wrapper">
				<form className="form-signin" onSubmit={submitLogin}>
					<h2 className="form-signin-heading">Enter your account information.</h2>
					<input
						type="text"
						className="form-control"
						name="email"
						placeholder="Email Address"
						required=""
						autofocus=""
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						className="form-control"
						name="password"
						placeholder="Password"
						required=""
						onChange={(e) => setPass(e.target.value)}
					/>
					<input
						type="text"
						className="form-control"
						name="totp"
						placeholder="Google Authenticator Code"
						required=""
						onChange={(e) => setTotp(e.target.value)}
					/>
					<div className="bottom-wrapper">
						<button className="loginButton" type="submit">
							Login
						</button>
						<a href="/registration">Not Registered? Click Here</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
