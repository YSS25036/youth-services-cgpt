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

  if (loading) return <p className="text-gray-600">Loading volunteer details...</p>;
  if (!volunteer) return <p className="text-red-500">Volunteer not found.</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">{volunteer.name}'s Event Assignments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div><strong>Lesson #:</strong> {volunteer.lessonNumber}</div>
          <div><strong>City:</strong> {volunteer.city}</div>
          <div><strong>Kendra:</strong> {volunteer.kendra}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Assigned Programs</h3>
        {assignedEvents.length === 0 ? (
          <p className="text-gray-600">No current assignments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Program</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mode</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Age Group</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignedEvents.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{ev.eventName}</td>
                    <td className="px-4 py-2">{ev.eventDate}</td>
                    <td className="px-4 py-2">{ev.location}</td>
                    <td className="px-4 py-2">{ev.mode}</td>
                    <td className="px-4 py-2">{ev.ageGroup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDetails;

