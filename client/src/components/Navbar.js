import React, { useState, useEffect } from "react";
import "../App.css";
import "../css/Navbar.css";
import ReorderIcon from "@material-ui/icons/Reorder";
import SearchIcon from "@material-ui/icons/Search";
import { getUser, genCsrfToken } from "../context/auth";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";

function Navbar() {
	const [showLinks, setShowLinks] = useState(false);
	const [auth, setAuth] = useState(false);
	let history = useHistory();

	const logout = (e) => {
		// only send logout request if they're logged in / authenticated
		if (auth) {
			e.preventDefault();
			fetch(`${domain}/user/logout`, {
				method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ csrfToken: genCsrfToken() }),
				credentials: "include",
			})
				.then((response) => response.json())
				.then((response) => {
					// server says correctly authenticated. so redirect to the main page
					console.log(response);

					if (response.success) {
						history.push("/");
						setAuth(false);
						alert("Successfully logged out!");
					}
				})
				.catch((err) => alert(err));
		} else alert("You're not logged in.");
	};

	// if already logged in, kick them out
	useEffect(() => {
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) setAuth(true);
		});
	}, []);

	return (
		<div className="navbar">
			<div className="left-side">
				<a href="/">COMPLEX</a>
			</div>

			<div className="center">
				<input type="text" placeholder="Search for apartments near UCLA" />
				<button className="search">
					<SearchIcon />
				</button>
			</div>

			<div className="right-side">
				<div className="links" id={showLinks ? "hidden" : ""}>
					<a href="/newreview">Post Review</a>
					{!auth && <a href="/login">Login | Sign Up</a>}
					{auth && (
						<React.Fragment>
							<a href="/user-profile">Profile</a>
							<a href="/" onClick={logout}>
								Logout
							</a>
						</React.Fragment>
					)}
				</div>
				<div className="options">
					<button onClick={() => setShowLinks(!showLinks)}>
						<ReorderIcon />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
