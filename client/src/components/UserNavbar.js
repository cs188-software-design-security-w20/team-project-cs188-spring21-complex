import React, { useState } from "react";
import "../App.css";
import "../css/Navbar.css";
import ReorderIcon from "@material-ui/icons/Reorder";
import SearchIcon from "@material-ui/icons/Search";

function UserNavbar() {
	const [showLinks, setShowLinks] = useState(false);

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
					<a href="/post-review">Post Review</a>
					<a href="/user-profile">Profile</a>
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

export default UserNavbar;
