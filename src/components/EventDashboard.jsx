import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  // ✅ NEW: State to hold related data for calculations.
  const [participations, setParticipations] = useState([]);
  const [actions, setActions] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '', eventDate: '', location: '', description: '',
    mode: '', ageGroup: '', context: '',
  });

  // ✅ NEW: Fetch all necessary data when the component loads.
  const fetchAllData = async () => {
    try {
      const [eventsSnap, participationsSnap, actionsSnap] = await Promise.all([
        getDocs(collection(db, 'events')),
        getDocs(collection(db, 'event_participation')),
        getDocs(collection(db, 'actions'))
      ]);

      const eventData = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const participationData = participationsSnap.docs.map(doc => doc.data());
      const actionData = actionsSnap.docs.map(doc => doc.data());

      setEvents(eventData);
      setParticipations(participationData);
      setActions(actionData);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  
  // ✅ NEW: Use useMemo to efficiently calculate the counts for each event.
  // This code runs only when the source data changes.
  const enrichedEvents = useMemo(() => {
    const openActionStatuses = ['In progress', 'Yet to Start'];

    return events.map(event => {
      // Calculate the number of volunteers assigned to this event.
      const volunteersAssigned = participations.filter(p => p.eventId === event.id).length;

      // Calculate the number of open actions for this event.
      const openActions = actions.filter(a => 
        a.eventId === event.id && openActionStatuses.includes(a.status)
      ).length;

      return {
        ...event,
        volunteersAssigned,
        openActions,
      };
    });
  }, [events, participations, actions]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      await addDoc(collection(db, 'events'), formData);
      setFormData({
        eventName: '', eventDate: '', location: '', description: '',
        mode: '', ageGroup: '', context: '',
      });
      setShowForm(false);
      fetchAllData(); // Refresh all data after adding a new event
    } catch (err) {
      console.error('❌ Error adding event:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📆 Events Dashboard</h2>
        <button onClick={() => setShowForm(prev => !prev)} style={{ marginBottom: '1rem' }}>
          {showForm ? 'Cancel' : '➕ Add New Event'}
        </button>
      </div>
      
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

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            {/* ✅ NEW: Added table headers */}
            <th style={{ textAlign: 'center' }}>Volunteers Assigned</th>
            <th style={{ textAlign: 'center' }}>Open Actions</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {/* We now map over the new 'enrichedEvents' array */}
          {enrichedEvents.map(event => (
            <tr key={event.id}>
              <td>{event.eventName}</td>
              <td>{event.eventDate}</td>
              {/* ✅ NEW: Added table data cells */}
              <td style={{ textAlign: 'center' }}>{event.volunteersAssigned}</td>
              <td style={{ textAlign: 'center' }}>{event.openActions}</td>
              <td>
                <Link to={`/events/${event.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventDashboard;
