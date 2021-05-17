import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import HomeIcon from '@material-ui/icons/Home';
import { domain } from '../../routes'

import './Map.css';

const AptButton = props => <Link className="hint hoverable" 
                                to={"/apartment/" + props.id}
                                lat={props.loc[0]}
                                lng={props.loc[1]}>
                                    <HomeIcon />
                                    <div className="hint__content">
                                      <h4>{props.name}</h4>
                                    </div>
                                </Link>;
const MAP_OPTIONS = {
    restriction: {
        latLngBounds: {north: 34.0876, south: 34.0225, east: -118.3787, west: -118.5109},
        strictBounds: false
    }
}

const Map = (props) => {

  const [list, setList] = useState([]);
  const [hoverKey, setHoverKey] = useState(null);

  useEffect(() => {
      fetch(`${domain}/apartment/list`)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setList(response);
      })
      .catch(err => console.error(err))
  }, []);

  const _onChildMouseEnter = (k) => {console.log(k); setHoverKey(k);}
  const _onChildMouseLeave = () => setHoverKey(null);

  return (
  // Important! Always set the container height explicitly
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyD-FoF9pigRUQhgsInWe6u2S0-4BYrUw04' }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        options={MAP_OPTIONS}
        onChildMouseEnter={_onChildMouseEnter}
        onChildMouseLeave={_onChildMouseLeave}
      >
          { list.map(apt => <AptButton key={apt.apt_id} lat={apt.latitude} hover={hoverKey===apt.apt_id}
                                lng={apt.longitude} id={apt.apt_id} loc={[apt.latitude, apt.longitude]}
                                name={apt.apt_name} />) }
      </GoogleMapReact>
    </div>
  )
}

export default Map;
