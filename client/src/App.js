import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserProfile from "./pages/UserProfile";
import ApartmentReview from "./pages/ApartmentReview";
import { Route } from "react-router-dom";
import ApartmentListing from "./pages/ApartmentListing";
import Navbar from './components/Navbar';
import VerifyEmail from "./pages/verifyEmail";
import ApartmentMap from './pages/ApartmentMap/ApartmentMap';

function App() {
	return (
		<div className="App">
			<Navbar />
			<Route exact path="/" component={Home} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/registration" component={Registration} />
			<Route exact path="/user-profile" component={UserProfile} />
			<Route exact path="/map" component={ApartmentMap} />
			<Route path="/apartment/:id" component={ApartmentListing} />
			<Route exact path="/newreview" component={ApartmentReview} />
			<Route exact path="/verifyEmail" component={VerifyEmail} />
		</div>
	);
}
export default App;
