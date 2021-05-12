import React from 'react'
import "../css/AptListingDescription.css";

const AptListingDescription = ({ info }) => {
    return (
        <div className='apt-listing-description'>
            {info.map((info_bit) => {
                return (
                    <div>
                        <div className='name'>{info_bit.aptName}</div>
                        <div className='address'>{info_bit.address}</div>
                        <div className='unit'>{info_bit.unit}</div>
                        <div className='about'>{info_bit.about}</div>
                    </div>
                )              
            })}
        </div>
    )
}

export default AptListingDescription
