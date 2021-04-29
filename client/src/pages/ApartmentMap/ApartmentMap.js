import React from "react";
import Map from '../../components/Map/Map';

import './ApartmentMap.css';

function ApartmentMap() {
    return (
        <div className="searchWrapper">
            <div className="searchResults">
            </div>
            <Map center={{lat: 34.0617, lng: -118.4441}} zoom={18}/>
        </div>
    );
}

export default ApartmentMap;
