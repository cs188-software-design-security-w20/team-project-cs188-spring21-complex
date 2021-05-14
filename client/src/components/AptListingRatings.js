import React from 'react'
import "../css/AptListingRatings.css";

const AptListingRatings = (props) => {
    return (
        <div className='apt-listing-ratings'>
            <text className='title'>RATINGS</text>

            <div className='rating-info'>
                <text style={{paddingRight: '260px', paddingTop: '20px'}}>Overall</text>
               <div>{props.ratings.overall}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.overall / .05) + '%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>
            

            <div className='rating-info'>
                <text style={{paddingRight: '226px'}}>Cleanliness</text>
               <div>{props.ratings.cleanliness}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.cleanliness / .05) + '%'}}></span></span>
                <text style={{paddingRight: '272px'}}>Dirty</text>
                <text>Clean</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '234px'}}>Amenities</text>
               <div>{props.ratings.amenities}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.amenities / .05) + '%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '237px'}}>Proximity</text>
               <div>{props.ratings.location}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.location / .05) + '%'}}></span></span>
                <text style={{paddingRight: '282px'}}>Far</text>
                <text>Close</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '206px'}}>Management</text>
               <div>{props.ratings.landlord}</div>
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
