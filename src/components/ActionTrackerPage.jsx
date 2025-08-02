import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const ActionTrackerPage = () => {
  const [allActions, setAllActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  // ✅ CHANGED: The status filter state is now an array to hold multiple values.
  const [statusFilter, setStatusFilter] = useState([]);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    ownerName: '',
    dueDate: '',
    status: 'Yet to Start',
    eventId: '',
  });
  const [events, setEvents] = useState([]);
  const [editingAction, setEditingAction] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (editingAction) {
      const formattedDueDate = editingAction.dueDate?.toDate().toISOString().split('T')[0] || '';
      
      setFormData({
        description: editingAction.description || '',
        ownerName: editingAction.ownerName || '',
        dueDate: formattedDueDate,
        status: editingAction.status || 'Yet to Start',
        eventId: editingAction.eventId || '',
      });
      setShowForm(true);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setFormData({ description: '', ownerName: '', dueDate: '', status: 'Yet to Start', eventId: '' });
    }
  }, [editingAction]);

  const fetchActionsAndEvents = async () => {
    setLoading(true);
    try {
      const actionsQuery = query(collection(db, 'actions'), orderBy('dueDate', 'desc'));
      const actionsSnapshot = await getDocs(actionsQuery);
      const actionsList = actionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllActions(actionsList);
      
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

  useEffect(() => {
    let results = allActions;
    
    // ✅ CHANGED: The filter logic now checks if the action's status is included in the array.
    if (statusFilter.length > 0) {
      results = results.filter(action => statusFilter.includes(action.status));
    }

    if (ownerFilter) {
      const lowercasedFilter = ownerFilter.toLowerCase();
      results = results.filter(action =>
        action.ownerName?.toLowerCase().includes(lowercasedFilter)
      );
    }
    setFilteredActions(results);
  }, [statusFilter, ownerFilter, allActions]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.description) {
      alert('Please enter a description for the action.');
      return;
    }
    const processedData = {
      ...formData,
      dueDate: formData.dueDate ? Timestamp.fromDate(new Date(formData.dueDate)) : null,
    };
    try {
      if (editingAction) {
        const actionRef = doc(db, 'actions', editingAction.id);
        await updateDoc(actionRef, processedData);
        alert('Action updated successfully!');
        setEditingAction(null);
      } else {
        await addDoc(collection(db, 'actions'), { ...processedData, assignedDate: Timestamp.now() });
      }
      setShowForm(false);
      fetchActionsAndEvents();
    } catch (err) {
      console.error('❌ Error saving action:', err);
      alert('Failed to save action.');
    }
  };
  
  const handleEditClick = (action) => {
    setEditingAction(action);
  };
  
  const handleCancelEdit = () => {
    setEditingAction(null);
    setShowForm(false);
  };

  // ✅ CHANGED: This new handler manages adding/removing statuses from the filter array.
  const handleStatusChange = (status) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status) // If status is already in, remove it
        : [...prev, status] // Otherwise, add it
    );
  };
  
  const statusOptions = ["In progress", "Completed", "Suspended", "Yet to Start", "Not Applicable"];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="text-3xl font-bold">Global Action Tracker</h2>
        <button onClick={() => { setEditingAction(null); setShowForm(prev => !prev); }}>
          {showForm && !editingAction ? 'Cancel' : '➕ Add New Action'}
        </button>
      </div>

      {(showForm || editingAction) && (
        <div ref={formRef} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4>{editingAction ? 'Edit Action Item' : 'Add New Action Item'}</h4>
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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleFormSubmit} style={{ alignSelf: 'flex-start' }}>
              {editingAction ? '💾 Update Action' : '✅ Submit Action'}
            </button>
            {editingAction && (
              <button onClick={handleCancelEdit}>Cancel</button>
            )}
          </div>
        </div>
      )}

      {/* ✅ CHANGED: The filter UI is now a set of checkboxes. */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <input type="text" placeholder="Filter by Owner Name..." value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} style={{ padding: '0.5rem', width: '250px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <strong>Status:</strong>
          {statusOptions.map(status => (
            <label key={status} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={statusFilter.includes(status)}
                onChange={() => handleStatusChange(status)}
                style={{ marginRight: '0.25rem' }}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {loading ? ( <p>Loading actions...</p> ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Related Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.length > 0 ? (
              filteredActions.map(action => {
                const relatedEvent = events.find(e => e.id === action.eventId);
                return (
                  <tr key={action.id}>
                    <td>{action.description || '—'}</td>
                    <td>{action.ownerName || '—'}</td>
                    <td>{action.dueDate?.toDate().toLocaleDateString() || '—'}</td>
                    <td>{action.status || '—'}</td>
                    <td>
                      {action.eventId && relatedEvent ? (
                        <Link to={`/events/${action.eventId}`} style={{ color: 'blue' }}>
                          {relatedEvent.eventName}
                        </Link>
                      ) : ( 'N/A' )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => handleEditClick(action)}>Edit</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No actions match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActionTrackerPage;
