import React, { useEffect, useState } from "react";
import "../App.css";
import "../css/Registration.css";
import { useHistory, useParams } from "react-router-dom";
import { domain } from "../routes";
import { getUser, genCsrfToken } from "../context/auth";

function Reset2FA() {

    const { token } = useParams();
	
	const [totp, setTotp] = useState("");
    const [secretKey, setSecretKey] = useState("");
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
		fetch(`${domain}/user/reset2FA`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				totp: totp,
                secretKey: secretKey["secret"],
				token: token
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				// server says correctly authenticated. so redirect to the main page
				console.log(response);

				if (response.success) {
					history.push("/login");
					alert("2FA successfully reset!");
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
			<div className="wrapper">

                <div className="form-register">
                    <h2>Two Factor Authentication</h2>
                    <p>
                       Please scan this QRcode or enter the secret key manually to reset your QRcode. After, enter the time-based one time
                       password given to verify you registered properly.
                    </p>
                    <div className="center">
                        {secretKey && <img src={secretKey["QRcode"]}></img>}
                        <p>Secret Key: {secretKey["secret"]}</p>
                    </div>
                </div>

				<form className="form-register" onSubmit={submitRegistration}>
					<h2 className="form-register-heading">Reset 2FA</h2>

					<input
						type="text"
						className="form-control"
						name="totp"
						placeholder="Google Authenticator Code"
						required=""
						onChange={(e) => setTotp(e.target.value)}
					/>

					<button className="registerButton" type="submit">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default Reset2FA;
