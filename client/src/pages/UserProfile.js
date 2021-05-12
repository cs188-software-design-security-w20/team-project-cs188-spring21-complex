import React, { useState, useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import "../App.css";
import "../css/Login.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";

function UserProfile() {
	let history = useHistory();
	/*
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");

	const submitLogin = (e) => {
		e.preventDefault();
		fetch(`${domain}/user/login`, {
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
	const [user, setUser] = useState({});
	const [auth, setAuth] = useState(false);
	useEffect(() => {
		fetch(`${domain}/user/profile`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				console.log(response);

				// user is authenticated, so display their information
				if (response.success) {
					setUser(response.user);
					setAuth(true);
				} else {
					// user is not authenticated, so redirect to the login page
					history.push("/login");
					alert(response.message);
				}
			})
			.catch((err) => alert(err));
	}, []);

	return (
		<div>
			<UserNavbar />
			{auth && (
				<div className="wrapper">
					<h2 className="profile-heading">Hello, {user.legal_name}</h2>
					<input
						type="text"
						className="form-control"
						name="username"
						placeholder={user.username}
						required=""
						autofocus=""
					/>
					<input
						type="text"
						className="form-control"
						name="email"
						placeholder={user.email}
						required=""
						autofocus=""
					/>
				</div>
			)}
		</div>
	);
}

export default UserProfile;
