import Navbar from "../components/Navbar";
import "../css/Registration.css";


function verifyEmail() {

    return (
		<div >
            <h1 className="center">Account Registration successful!</h1>
            <p className="center">Please verify your email by following the link sent to you before logging in.</p>
		</div>
	);
}

export default verifyEmail;