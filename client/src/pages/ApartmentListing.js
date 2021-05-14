import React, { useState, useEffect } from "react";
import Gallery from "../components/Gallery";
import AptListingDescription from "../components/AptListingDescription";
import AptListingRatings from "../components/AptListingRatings";
import "../App.css";
import "../css/ApartmentListing.css";
import { useParams } from "react-router-dom";
import ApartmentReview from "./ApartmentReview";
import { getUser } from "../context/auth";
import { CircularProgress } from '@material-ui/core';
import { domain } from "../routes";


function ApartmentListing(props) {
	const [reviews, setReviews] = useState([]);
	const [badPage, setBadPage] = useState(false); // if navigated without apt id
	const [noReviews, setNoReviews] = useState(false);
	const [auth, setAuth] = useState(false);
	const [apt, setApartment] = useState({});
	const [ratings, setRatings] = useState({});
	const [GalleryData, setGalleryData] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		if (!id) {
			setBadPage(true);
		}
		fetch("http://localhost:3000/apartment/" + id + "/reviews", {
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				// [apartment reviews]
				console.log(response);
				setReviews(response);

				let len = response.length + 0.0;
				let ratings = {
					price: 5,
					amenities: response.reduce((a, b) => a + b.amenities, 0)/len || 0,
					proximity: response.reduce((a, b) => a + b.location, 0)/len || 0,
					management: response.reduce((a, b) => a + b.landlord, 0)/len || 0,
				};
				ratings['overall'] = len ? (ratings.price + ratings.amenities + ratings.proximity + ratings.management)/len : 0
				setRatings(ratings);

				if (response.length === 0) {
					setNoReviews(true);
					return;
				}
			})
			.catch((err) => {
				setBadPage(true);
				console.error(err);
			});
		fetch(`${domain}/apartment/` + id + "/images", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			//body: JSON.stringify({ totp: totp, csrfToken: genCsrfToken() }),
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				response.forEach((element,index,arr) => {
					arr[index]['image'] = `${domain}/uploads/${element['image']}`;
				});
				setGalleryData(response);
				console.log(response);
				// server says correctly authenticated. so redirect to the main page
				// console.log(response);
			})
			.catch((err) => alert(err));
		fetch("http://localhost:3000/apartment/" + id, {
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				setApartment(response[0]);
			})
			.catch((err) => {
				setBadPage(true);
				console.error(err);
			});

		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) setAuth(true);
		});
	}, []);

	const toggleUpvote = (e) => {
		// TODO: check if user is logged in
		if (auth) {
			// set toggles here?
			alert("hello");
		}
	};

	if (badPage) {
		return (
			<div className="main">
				<h1>Error: 404 Apartment Not Found</h1>
			</div>
		);
	}

	let reviewJSX = <p>Loading...</p>; // default thing shown where reviews will be
	if (noReviews) {
		reviewJSX = (
			<div className="review-list">
				<p>There are no reviews yet, be the first!</p>
				{!auth && <p>Please login if you wish to post a review.</p>}
				{/* <div className="post-review-button">
					<a className="post-review" href="/newreview">
						Post Review
					</a>
				</div> */}
			</div>
		);
	} else if (reviews) {
		reviewJSX = (
			<div className="review-list">
				{!auth && <p>Please login if you wish to post a review.</p>}

				{reviews.map((review) => (
					<div className="review" key={review.review_num}>
						<p>user: {review.user_id}</p>
						<p>bedbath: {review.bedbath}</p>
						<p>review: {review.review_text}</p>
						<p>upvotes: {review.upvotes}</p>
						<p>downvotes: {review.downvotes}</p>
						<p>
							scores (clean, location, amenities, landlord): {review.cleanliness} {review.location}{" "}
							{review.amenities} {review.landlord}
						</p>
						<button onClick={toggleUpvote}>UP!</button>
					</div>
				))}
			</div>
		);
	}

	if (apt && ratings) {
		return (
			<div className="main">
				<Gallery slides={GalleryData} className="gallery" />
				<div className="info-columns">
					<div className="description">
						<AptListingDescription name={apt.apt_name} address={apt.address} description={apt.description}/>
					</div>

					<div className="ratings">
						<AptListingRatings ratings={ratings} />
					</div>
				</div>
				<div className="info-columns">{auth && <ApartmentReview apt_data={apt} />}</div>
				<div className="info-columns">
					<div className="reviews">{reviewJSX}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="main">
			<CircularProgress style={{marginLeft: '50%', marginTop: '60px'}}/>
		</div>
	)
}

// const GalleryData = [
// 	{
// 		image:
// 			"https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/430c3aac0523a2e5c1641a47f408df83-full.webp",
// 	},

// 	{
// 		image:
// 			"https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/55c5323498545f73ab10111375b4227b-full.webp",
// 	},

// 	{
// 		image:
// 			"https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/17a0dc3c40552f9b1c93f88b3ec11491-full.webp",
// 	},

// 	{
// 		image:
// 			"https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/1766934bcf77f501a5821c5d118c2c0c-full.webp",
// 	},

// 	{
// 		image:
// 			"https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/1557d5b5e5beda24cc30befcbbb74c7b-full.webp",
// 	},
// ];

const Description = [
	{
		aptName: "Westwood Executive House",
	},

	{
		address: "424 Kelton Ave, Los Angeles, CA 90024",
	},

	{
		unit: "2b2b | $3,700",
	},

	{
		about:
			"Located in the heart of Los Angeles, within minutes from famous cities such as Santa Monica, Brentwood, and Beverly Hills, Westwood Village is a perfect area for students and young adults wanting to meet Hollywood stars, enjoy an active nightlife, sunbathe in Malibu Beach, and enjoy a total “college town” atmosphere.  ",
	},
];

const Ratings = [
	{
		overall: "4",
	},

	{
		price: "3",
	},

	{
		amenities: "4",
	},

	{
		proximity: "4",
	},

	{
		management: "5",
	},
];

export default ApartmentListing;
