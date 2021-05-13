import React from 'react'
import "../css/AptListingDescription.css";

const AptListingDescription = (props) => {
    return (
        <div className='apt-listing-description'>
            <div>
                <div className='name'>{props.name}</div>
                <div className='address'>{props.address}</div>
                <div className='about'>{props.description}</div>
            </div>
        </div>
    )
}

export default AptListingDescription
