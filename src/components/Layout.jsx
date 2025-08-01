import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut(auth);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ padding: '2rem' }}>
      {/* 🔷 App Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Youth Services IMS</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* 🧭 Navigation Tiles */}
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <div
          onClick={() => navigate("/")}
          style={{
            padding: '1rem',
            border: isActive("/") ? '2px solid navy' : '1px solid gray',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: isActive("/") ? '#eef' : '#f9f9f9'
          }}
        >
          Home
        </div>
        <div
          onClick={() => navigate("/volunteers")}
          style={{
            padding: '1rem',
            border: isActive("/volunteers") ? '2px solid navy' : '1px solid gray',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: isActive("/volunteers") ? '#eef' : '#f9f9f9'
          }}
        >
          Volunteers
        </div>
        <div
          onClick={() => navigate("/events")}
          style={{
            padding: '1rem',
            border: isActive("/events") ? '2px solid navy' : '1px solid gray',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: isActive("/events") ? '#eef' : '#f9f9f9'
          }}
        >
          Events
        </div>
      </div>

      {/* 🧩 Main Content */}
      <Outlet />
    </div>
  );
};

export default Layout;

