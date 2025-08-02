// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VolunteerList from './VolunteerList';
import AssignVolunteers from './AssignVolunteers';
import RolesManager from './RolesManager';

const AdminDashboard = () => {
  const [tab, setTab] = useState('list');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Volunteers</h2>

      <Tabs defaultValue="list" value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Volunteer List</TabsTrigger>
          <TabsTrigger value="assign">Assign Volunteers</TabsTrigger>
          <TabsTrigger value="roles">Manage Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <VolunteerList />
        </TabsContent>

        <TabsContent value="assign">
          <AssignVolunteers />
        </TabsContent>

        <TabsContent value="roles">
          <RolesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

