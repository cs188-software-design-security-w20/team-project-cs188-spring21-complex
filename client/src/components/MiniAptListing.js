import React from 'react';
import '../css/MiniAptListing.css'

import aptImage from '../assets/westwood_executive_apt.jpg';

function MiniAptListing() {
    return (
        <div className="listing">
            <div className="apt-img">
                <img src={aptImage} alt="apt" />
            </div>
            <div className="apt-info">
                <div className="apt-info-name">Westwood Executive House</div>
                <div className="apt-info-address1">424 Kelton Ave</div>
                <div className="apt-info-address2">Los Angeles, CA 90024</div>
                <div className="apt-info-unit">2B2B | $3,700</div>  
            </div>
        </div>
    )
}

export default MiniAptListing
