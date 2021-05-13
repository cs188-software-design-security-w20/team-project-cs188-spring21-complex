import React, { useState } from "react";
import { domain } from "../routes";
import { genCsrfToken } from "../context/auth";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/ApartmentReview.css";

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

function ApartmentReview() {
	const [review, setReview] = useState({});
	const [recaptcha, setRecaptcha] = useState("");

	const postReview = (e) => {
		e.preventDefault();
		review["csrfToken"] = genCsrfToken();
		console.log(review);
		fetch(`${domain}/apartment/review/1`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(review),
			credentials: "include",
		})
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
			})
			.catch((err) => alert(err));
	};

	const handler = async (e) => {
		e.preventDefault();
		let file = document.getElementById("image-upload").files[0];
		let response = await upload_file(file);
		if (response["success"]) {
			// TODO: Should be saved into database
			console.log(response.uuid);
		} else {
			alert(response.message);
		}
	};

	const isDisabled = () => {
		return !recaptcha;
	};

	return (
		<div>
			<div className="wrapper">
				<form className="form-review" onSubmit={postReview}>
					<h2 className="form-review-heading">Review Kelton 515</h2>
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
					<input
						type="text"
						className="form-control"
						name="review"
						placeholder="Your Review"
						required=""
						onChange={(e) => setReview({ ...review, review_text: e.target.value })}
					/>
					Add Image: <input id="image-upload" type="file" onChange={handler} />
					<br />
					<button type="submit">Post</button>
					<ReCAPTCHA
						sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
						onChange={(e) => setRecaptcha(e)}
					/>
					<p>Recaptcha value: {recaptcha}</p>
					<button id="submit" type="submit" disabled={!recaptcha}>
						Post
					</button>
				</form>
			</div>
		</div>
	);
}

export default ApartmentReview;
