import React from "react";
import Navbar from '../components/Navbar'
import "../App.css";
import "../css/Home.css";
import AptListing from "../components/AptListing";

function Home() {
    return (
        <div>
            <Navbar />

            <div className="apt-row"> 
                <AptListing />
                <AptListing />
                <AptListing />
            </div>

            <div className="apt-row"> 
                <AptListing />
                <AptListing />
                <AptListing />
            </div>
        </div>
    );
}

export default Home;
