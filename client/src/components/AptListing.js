import React, { useState, useEffect } from 'react';
import '../css/AptListing.css'

import aptImage from '../assets/westwood_executive_apt.jpg';

function AptListing(props) {
    return (
        <div className="listing">
            <div className="apt-img">
                <img src={aptImage} alt="apt" />
            </div>
            <div className="apt-info">
                <div className="apt-info-name">{props.data.apt_name}</div>
                <div className="apt-info-address1">{props.data.apt_address}</div>
                <div className="apt-info-address2">ID: {props.data.apt_id}</div>
                <div className="apt-info-unit">${props.data.lower_price}</div>  
            </div>
        </div>
    )
}

export default AptListing
