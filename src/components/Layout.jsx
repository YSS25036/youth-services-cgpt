// src/components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const Layout = () => {
  const location = useLocation();

  const isHomeOrLogin = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      {!isHomeOrLogin && (
        <header className="bg-orange-600 text-white py-4 shadow-md">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-xl font-semibold">Youth Services IMS</h1>
          </div>
        </header>
      )}

      {/* Breadcrumbs */}
      {!isHomeOrLogin && (
        <div className="max-w-6xl mx-auto px-6 py-2">
          <Breadcrumbs />
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

