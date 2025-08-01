// In src/components/DashboardHome.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const tileStyle = {
    width: '250px',
    height: '150px',
    margin: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#000',
    background: '#f9f9f9',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Youth Services IMS</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Link to="/volunteers" style={tileStyle}>
          <h3>Volunteers</h3>
          <p>View & filter volunteers</p>
        </Link>
        <Link to="/events" style={tileStyle}>
          <h3>Events</h3>
          <p>Create and view events</p>
        </Link>
        {/* NEW TILE ADDED BELOW */}
        <Link to="/actions" style={tileStyle}>
          <h3>Action Tracker</h3>
          <p>View all assigned tasks</p>
        </Link>
        <Link to="/assign" style={tileStyle}>
          <h3>Assign Volunteers</h3>
          <p>Map volunteers to events</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
