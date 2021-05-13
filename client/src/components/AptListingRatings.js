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
                <text style={{paddingRight: '278px'}}>Price</text>
               <div>{props.ratings.price}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.price / .05) + '%'}}></span></span>
                <text style={{paddingRight: '281px'}}>High</text>
                <text>Low</text>
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
               <div>{props.ratings.proximity}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.proximity / .05) + '%'}}></span></span>
                <text style={{paddingRight: '282px'}}>Far</text>
                <text>Close</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '206px'}}>Management</text>
               <div>{props.ratings.management}</div>
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: (props.ratings.management / .05) + '%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>
        </div>
    )
}

export default AptListingRatings
