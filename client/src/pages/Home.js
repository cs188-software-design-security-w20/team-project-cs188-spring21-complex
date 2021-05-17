import React, { useState, useEffect } from "react";
import "../css/Home.css";
import AptListing from "../components/AptListing";
import { Link } from "react-router-dom";
import { domain } from "../routes"

function Home() {
	const [apartmentList, setList] = useState([]);

	useEffect(() => {
		fetch(`${domain}/apartment/list`)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				setList(response);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<div>
			<div className="apt-row">
				{apartmentList.length > 1 &&
					apartmentList.map((apt) => (
						<Link to={"/apartment/" + apt.apt_id}>
							<AptListing data={apt} />
						</Link>
					))}
			</div>
		</div>
	);
}

export default Home;
