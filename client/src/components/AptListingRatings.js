import React from 'react'
import "../css/AptListingRatings.css";

const AptListingRatings = (props) => {
    const roundedRatingOverall = Math.round(props.ratings.overall * 100)/100;
    const roundedRatingCleanliness = Math.round(props.ratings.cleanliness * 100)/100;
    const roundedRatingAmenities = Math.round(props.ratings.amenities * 100)/100;
    const roundedRatingProximity = Math.round(props.ratings.location * 100)/100;
    const roundedRatingManagement = Math.round(props.ratings.landlord * 100)/100;

    return (
        <div className='apt-listing-ratings'>
            <text className='title'>RATINGS</text>

            <br /><br />

            <div className='rating-info'>
                <text>Overall</text>
               <div>{roundedRatingOverall}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.overall / .05) + '%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>
            
            <div className='rating-info'>
                <text>Cleanliness</text>
               <div>{roundedRatingCleanliness}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.cleanliness / .05) + '%'}}></span></span>
                <text style={{paddingRight: '272px'}}>Dirty</text>
                <text>Clean</text>
            </div>

            <div className='rating-info'>
                <text>Amenities</text>
               <div>{roundedRatingAmenities}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.amenities / .05) + '%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>

            <div className='rating-info'>
                <text>Proximity</text>
               <div>{roundedRatingProximity}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.location / .05) + '%'}}></span></span>
                <text style={{paddingRight: '282px'}}>Far</text>
                <text>Close</text>
            </div>

            <div className='rating-info'>
                <text>Management</text>
               <div>{roundedRatingManagement}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.landlord / .05) + '%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>
        </div>
    )
}

export default AptListingRatings
