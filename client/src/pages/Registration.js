import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import "../css/Registration.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";
import { getUser, genCsrfToken } from "../context/auth";

function Registration() {
	const [first, setFirst] = useState("");
	const [last, setLast] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [pass, setPass] = useState("");
	const [confirm, setConfirm] = useState("");
	const [secretKey, setSecretKey] = useState("");
	const [totp, setTotp] = useState("");
	let history = useHistory();

	useEffect(() => {
		fetch(`${domain}/user/QRCode`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				//Store the secret key and URL image
				setSecretKey(response);
			});

		// if already logged in, kick them out
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) {
				history.push("/");
				alert("You are already logged in.");
			}
		});
	}, []);

	const submitRegistration = (e) => {
		e.preventDefault();
		fetch(`${domain}/user/registration`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				first: first,
				last: last,
				username: username,
				email: email,
				pass: pass,
				confirm: confirm,
				secretKey: secretKey["secret"],
				totp: totp,
                csrfToken: genCsrfToken()
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				// server says correctly authenticated. so redirect to the main page
				console.log(response);

				if (response.success) {
					history.push("/login");
					alert("You've successfully registered!");
				} else {
					// message can be an array (if input errors) or string (if database errors)
					if (Array.isArray(response.message))
						alert(response.message.reduce((acc, m) => acc + "\n" + m.msg, ""));
					else alert(response.message);
				}
			})
			.catch((err) => alert(err));
	};

	return (
		<div>
			<Navbar />

			<div className="wrapper">
				<div className="form-register">
					<h2>Two Factor Authentication</h2>
					<p>
						To create your account, you must first download the Google Authenticator App. Then, scan
						the QR code or enter the secret key manually. Once authenticated, please type in the
						time-based code below to verify that you've registered with Google Authenticator.
					</p>
					<div className="center">
						{secretKey && <img src={secretKey["QRcode"]}></img>}
						<p>Secret Key: {secretKey["secret"]}</p>
					</div>
				</div>

				<form className="form-register" onSubmit={submitRegistration}>
					<h2 className="form-register-heading">Create Account</h2>
					<input
						type="text"
						className="form-control"
						name="first"
						placeholder="First Name"
						required=""
						autofocus=""
						onChange={(e) => setFirst(e.target.value)}
					/>
					<input
						type="text"
						className="form-control"
						name="last"
						placeholder="Last Name"
						required=""
						autofocus=""
						onChange={(e) => setLast(e.target.value)}
					/>
					<input
						type="text"
						className="form-control"
						name="username"
						placeholder="Username"
						required=""
						autofocus=""
						onChange={(e) => setUsername(e.target.value)}
					/>
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
						type="password"
						className="form-control"
						name="password"
						placeholder="Confirm Password"
						required=""
						onChange={(e) => setConfirm(e.target.value)}
					/>
					<input
						type="text"
						className="form-control"
						name="totp"
						placeholder="Google Authenticator Code"
						required=""
						onChange={(e) => setTotp(e.target.value)}
					/>

					<button className="registerButton" type="submit">
						Register
					</button>
				</form>
			</div>
		</div>
	);
}

export default Registration;
