import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import useSWR from 'swr';
import './Map.css';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Map() {
  const TOKEN = process.env.REACT_APP_TOKEN;
  const [viewPort, setViewPort] = useState({
    latitude: 30.2653595,
    longitude: -97.74729549999999,
    width: '100vw',
    height: '100vh',
    zoom: 3,
    transitionInterpolator: new FlyToInterpolator(),
    transitionDuration: 1700,
  });

  const { data, error } = useSWR('http://localhost:3001/api', fetcher);

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

  const handleGeocoderSearch = async (searchText) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchText
        )}.json?access_token=${TOKEN}`
      );
      const result = response.data.features[0];
      if (result) {
        setViewPort({
          ...viewPort,
          latitude: result.center[1],
          longitude: result.center[0],
          zoom: 12,
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <ReactMapGL
      {...viewPort}
      maxZoom={20}
      mapboxApiAccessToken={TOKEN}
      mapStyle='mapbox://styles/deshondixon/clx0l2ujj005101p1aq97gr3e'
      onViewportChange={setViewPort}
    >
      {/* <NavigationControl position='top-left' /> */}

      {events.map((e) => (
        <Marker key={e.id} latitude={e.location[1]} longitude={e.location[0]}>
          <button
            className='marker-button'
            onClick={() => handleMarkerClick(e)}
          >
            <img className='marker-icon' src='pin.svg' alt='This is a marker' />
          </button>
        </Marker>
      ))}

      {selectedEvent && (
        <Popup
          latitude={selectedEvent.location[1]}
          longitude={selectedEvent.location[0]}
          onClose={() => {
            setSelectedEvent(null);
            setViewPort((prev) => ({ ...prev, zoom: 3 }));
          }}
        >
          <div>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>
            <div>
              {selectedEvent.entities.map((entity) => (
                <div key={entity.entity_id}>
                  <h4>{entity.name}</h4>
                  <p>Address: {entity.formatted_address}</p>
                </div>
              ))}
            </div>
            <div>
              <h2>Dates</h2>
              {selectedEvent.impact_patterns
                ?.flatMap((impactPattern) =>
                  impactPattern?.impacts?.map((impact) => impact.date_local)
                )
                ?.filter((date, index, self) => self.indexOf(date) === index)
                ?.map((date, dateIndex) => {
                  const dateObject = new Date(date);
                  const formattedDate = dateObject.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  return <p key={dateIndex}>{formattedDate}</p>;
                })}
            </div>
          </div>
        </Popup>
      )}

      <div className='geocoder-container'>
        <input
          type='text'
          placeholder='Search'
          onChange={(e) => handleGeocoderSearch(e.target.value)}
        />
      </div>
    </ReactMapGL>
  );
}
