import React, { useState, useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import "../App.css";
import "../css/Login.css";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/auth";

var context_count = 0;

function UserProfile() {
	const user = useUser();
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
	// before rendering profile, check user context to see if they're logged in
	// since app.js takes time to fetch, the context is updated twice, so we need to set a timeout to stay on the page until the context is updated
	const [auth, setAuth] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			context_count++;
			if (Object.keys(user).length > 0) {
				setAuth(true);
			} else {
				if (context_count === 2) {
					history.push("/login");
					alert("You are not logged in.");
				}
			}
		}, 50);
	}, [user]);

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
						placeholder={user.email + "@g.ucla.edu"}
						required=""
						autofocus=""
					/>
				</div>
			)}
		</div>
	);
}

export default UserProfile;
