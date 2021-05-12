import React, {useState} from 'react'
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from 'react-icons/fa'
import "../css/Gallery.css";

const Gallery = ({ slides }) => {
    const [current, setCurrent] = useState(0)
    const length = slides.length

    const nextImage = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }

    const prevImage = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    if(!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    return (
        <div className="gallery">
            <FaArrowAltCircleLeft className="left-arrow"  onClick ={prevImage} />
            
            {slides.map((slide, index) => {
                return (
                    <div className={index === current ? 'slide-active' : 'slide'} key={index}>
                        {index === current && (<img src={slide.image} alt='apt-preview' className='image'/>)}
                    </div>
                )              
            })}

            <FaArrowAltCircleRight className="right-arrow"  onClick ={nextImage} />
        </div>
    )
}

export default Gallery
