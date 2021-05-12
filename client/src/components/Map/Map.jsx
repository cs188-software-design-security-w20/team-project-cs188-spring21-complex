import React from 'react';
import { Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import HomeIcon from '@material-ui/icons/Home';

import './Map.css';

const AptButton = props => <Link to={"/apartment/" + props.id}
                                lat={props.loc[0]}
                                lng={props.loc[1]}>
                                    <HomeIcon />
                                </Link>;
const MAP_OPTIONS = {
    restriction: {
        latLngBounds: {north: 34.0876, south: 34.0225, east: -118.3787, west: -118.5109},
        strictBounds: false
    }
}

const Map = (props) => {
    return (
    // Important! Always set the container height explicitly
      <div className="map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }}
          defaultCenter={props.center}
          defaultZoom={props.zoom}
          options={MAP_OPTIONS}
        >
            <AptButton id={1} loc={[34.0617, -118.4441]} />
        </GoogleMapReact>
      </div>
    )
}

export default Map;