import React, { useState, useEffect } from "react";
import Gallery from "../components/Gallery";
import AptListingDescription from "../components/AptListingDescription";
import AptListingRatings from "../components/AptListingRatings";
import "../App.css";
import "../css/ApartmentListing.css";
import { useParams } from "react-router-dom";
import ApartmentReview from "./ApartmentReview";
import { getUser } from "../context/auth";
import { domain } from "../routes";
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import { ThumbUp, ThumbDown } from '@material-ui/icons'

function ApartmentListing(props) {
	const [reviews, setReviews] = useState([]);
	const [badPage, setBadPage] = useState(false); // if navigated without apt id
	const [noReviews, setNoReviews] = useState(false);
	const [auth, setAuth] = useState(false);
	const [apt, setApartment] = useState({});
	const [ratings, setRatings] = useState({});
	const [userUpvotes, setUserUpvotes] = useState([]);
	const [userDownvotes, setUserDownvotes] = useState([]);
	const [GalleryData, setGalleryData] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		if (!id) {
			setBadPage(true);
		}
		fetch(`${domain}/apartment/` + id + "/reviews", {
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				// [apartment reviews]
				setReviews(response);

				let len = response.length + 0.0;
				let ratings = {
					cleanliness: response.reduce((a, b) => a + b.cleanliness, 0)/len || 0,
					amenities: response.reduce((a, b) => a + b.amenities, 0)/len || 0,
					location: response.reduce((a, b) => a + b.location, 0)/len || 0,
					landlord: response.reduce((a, b) => a + b.landlord, 0)/len || 0,
				};
				ratings['overall'] = len ? (ratings.cleanliness + ratings.amenities + ratings.location + ratings.landlord)/4 : 0
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
			// server says correctly authenticated. so redirect to the main page
			// console.log(response);
		})
		.catch((err) => alert(err));

		fetch(`${domain}/apartment/` + id, {
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

		fetch(`${domain}/user/review/votes`, {
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
		.then((response) => response.json())
		.then((response) => {
			if (response.success) {
				setUserUpvotes(response.results.filter(row => row.vote_type == 1).map(row => row.review_id));
				setUserDownvotes(response.results.filter(row => row.vote_type == 2).map(row => row.review_id));
			}
		})
		.catch((err) => {
			console.error(err);
		});

		// fetch(`${domain}/users/review/vote`, {
		// 	headers: { "Content-Type": "application/json" },
		// 	credentials: "include",
		// })
		// .then((response) => response.json())
		// .then((response) => {
		// 	setUser(response[0]);
		// })
		// .catch((err) => {
		// 	console.error(err);
		// });

		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) setAuth(true);
		});
	}, []);

	const toggleUpvote = (id) => {
		if (!auth) return;
		let newType;
		if (userUpvotes.includes(id)) {
			newType = 0;
		} else {
			newType = 1;
		}
		fetch(`${domain}/user/review/` + id + "/vote", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({vote_type: newType})
		})
		.then(response => response.json())
		.then(response => {
			let review = reviews.find(r => r.review_num == id);
			if (userUpvotes.includes(id)) {
				review.upvotes--;
				userUpvotes.splice(userUpvotes.indexOf(id), 1);
			} else {
				review.upvotes++;
				userUpvotes.push(id);
			}
			if (userDownvotes.includes(id)) {
				review.downvotes--;
				userDownvotes.splice(userDownvotes.indexOf(id), 1);
			} else {
				review.downvotes++;
				userDownvotes.push(id);
			}
			setReviews([...reviews]);
		})
		.catch(err => console.error(err))
	};

	const toggleDownvote = (id) => {
		if (!auth) return
		let newType;
		if (userDownvotes.includes(id)) {
			newType = 0;
		} else {
			newType = 2;
		}
		fetch(`${domain}/user/review/` + id + "/vote", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({vote_type: newType})
		})
		.then(response => response.json())
		.then(response => {
			let review = reviews.find(r => r.review_num == id);
			if (userDownvotes.includes(id)) {
				review.downvotes--;
				userDownvotes.splice(userDownvotes.indexOf(id), 1);
			} else {
				review.downvotes++;
				userDownvotes.push(id);
			}
			if (userUpvotes.includes(id)) {
				review.upvotes--;
				userUpvotes.splice(userUpvotes.indexOf(id), 1);
			} else {
				review.upvotes++;
				userUpvotes.push(id);
			}
			setReviews([...reviews]);
		})
		.catch(err => console.error(err))
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
				{!auth && <h2>Please login to post a review.</h2>}
				<br />
				{reviews.map((review) => (
					<div className="single-review" key={review.review_num}>
						<div className='single-review-top-info'>
							<div className='info-1'>
								<div><b>User: </b>{review.username}</div>
								<div><b>Bed/Bath: </b>{review.bedbath}</div>
							</div>
							<div className='info-2'>
								<div className='col-1'>
									<div className='review-rating-spacing'>
										<div className='small-space'>Cleanliness:</div>
										<div>{review.cleanliness}</div>										
									</div>
									<div className='review-rating-spacing'>
										<div className='small-space'>Amenities:</div>											
										<div>{review.amenities}</div>
									</div>
								</div>
								<div className='col-2'>
									<div className='review-rating-spacing'>
										<div className='small-space'>Proximity: </div>											
										<div>{review.location}{" "}</div>
									</div>
									<div className='review-rating-spacing'>
										<div className='small-space'>Management: </div>											
										<div>{review.landlord}</div>									
									</div>
								</div>																																					
							</div>
						</div>
						
						<div className='single-review-text'><b>Review:</b> {review.review_text}</div>
						
						<div className="voting">
							<Tooltip title={auth ? "" : "Please login to vote"}>
								<IconButton onClick={() => toggleUpvote(review.review_num)}>
									{userUpvotes.includes(review.review_num) ?
										<ThumbUp style={{color: '#005AB3'}} />
										:
										<ThumbUp />
									}
								</IconButton>
							</Tooltip>
							<p>{review.upvotes - review.downvotes}</p>
							<Tooltip title={auth ? "" : "Please login to vote"}>
								<IconButton onClick={() => toggleDownvote(review.review_num)}>
									{userDownvotes.includes(review.review_num) ?
										<ThumbDown style={{color: '#005AB3'}} />
										:
										<ThumbDown />
									}
								</IconButton>
							</Tooltip>
						</div>
						<br />
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
