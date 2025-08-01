// src/pages/ActionTrackerPage.jsx

import React, { useState, useEffect } from 'react';
// ✨ NEW: Import 'addDoc' to add new documents to Firestore.
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const ActionTrackerPage = () => {
  // --- STATE MANAGEMENT ---
  const [allActions, setAllActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // ✨ NEW: State to manage the visibility of the "Add Action" form.
  const [showForm, setShowForm] = useState(false);
  // ✨ NEW: State to hold the data for the new action being created.
  const [formData, setFormData] = useState({
    description: '',
    ownerName: '',
    dueDate: '', // This will be a string from the date input
    status: 'Yet to Start', // Set a sensible default status
    eventId: '', // Optional: To link this action to an event
  });
  // ✨ NEW: State to hold the list of events for the dropdown.
  const [events, setEvents] = useState([]);

  // --- DATA FETCHING ---
  const fetchActionsAndEvents = async () => {
    setLoading(true);
    try {
      // 1. Fetch all actions (existing logic)
      const actionsQuery = query(collection(db, 'actions'), orderBy('dueDate', 'desc'));
      const actionsSnapshot = await getDocs(actionsQuery);
      const actionsList = actionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllActions(actionsList);
      setFilteredActions(actionsList);

      // ✨ NEW: 2. Fetch all events to populate the dropdown in the form.
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);

    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionsAndEvents();
  }, []);

  // --- FILTERING LOGIC (Unchanged) ---
  useEffect(() => {
    let results = allActions;
    if (statusFilter) {
      results = results.filter(action => action.status === statusFilter);
    }
    if (ownerFilter) {
      const lowercasedFilter = ownerFilter.toLowerCase();
      results = results.filter(action =>
        action.ownerName?.toLowerCase().includes(lowercasedFilter)
      );
    }
    setFilteredActions(results);
  }, [statusFilter, ownerFilter, allActions]);

  // --- ✨ NEW: FORM HANDLING LOGIC ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAction = async () => {
    // Basic validation to ensure a description is present.
    if (!formData.description) {
      alert('Please enter a description for the action.');
      return;
    }

    try {
      // Prepare the data for Firestore.
      const newAction = {
        ...formData,
        // Convert the string date from the form into a Firestore Timestamp.
        dueDate: formData.dueDate ? Timestamp.fromDate(new Date(formData.dueDate)) : null,
        // Set the 'assignedDate' to the current time.
        assignedDate: Timestamp.now(),
      };

      // Add the new document to the 'actions' collection.
      await addDoc(collection(db, 'actions'), newAction);

      // Reset the form, hide it, and refresh the actions list.
      setShowForm(false);
      setFormData({ description: '', ownerName: '', dueDate: '', status: 'Yet to Start', eventId: '' });
      fetchActionsAndEvents(); // Re-fetch all data to show the new action.
    } catch (err) {
      console.error('❌ Error adding new action:', err);
      alert('Failed to add action.');
    }
  };


  const statusOptions = ["In progress", "Completed", "Suspended", "Yet to Start", "Not Applicable"];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="text-3xl font-bold">Global Action Tracker</h2>
        {/* ✨ NEW: Button to toggle the form visibility. */}
        <button onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Cancel' : '➕ Add New Action'}
        </button>
      </div>
      <p className="mb-6">View all tasks and actions across all events and projects.</p>

      {/* ✨ NEW: The form for adding a new action, shown conditionally. */}
      {showForm && (
        <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4>Add New Action Item</h4>
          <input type="text" name="description" placeholder="Action Description*" value={formData.description} onChange={handleInputChange} />
          <input type="text" name="ownerName" placeholder="Action Owner" value={formData.ownerName} onChange={handleInputChange} />
          <input type="date" name="dueDate" placeholder="Due Date" value={formData.dueDate} onChange={handleInputChange} />
          <select name="status" value={formData.status} onChange={handleInputChange}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="eventId" value={formData.eventId} onChange={handleInputChange}>
            <option value="">Link to an Event (Optional)</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.eventName}</option>
            ))}
          </select>
          <button onClick={handleAddAction} style={{ alignSelf: 'flex-start' }}>✅ Submit Action</button>
        </div>
      )}

      {/* Filter controls section (Unchanged) */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* ... filter inputs are unchanged ... */}
        <input type="text" placeholder="Filter by Owner Name..." value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} style={{ padding: '0.5rem', width: '250px' }}/>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.5rem' }} >
          <option value="">All Statuses</option>
          {statusOptions.map(status => ( <option key={status} value={status}>{status}</option> ))}
        </select>
      </div>

      {/* Data Table (Unchanged) */}
      {loading ? ( <p>Loading actions...</p> ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          {/* ... table is unchanged ... */}
          <thead><tr><th>Description</th><th>Owner</th><th>Due Date</th><th>Status</th><th>Related Event</th></tr></thead>
          <tbody>
            {filteredActions.length > 0 ? (
              filteredActions.map(action => (
                <tr key={action.id}>
                  <td>{action.description || '—'}</td>
                  <td>{action.ownerName || '—'}</td>
                  <td>{action.dueDate?.toDate().toLocaleDateString() || '—'}</td>
                  <td>{action.status || '—'}</td>
                  <td>
                    {action.eventId ? ( <Link to={`/events/${action.eventId}`} style={{ color: 'blue' }}>View Event</Link>) : ('N/A')}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No actions match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActionTrackerPage;
