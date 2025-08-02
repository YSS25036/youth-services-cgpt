// src/components/AssignVolunteers.jsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, where, doc, updateDoc, documentId } from 'firebase/firestore';
import { db } from '../firebase';

// The Modal component, fully implemented.
const RoleAssignmentModal = ({ isOpen, onClose, departments, roles, onConfirm, initialData = null }) => {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setSelectedDept(initialData.departmentId || '');
      setSelectedRoles(initialData.assignedRoles || []);
    } else {
      setSelectedDept('');
      setSelectedRoles([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const filteredRoles = roles.filter(role => role.departmentId === selectedDept);

  const handleRoleToggle = (roleName) => {
    setSelectedRoles(prev => 
      prev.includes(roleName) ? prev.filter(r => r !== roleName) : [...prev, roleName]
    );
  };
  
  const handleConfirm = () => {
    if (!selectedDept) {
      alert('Please select a department.');
      return;
    }
    onConfirm(selectedDept, selectedRoles);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
        <h3 style={{ marginTop: 0 }}>{initialData ? 'Edit Assignment' : 'Assign Department & Roles'}</h3>
        <label>Department*</label>
        <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedRoles([]); }} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}>
          <option value="">Select a department</option>
          {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
        </select>
        {selectedDept && (
          <div>
            <label>Roles</label>
            <div style={{ border: '1px solid #ccc', padding: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
              {filteredRoles.length > 0 ? filteredRoles.map(role => (
                <div key={role.id}>
                  <input type="checkbox" id={role.id} checked={selectedRoles.includes(role.name)} onChange={() => handleRoleToggle(role.name)} />
                  <label htmlFor={role.id} style={{ marginLeft: '0.5rem' }}>{role.name}</label>
                </div>
              )) : <p>No roles found for this department.</p>}
            </div>
          </div>
        )}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm} style={{ fontWeight: 'bold' }}>{initialData ? 'Update Assignment' : 'Confirm Assignment'}</button>
        </div>
      </div>
    </div>
  );
};


const AssignVolunteers = () => {
  // All state variables.
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [volunteersToAssign, setVolunteersToAssign] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // ✅ FIXED: The initial data fetch logic is now fully implemented.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volSnap, eventSnap, deptSnap, roleSnap] = await Promise.all([
          getDocs(collection(db, 'volunteers')),
          getDocs(collection(db, 'events')),
          getDocs(collection(db, 'departments')),
          getDocs(collection(db, 'roles')),
        ]);
        setAllVolunteers(volSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setEvents(eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDepartments(deptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setRoles(roleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchData();
  }, []);

  // This fetches assignments whenever a new event is selected.
  const fetchAssignments = async () => {
    if (!selectedEvent) {
      setAssignments([]);
      return;
    }
    try {
      const q = query(collection(db, 'event_participation'), where('eventId', '==', selectedEvent));
      const assignmentsSnap = await getDocs(q);
      setAssignments(assignmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };
  
  useEffect(() => {
    fetchAssignments();
  }, [selectedEvent]);

  // This handler manages both Add and Edit confirmations from the modal.
  const handleConfirmAssignment = async (departmentId, assignedRoles) => {
    if (editingAssignment) {
      try {
        const assignmentRef = doc(db, 'event_participation', editingAssignment.assignmentId);
        await updateDoc(assignmentRef, { departmentId, assignedRoles });
        alert('Assignment updated successfully.');
      } catch (err) {
        console.error('Update error:', err);
        alert('Failed to update assignment.');
      }
    } else {
      const assignmentsToCreate = volunteersToAssign.map(volunteerId => ({
        eventId: selectedEvent, volunteerId, departmentId, assignedRoles, status: 'Assigned', timestamp: new Date(),
      }));
      try {
        for (const assignment of assignmentsToCreate) {
          await addDoc(collection(db, 'event_participation'), assignment);
        }
        alert(`${assignmentsToCreate.length} volunteer(s) assigned successfully.`);
      } catch (err) {
        console.error('Assignment error:', err);
        alert('Failed to assign volunteers.');
      }
    }
    setIsModalOpen(false);
    setEditingAssignment(null);
    setVolunteersToAssign([]);
    fetchAssignments();
  };

  // This handler opens the modal in "edit" mode.
  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };
  
  // This handler opens the modal in "add" mode.
  const handleOpenModal = () => {
    if (volunteersToAssign.length === 0) {
      alert('Please select at least one volunteer to assign.');
      return;
    }
    setEditingAssignment(null);
    setIsModalOpen(true);
  };
  
  // This handler manages checkbox selection.
  const handleSelectVolunteer = (volId) => {
    setVolunteersToAssign(prev =>
      prev.includes(volId) ? prev.filter(id => id !== volId) : [...prev, volId]
    );
  };

  // Logic to determine which volunteers are assigned vs. unassigned.
  const assignedVolIds = new Set(assignments.map(a => a.volunteerId));
  const unassignedVolunteers = allVolunteers.filter(v => !assignedVolIds.has(v.id));
  const assignedVolunteersDetails = assignments.map(assign => {
    const volunteer = allVolunteers.find(v => v.id === assign.volunteerId);
    const department = departments.find(d => d.id === assign.departmentId);
    return { ...volunteer, assignmentId: assign.id, departmentName: department ? department.name : 'N/A', assignedRoles: assign.assignedRoles || [] };
  }).filter(v => v.id);

  // The full JSX return statement.
  return (
    <div style={{ padding: '2rem' }}>
      <RoleAssignmentModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingAssignment(null); }}
        departments={departments}
        roles={roles}
        onConfirm={handleConfirmAssignment}
        initialData={editingAssignment}
      />
      <h2>Assign Volunteers to Event</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Select Event: </label>
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">-- Select an event --</option>
          {events.map(event => <option key={event.id} value={event.id}>{event.eventName}</option>)}
        </select>
      </div>
      
      {selectedEvent ? (
        <>
          <h3>Unassigned Volunteers</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
            <thead>
              <tr><th>Select</th><th>Name</th><th>City</th><th>Skills</th></tr>
            </thead>
            <tbody>
              {unassignedVolunteers.map(vol => (
                <tr key={vol.id}>
                  <td><input type="checkbox" checked={volunteersToAssign.includes(vol.id)} onChange={() => handleSelectVolunteer(vol.id)} /></td>
                  <td>{vol.name}</td>
                  <td>{vol.city}</td>
                  <td>{vol.skills}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleOpenModal}>Assign Selected Volunteers</button>

          <h3 style={{ marginTop: '2rem' }}>Already Assigned Volunteers</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr><th>Name</th><th>Department</th><th>Assigned Roles</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {assignedVolunteersDetails.map(vol => (
                <tr key={vol.assignmentId}>
                  <td>{vol.name}</td>
                  <td>{vol.departmentName}</td>
                  <td>{vol.assignedRoles.join(', ')}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleEditAssignment(vol)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={{ marginTop: '2rem', padding: '2rem', border: '1px dashed #ccc', textAlign: 'center', backgroundColor: '#fafafa' }}>
          <p>Please select an event from the dropdown above to begin assigning volunteers.</p>
        </div>
      )}
    </div>
  );
};

export default AssignVolunteers;
