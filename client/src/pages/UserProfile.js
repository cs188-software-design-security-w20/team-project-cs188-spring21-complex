import React, { useState } from "react";
import UserNavbar from "../components/UserNavbar";
import "../App.css";
import "../css/Login.css";
import { useHistory } from "react-router-dom";

function UserProfile() {
	let history = useHistory();
	/*
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");

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
  */
	// before rendering profile, make server request to see if authenticated, and grab user info
	fetch("http://localhost:3000/user/profile", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// credentials: "include",
	})
		.then((response) => response.json())
		.then((response) => {
			console.log(response);

			// user is authenticated, so display their information
			if (response.success) {
				return (
					<div>
						<UserNavbar />
						<div className="wrapper">
							<h2 className="profile-heading">Hello, {response.user.legal_name}</h2>
							<input
								type="text"
								className="form-control"
								name="username"
								placeholder={response.user.username}
								required=""
								autofocus=""
							/>
							<input
								type="text"
								className="form-control"
								name="email"
								placeholder={response.user.email}
								required=""
								autofocus=""
							/>
						</div>
					</div>
				);
			} else {
				// user is not authenticated, so redirect to the login page
				history.push("/login");
				alert(response.message);
			}
		})
		.catch((err) => alert(err));

	// without this I get "error, nothing returned from render" probably because it takes a while for the fetch statement to fully execute and redirect
	return (
		<div>
			<UserNavbar />
		</div>
	);
}

export default UserProfile;
