// src/components/AssignVolunteers.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AssignVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const volunteerSnap = await getDocs(collection(db, 'volunteers'));
      const eventSnap = await getDocs(collection(db, 'events'));

      const volunteersData = volunteerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const eventsData = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('✅ Volunteers:', volunteersData);
      console.log('✅ Events:', eventsData);

      setVolunteers(volunteersData);
      setEvents(eventsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedEvent) {
        setAssignments([]);
        return;
      }

      const snap = await getDocs(collection(db, 'event_participation'));
      const allParticipations = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const relevant = allParticipations.filter(p => p.eventId === selectedEvent && p.status === 'Assigned');

      console.log('✅ Assigned volunteerIds:', relevant.map(a => a.volunteerId));
      setAssignments(relevant);
    };

    fetchAssignments();
  }, [selectedEvent]);

  const handleSelectVolunteer = (volId) => {
    setSelectedVolunteers(prev =>
      prev.includes(volId) ? prev.filter(id => id !== volId) : [...prev, volId]
    );
  };

  const handleAssign = async () => {
    if (!selectedEvent || selectedVolunteers.length === 0) {
      alert('Please select an event and at least one volunteer.');
      return;
    }

    try {
      for (const volId of selectedVolunteers) {
        await addDoc(collection(db, 'event_participation'), {
          volunteerId: volId,
          eventId: selectedEvent,
          status: 'Assigned'
        });
      }
      setStatus(`${selectedVolunteers.length} volunteer(s) assigned successfully.`);
      setSelectedVolunteers([]);
    } catch (err) {
      console.error('Assignment error:', err);
      setStatus('Failed to assign volunteers.');
    }
  };

  const assignedVolIds = new Set(assignments.map(a => a.volunteerId));
  const assignedVolunteers = volunteers.filter(v => assignedVolIds.has(v.id));
  const unassignedVolunteers = volunteers.filter(v => !assignedVolIds.has(v.id));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Assign Volunteers to Event</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Select Event: </label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">-- Select an event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.eventName}</option>
          ))}
        </select>
      </div>

      <h3>Unassigned Volunteers</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>City</th>
            <th>Kendra</th>
            <th>Age</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {unassignedVolunteers.map(vol => (
            <tr key={vol.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedVolunteers.includes(vol.id)}
                  onChange={() => handleSelectVolunteer(vol.id)}
                />
              </td>
              <td>{vol.name}</td>
              <td>{vol.city}</td>
              <td>{vol.kendra}</td>
              <td>{vol.age}</td>
              <td>{vol.skills}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginBottom: '1rem' }} onClick={handleAssign}>
        Assign Selected Volunteers
      </button>

      <h3>Already Assigned Volunteers</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Kendra</th>
            <th>Age</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {assignedVolunteers.map(vol => (
            <tr key={vol.id}>
              <td>{vol.name}</td>
              <td>{vol.city}</td>
              <td>{vol.kendra}</td>
              <td>{vol.age}</td>
              <td>{vol.skills}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {status && <p style={{ marginTop: '1rem', color: 'green' }}>{status}</p>}
    </div>
  );
};

export default AssignVolunteers;

