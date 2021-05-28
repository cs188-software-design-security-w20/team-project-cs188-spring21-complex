import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserProfile from "./pages/UserProfile";
import { Route } from "react-router-dom";
import ApartmentListing from "./pages/ApartmentListing";
import Navbar from "./components/Navbar";
import VerifyEmail from "./pages/verifyEmail";
import ApartmentMap from "./pages/ApartmentMap/ApartmentMap";
import ResetPassword from "./pages/resetPassword";
import ForgotPassword from "./pages/forgotPassword";
import Forgot2FA from "./pages/forgot2FA";
import verifyPasswordReset from "./pages/verifyPasswordReset";
import verify2FAReset from "./pages/verify2FAReset";
import reset2FA from "./pages/reset2FA";

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
			<Route exact path="/verifyEmail" component={VerifyEmail} />
			<Route exact path="/resetPassword/:token" component={ResetPassword} />
			<Route exact path="/forgotPassword" component={ForgotPassword} />
			<Route exact path="/forgot2FA" component={Forgot2FA} />
			<Route exact path="/verifyPasswordReset" component={verifyPasswordReset} />
			<Route exact path="/reset2FA/:token" component={reset2FA} />
			<Route exact path="/verify2FAReset" component={verify2FAReset} />

		</div>
	);
}
export default App;
