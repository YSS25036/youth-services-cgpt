// src/components/EventDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, addDoc, Timestamp, orderBy, documentId } from 'firebase/firestore';
import { db } from '../firebase';

// This is the fully functional CollapsibleSection component with inline styling.
const CollapsibleSection = ({ title, children, defaultOpen = true, headerStyle = {} }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const baseButtonStyle = {
    width: '100%',
    textAlign: 'left',
    padding: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ ...baseButtonStyle, ...headerStyle }}>
        <span>{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div style={{ padding: '1rem', backgroundColor: 'white', borderTop: '1px solid #ddd' }}>{children}</div>}
    </div>
  );
};


const EventDetails = () => {
  // All state variables are fully declared here.
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [actions, setActions] = useState([]);
  const [assignedVolunteers, setAssignedVolunteers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionFormData, setActionFormData] = useState({ description: '', ownerName: '', dueDate: '', status: 'Yet to Start' });
  const [manualLinks, setManualLinks] = useState([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkFormData, setLinkFormData] = useState({ linkName: '', linkUrl: '' });

  // Main useEffect to orchestrate all data fetching for the page.
  useEffect(() => {
    const fetchAllData = async () => {
      if (!eventId) return;
      setLoading(true);
      try {
        const deptsSnapshot = await getDocs(collection(db, 'departments'));
        const deptsList = deptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDepartments(deptsList);

        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        }

        await Promise.all([
          fetchActions(eventId),
          fetchAssignedVolunteers(eventId, deptsList),
          fetchManualLinks(eventId)
        ]);
      } catch (err) {
        console.error('❌ Error loading program details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [eventId]);

  const fetchActions = async (currentEventId) => {
    const actionsQuery = query(collection(db, 'actions'), where('eventId', '==', currentEventId), orderBy('assignedDate', 'desc'));
    const actionsSnapshot = await getDocs(actionsQuery);
    setActions(actionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchAssignedVolunteers = async (currentEventId, deptsList) => {
    const participationQuery = query(collection(db, 'event_participation'), where('eventId', '==', currentEventId));
    const participationSnap = await getDocs(participationQuery);
    const participations = participationSnap.docs.map(p => ({ ...p.data(), id: p.id }));
    const volunteerIds = participations.map(p => p.volunteerId);

    if (volunteerIds.length > 0) {
      const volunteersQuery = query(collection(db, 'volunteers'), where(documentId(), 'in', volunteerIds.slice(0, 30)));
      const volunteersSnapshot = await getDocs(volunteersQuery);
      const volunteersData = volunteersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const combinedDetails = participations.map(p => {
        const volunteerInfo = volunteersData.find(v => v.id === p.volunteerId);
        const departmentInfo = deptsList.find(d => d.id === p.departmentId);
        return {
          ...volunteerInfo,
          departmentName: departmentInfo ? departmentInfo.name : 'N/A',
          assignedRoles: p.assignedRoles || [],
        };
      });
      setAssignedVolunteers(combinedDetails);
    } else {
      setAssignedVolunteers([]);
    }
  };

  const fetchManualLinks = async (currentEventId) => {
    const linksQuery = query(collection(db, 'events', currentEventId, 'manualLinks'), orderBy('createdAt', 'desc'));
    const linksSnapshot = await getDocs(linksQuery);
    setManualLinks(linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleActionFormChange = (e) => {
    const { name, value } = e.target;
    setActionFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkFormChange = (e) => {
    const { name, value } = e.target;
    setLinkFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAction = async () => {
    if (!actionFormData.description) {
      alert('Please enter a description for the action.');
      return;
    }
    try {
      await addDoc(collection(db, 'actions'), {
        ...actionFormData,
        dueDate: actionFormData.dueDate ? Timestamp.fromDate(new Date(actionFormData.dueDate)) : null,
        assignedDate: Timestamp.now(),
        eventId: eventId,
      });
      setShowActionForm(false);
      setActionFormData({ description: '', ownerName: '', dueDate: '', status: 'Yet to Start' });
      await fetchActions(eventId);
    } catch (err) {
      console.error('❌ Error adding action:', err);
      alert('Failed to add action.');
    }
  };

  const handleAddLink = async () => {
    if (!linkFormData.linkUrl || !linkFormData.linkName) {
      alert('Please provide both a name and a URL for the link.');
      return;
    }
    try {
      await addDoc(collection(db, 'events', eventId, 'manualLinks'), {
        ...linkFormData,
        createdAt: Timestamp.now(),
      });
      setShowLinkForm(false);
      setLinkFormData({ linkName: '', linkUrl: '' });
      await fetchManualLinks(eventId);
    } catch (err) {
      console.error('❌ Error adding link:', err);
      alert('Failed to add the link.');
    }
  };

  const statusOptions = ["In progress", "Completed", "Suspended", "Yet to Start", "Not Applicable"];
  const headerStyles = {
    details: { backgroundColor: '#3B82F6', color: 'white' },
    actions: { backgroundColor: '#22C55E', color: 'white' },
    volunteers: { backgroundColor: '#F97316', color: 'white' },
    documents: { backgroundColor: '#8B5CF6', color: 'white' },
  };

  if (loading) return <p>Loading program details...</p>;
  if (!event) return <p>Program not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/events" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Programs Dashboard
      </Link>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{event.eventName}</h2>
      
      <CollapsibleSection title="Program Details" headerStyle={headerStyles.details}>
        <p><strong>Date:</strong> {event.eventDate || '—'}</p>
        <p><strong>Location:</strong> {event.location || '—'}</p>
        <p><strong>Mode:</strong> {event.mode || '—'}</p>
        <p><strong>Age Group:</strong> {event.ageGroup || '—'}</p>
        <p><strong>Description:</strong> {event.description || 'No description provided.'}</p>
        <p><strong>Context:</strong> {event.context || '—'}</p>
      </CollapsibleSection>

      <CollapsibleSection title="Action Tracker" defaultOpen={true} headerStyle={headerStyles.actions}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowActionForm(prev => !prev)}>
            {showActionForm ? 'Cancel' : '➕ Add New Action'}
          </button>
        </div>
        {showActionForm && (
          <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4>Add New Action for this Program</h4>
            <input type="text" name="description" placeholder="Action Description*" value={actionFormData.description} onChange={handleActionFormChange} style={{ padding: '0.5rem' }}/>
            <input type="text" name="ownerName" placeholder="Action Owner" value={actionFormData.ownerName} onChange={handleActionFormChange} style={{ padding: '0.5rem' }}/>
            <input type="date" name="dueDate" value={actionFormData.dueDate} onChange={handleActionFormChange} style={{ padding: '0.5rem' }}/>
            <select name="status" value={actionFormData.status} onChange={handleActionFormChange} style={{ padding: '0.5rem' }}>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={handleAddAction} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>✅ Submit Action</button>
          </div>
        )}
        {actions.length > 0 ? (
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead><tr><th>Description</th><th>Owner</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {actions.map(action => (
                <tr key={action.id}>
                  <td>{action.description || '—'}</td>
                  <td>{action.ownerName || '—'}</td>
                  <td>{action.dueDate?.toDate().toLocaleDateString() || '—'}</td>
                  <td>{action.status || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No actions are currently tracked for this program.</p>}
      </CollapsibleSection>
      
      <CollapsibleSection title="Assigned Volunteers" defaultOpen={false} headerStyle={headerStyles.volunteers}>
        {assignedVolunteers.length > 0 ? (
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Assigned Roles</th>
              </tr>
            </thead>
            <tbody>
              {assignedVolunteers.map((vol, index) => (
                <tr key={vol.id || index}>
                  <td>{vol.name}</td>
                  <td>{vol.departmentName}</td>
                  <td>{vol.assignedRoles.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No volunteers have been assigned to this program.</p>}
      </CollapsibleSection>

      <CollapsibleSection title="Related Documents" defaultOpen={false} headerStyle={headerStyles.documents}>
        {manualLinks.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
            {manualLinks.map(link => (
              <li key={link.id} style={{ marginBottom: '0.5rem' }}>
                <a href={link.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>
                  🔗 {link.linkName}
                </a>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '1rem', borderTop: manualLinks.length > 0 ? '1px solid #eee' : 'none', paddingTop: '1rem' }}>
          <button onClick={() => setShowLinkForm(prev => !prev)}>
            {showLinkForm ? 'Cancel' : '➕ Add a Document Link'}
          </button>
        </div>
        {showLinkForm && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input type="text" name="linkName" placeholder="Link Name (e.g., 'Event Photos')" value={linkFormData.linkName} onChange={handleLinkFormChange} style={{ padding: '0.5rem' }}/>
            <input type="url" name="linkUrl" placeholder="Link URL (paste Google Drive link here)" value={linkFormData.linkUrl} onChange={handleLinkFormChange} style={{ padding: '0.5rem' }}/>
            <button onClick={handleAddLink} style={{ alignSelf: 'start', marginTop: '0.5rem' }}>✅ Save Link</button>
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
};

export default EventDetails;
