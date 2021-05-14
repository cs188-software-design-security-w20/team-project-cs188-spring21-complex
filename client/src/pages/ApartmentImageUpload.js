import React, { useState, useEffect } from "react";
import "../App.css";
import "../css/UserProfile.css";
import { useHistory } from "react-router-dom";
import { domain } from "../routes";
import { getUser, genCsrfToken } from "../context/auth";

async function upload_file(file, apt_id) {
	let formData = new FormData();
	console.log(file);
	formData.append("image", file);
	formData.append("csrfToken", genCsrfToken());
	return fetch(`${domain}/upload/apt/${apt_id}`, {
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

function imageUpload() {

	const handler = async (e) => {
		e.preventDefault();
		let file = document.getElementById("image-upload").files[0];
		let response = await upload_file(file,7);
		if (response["success"]) {
			// TODO: Should be saved into database
			console.log(response.uuid);
		} else {
			alert(response.message);
		}
	};

	return (
		<div>
            <div className='upload-image'>
                <div className='upload-image-message'>Add/Update Profile Picture:</div>
                <input id="image-upload" type="file" onChange={handler} />
            </div>					
		</div>
	);
}

export default imageUpload;
