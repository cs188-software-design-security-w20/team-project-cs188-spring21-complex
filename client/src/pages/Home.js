import React from "react";
import "../css/Home.css";
import AptListing from "../components/AptListing";

function Home() {
    return (
        <div>
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
