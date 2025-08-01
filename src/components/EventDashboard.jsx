// src/components/EventDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    description: '',
    mode: '',
    ageGroup: '',
    context: '',
  });

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventData);
      console.log('✅ Events fetched:', eventData);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      await addDoc(collection(db, 'events'), formData);
      setFormData({
        eventName: '',
        eventDate: '',
        location: '',
        description: '',
        mode: '',
        ageGroup: '',
        context: '',
      });
      setShowForm(false);
      fetchEvents(); // Refresh list
    } catch (err) {
      console.error('❌ Error adding event:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📆 Events</h2>

      <button onClick={() => setShowForm(prev => !prev)} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Cancel' : '➕ Add New Event'}
      </button>

      {showForm && (
        <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h4>Add New Event</h4>
          <input name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleInputChange} />
          <input name="eventDate" placeholder="DD-MM-YYYY" value={formData.eventDate} onChange={handleInputChange} />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
          <input name="mode" placeholder="Mode (Online / In person / Hybrid)" value={formData.mode} onChange={handleInputChange} />
          <input name="ageGroup" placeholder="Age Group" value={formData.ageGroup} onChange={handleInputChange} />
          <input name="context" placeholder="Additional Context" value={formData.context} onChange={handleInputChange} />
          <br /><br />
          <button onClick={handleAddEvent}>✅ Submit</button>
        </div>
      )}

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Mode</th>
              <th>Age Group</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.eventName}</td>
                <td>{event.eventDate}</td>
                <td>{event.location}</td>
                <td>{event.mode}</td>
                <td>{event.ageGroup}</td>
                <td>
                  <Link to={`/events/${event.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventDashboard;

