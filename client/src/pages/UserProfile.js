import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import "../css/Login.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";
import { getUser, genCsrfToken } from "../context/auth";

function UserProfile() {
	let history = useHistory();

	// before rendering profile, check user context to see if they're logged in
	const [auth, setAuth] = useState(false);
	const [user, setUser] = useState({});

	const delete_account = (e) => {
		// only make delete request if they're logged in / authenticated
		if (auth) {
			e.preventDefault();
			fetch(`${domain}/user/delete/` + user.user_id, {
				method: "DELETE",
                body: JSON.stringify({ csrfToken: genCsrfToken() }),
				credentials: "include",
			})
				.then((response) => response.json())
				.then((response) => {
					// server says correctly authenticated. so redirect to the main page
					console.log(response);
					history.push("/");
					alert("Your account has been erased from existence.");
				})
				.catch((err) => alert(err));
		} else alert("You're not logged in.");
	};

	useEffect(() => {
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) {
				setAuth(true);
				setUser(obj.user);
			} else {
				history.push("/login");
				alert("You are not logged in.");
			}
		});
	}, []);

	return (
		<div>
			<Navbar />
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
						placeholder={user.email + "@g.ucla.edu"}
						required=""
						autofocus=""
					/>
					<button onClick={delete_account}>Delete Account</button>
				</div>
			)}
		</div>
	);
}

export default UserProfile;
