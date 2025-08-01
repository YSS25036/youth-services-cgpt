// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardHome from './components/DashboardHome';
import AdminDashboard from './components/AdminDashboard';
import EventDashboard from './components/EventDashboard';
import AssignVolunteers from './components/AssignVolunteers';
import EventDetails from './components/EventDetails';
import VolunteerDetails from './components/VolunteerDetails';
import ActionTrackerPage from './components/ActionTrackerPage';
import RolesManager from './components/RolesManager';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardHome /> }, // 👈 Main dashboard
      { path: '/volunteers', element: <AdminDashboard /> },
      { path: '/events', element: <EventDashboard /> },
      { path: '/events/:eventId', element: <EventDetails /> },      
      { path: '/volunteers/:volunteerId', element: <VolunteerDetails /> },
      { path: '/actions', element: <ActionTrackerPage />},
      { path: '/roles-manager', element: <RolesManager />},
      { path: '/assign', element: <AssignVolunteers /> },
    ],
  },
]);

