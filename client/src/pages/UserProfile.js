import React, { useState, useEffect } from "react";
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
	const [clickedDelete, setDelete] = useState(false);
	const [totp, setTotp] = useState("");

	const ssd = (e) => {
		setDelete(true);
	};
	const delete_account = (e) => {
		// only make delete request if they're logged in / authenticated
		if (auth && clickedDelete) {
			console.log(totp);
			e.preventDefault();
			fetch(`${domain}/user/delete/` + user.user_id, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ totp: totp, csrfToken: genCsrfToken() }),
				credentials: "include",
			})
				.then((response) => response.json())
				.then((response) => {
					// server says correctly authenticated. so redirect to the main page
					console.log(response);
					if (response.success) {
						history.push("/");
						window.location.reload();
					}
					alert(response.message);
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
					{!clickedDelete && <button onClick={ssd}>Delete Account</button>}
					{clickedDelete && (
						<div className="delete-code">
							<h5 className="delete-inst">Please type in the code to delete your account.</h5>
							<input
								type="text"
								className="form-control"
								name="totp"
								placeholder="Google Authenticator Code"
								required=""
								onChange={(e) => setTotp(e.target.value)}
							/>
							<button onClick={delete_account}>Yes, I wish to delete my account.</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default UserProfile;
