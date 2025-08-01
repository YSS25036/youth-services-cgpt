import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EventParticipation = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [assignments, setAssignments] = useState({});
  const statusOptions = ['Assigned', 'Withdrawn', 'Unavailable'];

  useEffect(() => {
    const fetchData = async () => {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const volunteersSnapshot = await getDocs(collection(db, 'volunteers'));

      setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setVolunteers(volunteersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const handleStatusChange = (volunteerId, status) => {
    setAssignments(prev => ({ ...prev, [volunteerId]: status }));
  };

  const handleSubmit = async () => {
    try {
      const batch = Object.entries(assignments).map(([volunteerId, status]) => {
        return addDoc(collection(db, 'event_participation'), {
          eventId: selectedEvent,
          volunteerId,
          participationStatus: status,
          timestamp: new Date()
        });
      });

      await Promise.all(batch);
      alert('Participation assignments saved.');
      setAssignments({});
    } catch (err) {
      console.error('Error saving participation:', err);
      alert('Failed to save some assignments.');
    }
  };

  const filteredVolunteers = volunteers.filter(v => !v.name?.toLowerCase().includes('test'));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Map Volunteers to Events</h2>

      <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
        <option value="">Select an Event</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.eventName}</option>
        ))}
      </select>

      {selectedEvent && (
        <>
          <table border="1" cellPadding="10" style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Kendra</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map(vol => (
                <tr key={vol.id}>
                  <td>{vol.name}</td>
                  <td>{vol.kendra}</td>
                  <td>{vol.contact}</td>
                  <td>
                    <select
                      value={assignments[vol.id] || ''}
                      onChange={e => handleStatusChange(vol.id, e.target.value)}
                    >
                      <option value="">Select</option>
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button style={{ marginTop: '1rem' }} onClick={handleSubmit}>Save Assignments</button>
        </>
      )}
    </div>
  );
};

export default EventParticipation;

