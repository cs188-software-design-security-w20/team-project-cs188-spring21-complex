import React from "react";
import Map from "../../components/Map/Map";

import "./ApartmentMap.css";

function ApartmentMap() {
	return (
		<div className="searchWrapper">
			<Map center={{ lat: 34.062, lng: -118.4441 }} zoom={15} />
		</div>
	);
}

export default ApartmentMap;
