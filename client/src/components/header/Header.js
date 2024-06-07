import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <div className='header-container'>
      <label className='header-label'>
        <img className='star-icon' src='star.svg' alt='This is a star' />
        <h1 className='header-title'>EVENT HORIZON</h1>
      </label>
    </div>
  );
}
