import React, { useState, useEffect } from "react";
import "../css/AptListing.css";
import { domain } from "../routes";


function AptListing(props) {
	return (
		<div className="listing">
			<div className="apt-img">
				<img src={domain + "/uploads/" + props.data.home_image} alt="apt" />
			</div>
			<div className="apt-info">
				<div className="apt-info-name">{props.data.apt_name}</div>
				<div className="apt-info-address1">{props.data.address}</div>
				<div className="apt-info-unit">Price Range: ${props.data.lower_price}-${props.data.upper_price}</div>
			</div>
		</div>
	);
}

export default AptListing;
