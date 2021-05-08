import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import "../css/Login.css";
import { useHistory } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	let history = useHistory();

	const submitLogin = (e) => {
		e.preventDefault();
		fetch("http://localhost:3000/user/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: email, pass: pass }),
		})
			.then((response) => response.json())
			.then((response) => {
				// server says correctly authenticated. so redirect to the main page
				console.log(response);

				if (response.success) {
					history.push("/");
					alert("You're logged in!");
				} else {
					history.push("/login");
					alert(response.message);
				}
			})
			.catch((err) => alert(err));
	};

	return (
		<div>
			<Navbar />

			<div className="wrapper">
				<form className="form-signin" onSubmit={submitLogin}>
					<h2 className="form-signin-heading">Please login</h2>
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
					<div className="bottom-wrapper">
						<button className="loginButton" type="submit">
							Login
						</button>
						<a href="/registration">Or, create an account.</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
