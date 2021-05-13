import React, { useState, useEffect } from "react";
import { domain } from "../routes";
import { genCsrfToken } from "../context/auth";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/ApartmentReview.css";
import { getUser } from "../context/auth";
import { useHistory } from "react-router-dom";

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
	const [auth, setAuth] = useState(false);

	const postReview = (e) => {
		e.preventDefault();
		if (auth) {
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
			// TODO: Should be saved into database
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
					<textarea
						type="text"
						type="text"
						className="form-control-user-review"
						name="review"
						placeholder="Your Review"
						required=""
						onChange={(e) => setReview({ ...review, review_text: e.target.value })}
					/>

					<div className="upload-images">
						<br />
						<div className="upload-image-msg">Add Image:</div>
						<input id="image-upload" type="file" onChange={handler} />
					</div>
					<br />

					<ReCAPTCHA
						sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
						onChange={(e) => setRecaptcha(e)}
					/>

					<p>Recaptcha value: {recaptcha}</p>
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
