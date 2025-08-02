// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardHome from './components/DashboardHome';
import AdminDashboard from './components/AdminDashboard';
import ProgramDashboard from './components/ProgramDashboard';
import AssignVolunteers from './components/AssignVolunteers';
import ProgramDetails from './components/ProgramDetails';
import VolunteerDetails from './components/VolunteerDetails';
import ActionTrackerPage from './components/ActionTrackerPage';
import RolesManager from './components/RolesManager';
import CreateProgram from './components/CreateProgram';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardHome /> }, // 👈 Main dashboard
      { path: '/volunteers', element: <AdminDashboard /> },
      { path: '/events', element: <ProgramDashboard /> },
      { path: '/events/:eventId', element: <ProgramDetails /> },      
      { path: '/volunteers/:volunteerId', element: <VolunteerDetails /> },
      { path: '/actions', element: <ActionTrackerPage />},
      { path: '/roles-manager', element: <RolesManager />},
      { path: '/create-event', element: <CreateProgram /> },
      { path: '/assign', element: <AssignVolunteers /> },
    ],
  },
]);

