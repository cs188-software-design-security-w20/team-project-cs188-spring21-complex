import React, { useState } from "react";

function ApartmentReview() {

    const [review, setReview] = useState({});

    const postReview = (e) => {
        e.preventDefault();
        console.log(review);
        fetch('http://localhost:3000/apartment/review/1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(err => alert(err));
    }

    return (
        <div>
            <div className="wrapper">
                <form className="form-review" onSubmit={postReview}>       
                    <h2 className="form-review-heading">Review Kelton 515</h2>
                    <input type="text" className="form-control" name="user_id" placeholder="User ID will be retrieved through session"
                            onChange = {e => setReview({... review, user_id: e.target.value})} />
                    <input type="text" className="form-control" name="bedbath" placeholder="#Bed/#Bath" required=""
                            onChange = {e => setReview({... review, bedbath: e.target.value})} />      
                    <input type="text" className="form-control" name="review" placeholder="Your Review" required=""
                            onChange = {e => setReview({... review, review_text: e.target.value})} />
                    <button type="submit">Post</button>              
                </form>
            </div>
        </div>
    );
}

export default ApartmentReview;
