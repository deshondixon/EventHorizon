import React from 'react';
import ReactMapGl from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';

export default function Map() {
  const TOKEN = process.env.REACT_APP_TOKEN;
  const [viewPort, setViewPort] = useState({
    latitude: 30.4255406,
    longitude: -97.7529433,
    width: '100vw',
    height: '100vh',
    zoom: 10,
  });

  return (
    <>
      <ReactMapGl
        {...viewPort}
        mapboxApiAccessToken={TOKEN}
        mapStyle='mapbox://styles/deshondixon/clx0rwc3y01qn01qp9pp8ds7l/draft'
        onViewportChange={(viewport) => setViewPort(viewport)}
      ></ReactMapGl>
    </>
  );
}
