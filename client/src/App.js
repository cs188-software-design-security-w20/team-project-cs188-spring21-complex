import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserProfile from "./pages/UserProfile";
import ApartmentReview from "./pages/ApartmentReview";
import { Route } from "react-router-dom";
import { UserContext } from "./context/auth";
import { useState, useEffect } from "react";

function App() {
	const [user, setUser] = useState({});

	// fetch req.user from server if available, and store in context
	useEffect(() => {
		fetch("http://localhost:3000/checkAuthorization", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				var d = new Date();
				console.log(
					"App.js fetch user at ",
					d.getSeconds(),
					d.getMilliseconds(),
					response.user,
					Object.keys(response.user).length
				);
				setUser(response.user);
			})
			.catch((err) => alert(err));
	}, []);

	return (
		<UserContext.Provider value={user}>
			<div className="App">
				<Route exact path="/" component={Home} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/registration" component={Registration} />
				<Route exact path="/user-profile" component={UserProfile} />
				<Route exact path="/newreview" component={ApartmentReview} />
			</div>
		</UserContext.Provider>
	);
}

export default App;
