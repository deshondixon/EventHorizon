import React from 'react';
import axios from 'axios';
import './Search.css';

export default function Search({ onSearch }) {
  const handleGeocoderSearch = async (searchText) => {
    if (!searchText) return;

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchText
        )}.json?access_token=${process.env.REACT_APP_TOKEN}`
      );
      const result = response.data.features[0];
      if (result) {
        onSearch({
          latitude: result.center[1],
          longitude: result.center[0],
          zoom: 12,
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGeocoderSearch(e.target.value);
    }
  };

  return (
    <>
      <div className='geocoder-container'>
        <input type='text' placeholder='SEARCH' onKeyDown={handleKeyDown} />
      </div>
    </>
  );
}
