import React from "react";
import Navbar from '../components/Navbar'
import "../App.css";
import "../css/Login.css";

function Login() {
    return (
        <div>
            <Navbar />

            <div className="wrapper">
                <form className="form-signin">       
                    <h2 className="form-signin-heading">Please login</h2>
                    <input type="text" className="form-control" name="email" placeholder="Email Address" required="" autofocus="" />
                    <input type="password" className="form-control" name="password" placeholder="Password" required=""/>      
                    <div className="bottom-wrapper">
                        <button className="loginButton" type="submit">Login</button>  
                        <a href="/registration">Or, create an account.</a>
                    </div>                     
                </form>
            </div>
        </div>
    );
}

export default Login;
