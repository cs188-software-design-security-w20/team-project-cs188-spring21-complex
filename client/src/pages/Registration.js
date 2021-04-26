import React from "react";
import Navbar from '../components/Navbar'
import "../App.css";
import "../css/Registration.css";

function Registration() {
    return (
        <div>
            <Navbar />

            <div className="wrapper">
                <form className="form-register">       
                    <h2 className="form-register-heading">Create Account</h2>
                    <input type="text" className="form-control" name="username" placeholder="Username" required="" autofocus="" />
                    <input type="text" className="form-control" name="email" placeholder="Email Address" required="" autofocus="" />
                    <input type="password" className="form-control" name="password" placeholder="Password" required=""/>
                    <input type="c_password" className="form-control" name="password" placeholder="Confirm Password" required=""/>
                    <button className="registerButton" type="submit">Register</button>   
                </form>
            </div>
        </div>
    );
}

export default Registration;
