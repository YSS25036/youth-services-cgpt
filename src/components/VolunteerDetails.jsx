// src/components/VolunteerDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VolunteerDetails = () => {
  const { volunteerId } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        // Fetch volunteer profile
        const volRef = doc(db, 'volunteers', volunteerId);
        const volSnap = await getDoc(volRef);
        if (volSnap.exists()) {
          setVolunteer(volSnap.data());
        } else {
          console.error('❌ Volunteer not found');
        }

        // Fetch event participations
        const participationSnap = await getDocs(collection(db, 'event_participation'));
        const participationRecords = participationSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(rec => rec.volunteerId === volunteerId);

        // Fetch corresponding events
        const eventIds = participationRecords.map(p => p.eventId);
        const allEventsSnap = await getDocs(collection(db, 'events'));
        const relevantEvents = allEventsSnap.docs
          .filter(doc => eventIds.includes(doc.id))
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setAssignedEvents(relevantEvents);
      } catch (err) {
        console.error('❌ Error fetching volunteer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, [volunteerId]);

  if (loading) return <p>Loading volunteer details...</p>;
  if (!volunteer) return <p>Volunteer not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{volunteer.name}'s Event Assignments</h2>
      <p><strong>Lesson #:</strong> {volunteer.lessonNumber}</p>
      <p><strong>City:</strong> {volunteer.city}</p>
      <p><strong>Kendra:</strong> {volunteer.kendra}</p>

      {assignedEvents.length === 0 ? (
        <p>No current assignments.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Location</th>
              <th>Mode</th>
              <th>Age Group</th>
            </tr>
          </thead>
          <tbody>
            {assignedEvents.map(ev => (
              <tr key={ev.id}>
                <td>{ev.eventName}</td>
                <td>{ev.eventDate}</td>
                <td>{ev.location}</td>
                <td>{ev.mode}</td>
                <td>{ev.ageGroup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VolunteerDetails;

