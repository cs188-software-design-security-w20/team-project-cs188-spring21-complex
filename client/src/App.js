import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserProfile from "./pages/UserProfile";
import ApartmentReview from "./pages/ApartmentReview";
import { Route } from "react-router-dom";
import ApartmentListing from "./pages/ApartmentListing";

function App() {
	return (
		<div className="App">
			<Route exact path="/" component={Home} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/registration" component={Registration} />
			<Route exact path="/user-profile" component={UserProfile} />
			<Route exact path="/apt-listing" component={ApartmentListing} />
			<Route exact path="/newreview" component={ApartmentReview} />
		</div>
	);
}
export default App;
