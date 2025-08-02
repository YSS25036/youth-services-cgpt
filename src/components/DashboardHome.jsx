// src/components/DashboardHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const DashboardHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Banner Header */}
      <header className="bg-orange-600 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-semibold">Youth Services IMS</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Text */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to the Youth Services IMS</h2>
          <p className="text-lg text-gray-600">Manage your volunteers, programs, and resources with ease.</p>
        </div>

        {/* Large Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/volunteers">
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all h-48 flex flex-col justify-center items-center">
              <CardContent className="p-6 text-center">
                <CardTitle className="text-2xl mb-2">Volunteers</CardTitle>
                <p className="text-base text-gray-600">Manage and assign volunteers</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/events">
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all h-48 flex flex-col justify-center items-center">
              <CardContent className="p-6 text-center">
                <CardTitle className="text-2xl mb-2">Programs</CardTitle>
                <p className="text-base text-gray-600">View and organize your programs</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/resources">
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all h-48 flex flex-col justify-center items-center">
              <CardContent className="p-6 text-center">
                <CardTitle className="text-2xl mb-2">Resources</CardTitle>
                <p className="text-base text-gray-600">Files, guides, and more</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;

