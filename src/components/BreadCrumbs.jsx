// src/components/Breadcrumbs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Skip breadcrumb on root or login page
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <nav className="bg-orange-50 px-6 py-3 text-sm text-gray-700">
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="hover:underline text-orange-600 font-medium">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center space-x-2">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-800 capitalize">{value}</span>
              ) : (
                <Link
                  to={to}
                  className="hover:underline text-orange-600 capitalize"
                >
                  {value}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

