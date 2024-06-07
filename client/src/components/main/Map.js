import React, { useState } from 'react';
import ReactMapGL, {
  Marker,
  Popup,
  FlyToInterpolator,
  NavigationControl,
} from 'react-map-gl';
import useSWR from 'swr';
import axios from 'axios';
import './Map.css';
import Search from './Search';
import 'bootstrap/dist/css/bootstrap.min.css';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Map() {
  const apiUrl = process.env.REACT_APP_URL;
  const TOKEN = process.env.REACT_APP_TOKEN;
  const [viewPort, setViewPort] = useState({
    latitude: 30.2653595,
    longitude: -97.74729549999999,
    width: '100%',
    height: '100%',
    zoom: 3,
    transitionInterpolator: new FlyToInterpolator(),
    transitionDuration: 1700,
    attributionControl: false,
  });

  const { data, error } = useSWR(apiUrl, fetcher);

  if (error) {
    console.error('Error fetching data:', error);
  }

  const events = data?.results || [];

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleMarkerClick = (event) => {
    setSelectedEvent(event);
    setViewPort({
      ...viewPort,
      latitude: event.location[1],
      longitude: event.location[0],
      zoom: 12,
    });
  };

  const handleSearch = (newViewport) => {
    setViewPort({
      ...viewPort,
      ...newViewport,
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactMapGL
        {...viewPort}
        maxZoom={20}
        mapboxApiAccessToken={TOKEN}
        mapStyle='mapbox://styles/deshondixon/clx0l2ujj005101p1aq97gr3e'
        onViewportChange={(newViewport) => setViewPort(newViewport)}
      >
        {events.map((e) => (
          <Marker key={e.id} latitude={e.location[1]} longitude={e.location[0]}>
            <button
              className='marker-button'
              onClick={() => handleMarkerClick(e)}
            >
              <img
                className='marker-icon'
                src='pin.svg'
                alt='This is a marker'
              />
            </button>
          </Marker>
        ))}

        {selectedEvent && (
          <Popup
            latitude={selectedEvent.location[1]}
            longitude={selectedEvent.location[0]}
            onClose={() => {
              setSelectedEvent(null);
            }}
            closeButton={true}
            closeOnClick={false}
            anchor='top'
            className='custom-popup'
          >
            <div className='popup-content'>
              <h5 className='popup-title'>{selectedEvent.title}</h5>
              <p className='popup-description'>{selectedEvent.description}</p>
              <div>
                {selectedEvent.entities.map((entity) => (
                  <div key={entity.entity_id}>
                    <h6> Address</h6>
                    <h6 className='popup-entity-title'>{entity.name}</h6>
                    <p className='popup-address'>{entity.formatted_address}</p>
                  </div>
                ))}
              </div>
              <div>
                <h6 className='popup-dates-title'>Dates</h6>
                {selectedEvent.impact_patterns
                  ?.flatMap((impactPattern) =>
                    impactPattern?.impacts?.map((impact) => impact.date_local)
                  )
                  ?.filter((date, index, self) => self.indexOf(date) === index)
                  ?.map((date, dateIndex) => {
                    const dateObject = new Date(date);
                    const formattedDate = dateObject.toLocaleDateString(
                      'en-US',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }
                    );
                    return (
                      <p key={dateIndex} className='popup-date'>
                        {formattedDate}
                      </p>
                    );
                  })}
              </div>
            </div>
          </Popup>
        )}

        <div className='navigation-container'>
          <NavigationControl />
        </div>

        <Search onSearch={handleSearch} />
      </ReactMapGL>
    </div>
  );
}
