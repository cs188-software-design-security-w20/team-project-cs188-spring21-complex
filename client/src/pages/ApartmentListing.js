import React from "react";
import Gallery from '../components/Gallery'
import AptListingDescription from '../components/AptListingDescription'
import AptListingRatings from '../components/AptListingRatings'
import "../App.css";
import "../css/ApartmentListing.css";

function ApartmentListing() {
    return (
        <div>
            <div className='main'>
                <Gallery slides={GalleryData} className='gallery' />
                <div className='info-columns'>
                    <div className='description'>
                        <AptListingDescription info={Description}  />
                    </div>

                    <div className='ratings'>
                        <AptListingRatings ratings={Ratings} />  
                    </div>                                    
                </div>
            </div>
        </div>
    );
}

const GalleryData = [
    {
        image: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/430c3aac0523a2e5c1641a47f408df83-full.webp'
    },

    {
        image: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/55c5323498545f73ab10111375b4227b-full.webp'
    },

    {
        image: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/17a0dc3c40552f9b1c93f88b3ec11491-full.webp'
    },

    {
        image: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/1766934bcf77f501a5821c5d118c2c0c-full.webp'
    },

    {
        image: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/1557d5b5e5beda24cc30befcbbb74c7b-full.webp'
    }
]

const Description = [
    {
        aptName: 'Westwood Executive House'
    },

    {
        address: '424 Kelton Ave, Los Angeles, CA 90024'
    },

    {
        unit: '2b2b | $3,700'
    },

    {
        about: 'Located in the heart of Los Angeles, within minutes from famous cities such as Santa Monica, Brentwood, and Beverly Hills, Westwood Village is a perfect area for students and young adults wanting to meet Hollywood stars, enjoy an active nightlife, sunbathe in Malibu Beach, and enjoy a total “college town” atmosphere.  '
    }
]

const Ratings = [
    {
        overall: '4'
    },

    {
        price: '3'
    },

    {
        amenities: '4'
    },

    {
        proximity: '4'
    },

    {
        management: '5'
    }
]

export default ApartmentListing;
