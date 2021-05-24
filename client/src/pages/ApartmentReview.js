import React, { useState, useEffect } from "react";
import { domain } from "../routes";
import { genCsrfToken } from "../context/auth";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/ApartmentReview.css";
import { getUser } from "../context/auth";
import { useHistory } from "react-router-dom";
import { Slider, Grid} from '@material-ui/core';

async function upload_file(file) {
	let formData = new FormData();
	formData.append("image", file);
	formData.append("csrfToken", genCsrfToken());
	return fetch(`${domain}/upload`, {
		method: "POST",
		body: formData,
		mode: "cors",
		credentials: "include",
	})
		.then((res) => {
			if (!res.ok) {
				throw res.statusText;
			}
			return res.json();
		})
		.catch((err) => console.log("err", err));
}

function ApartmentReview(props) {
	const [review, setReview] = useState({});
	const [recaptcha, setRecaptcha] = useState("");
	const [auth, setAuth] = useState(false);

	// Used for changing the value of the sliders for the apt-ratings
	const [ratingCleanliness, setRatingCleanliness] = useState(0);
	const [ratingAmenities, setRatingAmenities] = useState(0);
	const [ratingProximity, setRatingProximity] = useState(0);
	const [ratingManagement, setRatingManagement] = useState(0);
	const handleRatingChangeCleanliness = (event, newRating) => {	
		setRatingCleanliness(newRating);
		setReview({ ...review, cleanliness: newRating });
	}
	const handleRatingChangeAmenities = (event, newRating) => {	
		setRatingAmenities(newRating);
		setReview({ ...review, amenities: newRating });
	}
	const handleRatingChangeProximity = (event, newRating) => {	
		setRatingProximity(newRating);
		setReview({ ...review, location: newRating });
	}
	const handleRatingChangeManagement = (event, newRating) => { 
		setRatingManagement(newRating);
		setReview({ ...review, landlord: newRating });
	}

	const postReview = (e) => {
		e.preventDefault();
		if (auth) {
			review["csrfToken"] = genCsrfToken();
			console.log(review);
			console.log(props['apt_data']['apt_id']);
			fetch(`${domain}/apartment/${props['apt_data']['apt_id']}/review`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(review),
				credentials: "include",
			})
				.then((response) => response.json())
				.then((response) => {
					console.log(response);
					window.location.reload();
				})
				.catch((err) => alert(err));
		} else {
			history.push("/login");
			alert("You are not logged in.");
		}
	};

	const handler = async (e) => {
		e.preventDefault();
		let file = document.getElementById("image-upload").files[0];
		let response = await upload_file(file);
		if (response["success"]) {
			console.log(response.uuid);
		} else {
			alert(response.message);
		}
	};

	const isDisabled = () => {
		return !recaptcha;
	};

	// if not logged in, kick them out
	let history = useHistory();
	useEffect(() => {
		getUser().then((obj) => {
			console.log(obj);
			if (Object.keys(obj.user).length > 0) setAuth(true);
		});
	}, []);

	return (
		<div>
			<div className="wrapper">
				<form className="form-review" onSubmit={postReview}>
					<h2 className="form-review-heading">Review {props.apt_data.apt_name}</h2>
					<input
						type="text"
						className="form-control"
						name="user_id"
						placeholder="User ID will be retrieved through session"
						onChange={(e) => setReview({ ...review, user_id: e.target.value })}
					/>
					<input
						type="text"
						className="form-control"
						name="bedbath"
						placeholder="#Bed/#Bath"
						required=""
						onChange={(e) => setReview({ ...review, bedbath: e.target.value })}
					/>

					<div className='user-review-ratings'>
						<div className='form-rating-title'>Cleanliness: {ratingCleanliness}</div> 
						<div className='form-rating-bar'>
							<text className='form-rating-bar-left'>Low</text>
							<Slider className='form-rating-slider'
								rating={ratingCleanliness} 
								onChange={handleRatingChangeCleanliness}
								step={1}
								marks
								min={0}
								max={5}
							/>
							<text className='form-rating-bar-right' style={{paddingLeft: '22px'}}>High</text>
						</div>

						<div className='form-rating-title'>Amenities: {ratingAmenities}</div> 
						<div className='form-rating-bar'>
							<text className='form-rating-bar-left' style={{paddingRight: '21px'}}>Bad</text>
							<Slider className='form-rating-slider'
								rating={ratingAmenities} 
								onChange={handleRatingChangeAmenities}
								step={1}
								marks
								min={0}
								max={5}
							/>
							<text className='form-rating-bar-right'>Good</text>
						</div>

						<div className='form-rating-title'>Proximity: {ratingProximity}</div> 
						<div className='form-rating-bar'>
							<text className='form-rating-bar-left' style={{paddingRight: '25px'}}>Far</text>
							<Slider className='form-rating-slider'
								rating={ratingProximity} 
								onChange={handleRatingChangeProximity}
								step={1}
								marks
								min={0}
								max={5}
							/>
							<text className='form-rating-bar-right' style={{paddingLeft: '17px'}}>Close</text>
						</div>							

						<div className='form-rating-title'>Management: {ratingManagement}</div> 
						<div className='form-rating-bar'>
							<text className='form-rating-bar-left' style={{paddingRight: '21px'}}>Bad</text>
							<Slider className='form-rating-slider'
								rating={ratingManagement} 
								onChange={handleRatingChangeManagement}
								step={1}
								marks
								min={0}
								max={5}
							/>
							<text className='form-rating-bar-right'>Good</text>
						</div>										
					</div>
					<br />

					<textarea
						type="text"
						type="text"
						className="form-control-user-review"
						name="review"
						placeholder="Your Review"
						required=""
						onChange={(e) => setReview({ ...review, review_text: e.target.value })}
					/>
					<br /><br /><br />

					<ReCAPTCHA
						sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
						onChange={(e) => setRecaptcha(e)}
					/>
					{/* <p style={{width:'200px'}}>Recaptcha value: {recaptcha}</p> */}
					
					<br />

					<button className="submit" id="submit" type="submit" disabled={!recaptcha}>
						Post
					</button>
				</form>
			</div>
		</div>
	);
}

export default ApartmentReview;
