import React from 'react'
import "../css/AptListingRatings.css";

const AptListingRatings = ({ ratings }) => {
    return (
        <div className='apt-listing-ratings'>
            <text className='title'>RATINGS</text>

            <div className='rating-info'>
                <text style={{paddingRight: '260px', paddingTop: '20px'}}>Overall</text>
                {ratings.map((rating) => { return ( <div>{rating.overall}</div> ) })}
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: '80%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>
            

            <div className='rating-info'>
                <text style={{paddingRight: '278px'}}>Price</text>
                {ratings.map((rating) => { return ( <div>{rating.price}</div> ) })}
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: '60%'}}></span></span>
                <text style={{paddingRight: '281px'}}>High</text>
                <text>Low</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '234px'}}>Amenities</text>
                {ratings.map((rating) => { return ( <div>{rating.amenities}</div> ) })}
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: '80%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '237px'}}>Proximity</text>
                {ratings.map((rating) => { return ( <div>{rating.proximity}</div> ) })}
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: '80%'}}></span></span>
                <text style={{paddingRight: '282px'}}>Far</text>
                <text>Close</text>
            </div>

            <div className='rating-info'>
                <text style={{paddingRight: '206px'}}>Management</text>
                {ratings.map((rating) => { return ( <div>{rating.management}</div> ) })}
            </div>
            <div className='rating-bar'>             
                <span className='bar'><span style={{width: '100%'}}></span></span>
                <text style={{paddingRight: '278px'}}>Bad</text>
                <text>Good</text>
            </div>
        </div>
    )
}

export default AptListingRatings
