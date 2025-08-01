// src/components/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          console.error('❌ No eventId found in URL');
          return;
        }

        // Fetch event document
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          console.warn('⚠️ Event not found.');
        }

        // Fetch volunteer mappings
        const participationQuery = query(
          collection(db, 'event_participation'),
          where('eventId', '==', eventId)
        );
        const participationSnap = await getDocs(participationQuery);

        const volunteerIds = participationSnap.docs.map(doc => doc.data().volunteerId);

        if (volunteerIds.length > 0) {
          const volunteerSnap = await getDocs(collection(db, 'volunteers'));
          const allVolunteers = volunteerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const assigned = allVolunteers.filter(v => volunteerIds.includes(v.id));
          setVolunteers(assigned);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading event details:', err);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p>Loading event details...</p>;

  if (!event) return <p>Event not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/events" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Events
      </Link>

      <h2>{event.eventName}</h2>
      <p><strong>Date:</strong> {event.eventDate}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Mode:</strong> {event.mode}</p>
      <p><strong>Age Group:</strong> {event.ageGroup}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Context:</strong> {event.context}</p>

      <h3 style={{ marginTop: '2rem' }}>Assigned Volunteers</h3>
      {volunteers.length === 0 ? (
        <p>No volunteers assigned to this event.</p>
      ) : (
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
            {volunteers.map(vol => (
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
      )}
    </div>
  );
};

export default EventDetails;

