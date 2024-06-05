import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import useSwr from 'swr';
import './Map.css';

const fetcher = (...args) => fetch(...args).then((response) => response.json());

export default function Map() {
  const TOKEN = process.env.REACT_APP_TOKEN;
  const [viewPort, setViewPort] = useState({
    latitude: 30.2653595,
    longitude: -97.74729549999999,
    width: '100vw',
    height: '100vh',
    zoom: 3,
    transitionDuration: 5000,
  });

  const url = 'http://localhost:3001/api';
  const { data, error } = useSwr(url, fetcher);
  console.log('THIS IS ORIGINAL DATA:', data);

  const venues =
    data && !error
      ? data.results.flatMap((festival) =>
          festival.results ? [festival, ...festival.results] : festival
        )
      : [];

  const [selectedFestival, setSelectedFestival] = useState(null);

  const [initialZoom, setInitialZoom] = useState(3);

  const handleMarkerClick = (venue) => {
    setSelectedFestival(venue);
    setViewPort({
      ...viewPort,
      latitude: venue.location[1],
      longitude: venue.location[0],
      zoom: 12,
    });
  };

  useEffect(() => {
    setViewPort((prevViewport) => ({
      ...prevViewport,
      transitionDuration: 1000,
    }));
  }, [viewPort]);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactMapGL
          {...viewPort}
          maxZoom={20}
          mapboxApiAccessToken={TOKEN}
          mapStyle='mapbox://styles/deshondixon/clx0l2ujj005101p1aq97gr3e'
          onViewportChange={(viewPort) => {
            setViewPort(viewPort);
          }}
        >
          {venues.map((venue) => {
            const latitude = venue.location[1];
            const longitude = venue.location[0];
            return (
              <Marker
                key={venue.relevance}
                latitude={latitude}
                longitude={longitude}
              >
                <button
                  className='marker-button'
                  onClick={() => handleMarkerClick(venue)}
                >
                  <img
                    className='marker-icon'
                    src='pin.svg'
                    alt='This is a marker'
                  />
                </button>
              </Marker>
            );
          })}

          {selectedFestival ? (
            <Popup
              latitude={selectedFestival.location[1]}
              longitude={selectedFestival.location[0]}
              onClose={() => {
                setSelectedFestival(null);
                setViewPort({ ...viewPort, zoom: initialZoom });
              }}
            >
              <div>
                <h2>{selectedFestival.title}</h2>
                <div>
                  <p>{selectedFestival.description}</p>
                </div>
                <div>
                  <div>
                    {selectedFestival.entities.map((entity) => (
                      <div key={entity.entity_id}>
                        <h4>{entity.name}</h4>
                        <p>Address: {entity.formatted_address}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h2>Dates</h2>
                    {selectedFestival.impact_patterns
                      .flatMap((impactPattern) =>
                        impactPattern.impacts.map((impact) => impact.date_local)
                      )
                      .filter(
                        (date, index, self) => self.indexOf(date) === index
                      )
                      .map((date, dateIndex) => {
                        const dateObject = new Date(date);
                        const formattedDate = dateObject.toLocaleDateString(
                          'en-US',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        );
                        return <p key={dateIndex}>{formattedDate}</p>;
                      })}
                  </div>
                </div>
              </div>
            </Popup>
          ) : null}
        </ReactMapGL>
      </div>
    </>
  );
}
