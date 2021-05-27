import React, { useState, useEffect } from "react";
import "../App.css";
import "../css/UserProfile.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";
import { getUser, genCsrfToken } from "../context/auth";
//import pfp from '../assets/westwood_executive_apt.jpg';

async function upload_file(file, user_id) {
	let formData = new FormData();
	formData.append("image", file);
	formData.append("csrfToken", genCsrfToken());
	return fetch(`${domain}/upload/user/${user_id}`, {
		method: "POST",
		body: formData,
		mode: "cors",
		credentials: "include",
	})
		.then((res) => {
			if (!res.ok) {
				throw res.statusText;
			}
			return res.json();
		})
		.catch((err) => console.log("err", err));
}

function UserProfile() {
	let history = useHistory();

	// before rendering profile, check user context to see if they're logged in
	const [auth, setAuth] = useState(false);
	const [user, setUser] = useState({});
	const [clickedDelete, setDelete] = useState(false);
	const [totp, setTotp] = useState("");
	const [pfp, setPfp] = useState("");

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

	const handler = async (e) => {
		e.preventDefault();
		let file = document.getElementById("image-upload").files[0];
		if (file) {
			let response = await upload_file(file, user.user_id);
			if (response["success"]) {
				alert("Profile Picture Updated!");
				window.location.reload();
			} else {
				alert(response.message);
			}
		} else {
			alert("Please upload an image before attempting to submit.");
		}
	};

	useEffect(() => {
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) {
				setAuth(true);
				setUser(obj.user);

				if (obj.user.image_uuid) {
					setPfp(`${domain}/uploads/` + obj.user.image_uuid);
				} else {
					setPfp(`${domain}/uploads/DefaultProfilePicture.jpg`);
				}
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

					<img className="pfp" src={pfp} />
					<div className="upload-image">
						<div className="upload-image-message">
							To add or update your profile picture, first click "Choose File" and select the
							desired image. Then, click "Upload Image".{" "}
						</div>
						<input id="image-upload" type="file" /> <br></br>
						<br></br>
						<button onClick={handler}>Upload Image</button>
					</div>

					<table>
						<tr>
							<td>
								<strong> Username: </strong>
							</td>
							<td>{user.username}</td>
						</tr>
						<tr>
							<td>
								<strong> Email: </strong>
							</td>
							<td>{user.email + "@g.ucla.edu"} </td>
						</tr>
					</table>

					<br></br>
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
							<button className="deleteAcc" onClick={delete_account}>
								Yes, I wish to delete my account.
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default UserProfile;
