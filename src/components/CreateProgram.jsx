// src/components/CreateEvent.jsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const CreateEvent = () => {
  const [form, setForm] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    description: '',
    mode: '',
    ageGroup: '',
    context: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'events'), form);
      setStatus('✅ Event created successfully!');
      setForm({ eventName: '', eventDate: '', location: '', description: '', mode: '', ageGroup: '', context: '' });
    } catch (error) {
      console.error('❌ Error creating event:', error);
      setStatus('❌ Failed to create event');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="eventName" value={form.eventName} onChange={handleChange} placeholder="Event Name" required />
            <Input name="eventDate" value={form.eventDate} onChange={handleChange} placeholder="Event Date (DD-MM-YYYY)" required />
            <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
            <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Event Description" required />
            <Select onValueChange={(value) => setForm({ ...form, mode: value })} value={form.mode} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Person">In Person</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setForm({ ...form, ageGroup: value })} value={form.ageGroup} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Children">Children</SelectItem>
                <SelectItem value="Teen">Teen</SelectItem>
                <SelectItem value="Young Adults">Young Adults</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            <Textarea name="context" value={form.context} onChange={handleChange} placeholder="Additional Context" />
            <Button type="submit">Create Event</Button>
            {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;

