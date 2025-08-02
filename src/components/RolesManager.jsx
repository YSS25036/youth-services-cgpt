// src/components/RolesManager.jsx

import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const RolesManager = () => {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    category: '',
    responsibilities: '',
    preferredSkills: '',
    timeCommitment: '',
    comments: '',
  });

  const formRef = useRef(null);

  useEffect(() => {
    if (editingRole) {
      setFormData({
        name: editingRole.name || '',
        departmentId: editingRole.departmentId || '',
        category: editingRole.category || '',
        responsibilities: editingRole.responsibilities || '',
        preferredSkills: editingRole.preferredSkills?.join(', ') || '',
        timeCommitment: editingRole.timeCommitment || '',
        comments: editingRole.comments || '',
      });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setFormData({ name: '', departmentId: '', category: '', responsibilities: '', preferredSkills: '', timeCommitment: '', comments: '' });
    }
  }, [editingRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const deptsSnapshot = await getDocs(collection(db, 'departments'));
      const deptsList = deptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDepartments(deptsList);

      const rolesQuery = query(collection(db, 'roles'), orderBy('name'));
      const rolesSnapshot = await getDocs(rolesQuery);
      const rolesList = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoles(rolesList);
    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
      alert("Failed to load data. Please check the console for errors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.departmentId) {
      alert('Please provide a Role Name and select a Department.');
      return;
    }

    const processedData = {
      ...formData,
      preferredSkills: formData.preferredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
    };

    try {
      if (editingRole) {
        const roleRef = doc(db, 'roles', editingRole.id);
        await updateDoc(roleRef, processedData);
        alert('Role updated successfully.');
        setEditingRole(null);
      } else {
        await addDoc(collection(db, 'roles'), processedData);
      }
      fetchData();
    } catch (err) {
      console.error("Error saving role: ", err);
      alert('Failed to save role.');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteDoc(doc(db, 'roles', roleId));
        fetchData();
      } catch (err) {
        console.error("Error deleting role: ", err);
      }
    }
  };

  const getDepartmentName = (deptId) => {
    const department = departments.find(d => d.id === deptId);
    return department ? department.name : 'Unknown';
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Manage Roles</h2>

      <div ref={formRef} style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>{editingRole ? 'Edit Role' : 'Add New Role'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input name="name" placeholder="Role Name*" value={formData.name} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
          <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} style={{ padding: '0.5rem' }}>
            <option value="">Select a Department*</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          <input name="category" placeholder="Role Category" value={formData.category} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
          <input name="timeCommitment" placeholder="Time Commitment (e.g., 5 hrs/week)" value={formData.timeCommitment} onChange={handleInputChange} style={{ padding: '0.5rem' }} />
          <textarea name="responsibilities" placeholder="Roles & Responsibilities" value={formData.responsibilities} onChange={handleInputChange} style={{ padding: '0.5rem', gridColumn: '1 / -1' }} />
          <input name="preferredSkills" placeholder="Preferred Skills (comma-separated)" value={formData.preferredSkills} onChange={handleInputChange} style={{ padding: '0.5rem', gridColumn: '1 / -1' }} />
          <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleInputChange} style={{ padding: '0.5rem', gridColumn: '1 / -1' }} />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={handleFormSubmit}>{editingRole ? '💾 Update Role' : '➕ Add Role'}</button>
          {editingRole && (
            <button onClick={() => setEditingRole(null)}>Cancel Edit</button>
          )}
        </div>
      </div>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Department</th>
            <th>Category</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{getDepartmentName(role.departmentId)}</td>
              <td>{role.category}</td>
              <td>{role.preferredSkills?.join(', ')}</td>
              <td style={{ textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button onClick={() => setEditingRole(role)} style={{ color: 'blue' }}>Edit</button>
                <button onClick={() => handleDeleteRole(role.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesManager;
