import React, { useState, useEffect } from "react";
import "../App.css";
import "../css/Navbar.css";
import ReorderIcon from "@material-ui/icons/Reorder";
import SearchIcon from "@material-ui/icons/Search";
import MapIcon from "@material-ui/icons/Map";
import { IconButton, TextField, InputAdornment, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getUser, genCsrfToken } from "../context/auth";
import { useHistory, Link } from "react-router-dom";
import { domain } from "../routes";

function Navbar() {
	const [showLinks, setShowLinks] = useState(false);
	const [auth, setAuth] = useState(false);
	const [searchList, setSearchList] = useState([]);
	let history = useHistory();

	const logout = (e) => {
		// only send logout request if they're logged in / authenticated
		if (auth) {
			e.preventDefault();
			fetch(`${domain}/user/logout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
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

	useEffect(() => {
		// if logged in, hide "Login|Signup" and show "Post Review, Logout, Profile"
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) setAuth(true);
		});

		// redundant on home and map
		fetch("http://localhost:3000/apartment/list")
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				setSearchList(response);
			})
			.catch((err) => console.error(err));
	}, []);

	const selectApartment = (e, val) => {
		if (val && val.apt_id) {
			history.push("/apartment/" + val.apt_id);
		}
	};

	return (
		<div className="navbar">
			<div className="left-side">
				<a href="/">COMPLEX</a>
			</div>

			<div className="center">
				<Autocomplete
					className="search"
					options={searchList}
					getOptionLabel={(option) => option.apt_name}
					onChange={selectApartment}
					style={{ width: 300 }}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							className="search"
							label="Search for apartments near UCLA"
						/>
					)}
				/>
				<Tooltip title="See Map">
					<Link to="/map">
						<IconButton>
							<MapIcon />
						</IconButton>
					</Link>
				</Tooltip>
			</div>

			<div className="right-side">
				<div className="links" id={showLinks ? "hidden" : ""}>
					{!auth && <a href="/login">Login | Sign Up</a>}
					{auth && (
						<React.Fragment>
							<a href="/newreview">Post Review</a>
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
